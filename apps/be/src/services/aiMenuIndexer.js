const { GoogleGenAI } = require("@google/genai");
const cache = require("./cache");
const { MENU_CACHE_VERSION_KEY } = require("../config/cache");

const EMBEDDING_MODEL = "gemini-embedding-2";
const INDEX_TTL_SECONDS = 1800; // 30 minutes
const QUERY_EMBED_TTL_SECONDS = 3600; // 1 hour

let genAiClient = null;
let inMemoryIndex = {
  version: null,
  items: [],
  expiresAt: 0,
};

function getGenAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({ apiKey });
  }
  return genAiClient;
}

/**
 * Chuẩn hóa chuỗi tiếng Việt (bỏ dấu, chữ thường) phục vụ Sparse Lexical Search & Allergen Matching
 */
function normalizeVietnamese(str = "") {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(str = "") {
  const norm = normalizeVietnamese(str);
  if (!norm) return [];
  return norm.split(" ").filter((t) => t.length >= 2);
}

/**
 * Tự động suy luận nhãn ẩm thực (Dietary & Flavor Tags) từ tên, mô tả và danh mục món ăn
 */
function inferDietaryTags(item) {
  const rawText = `${item.name || ""} ${item.description || ""} ${item.category_name || ""}`;
  const norm = normalizeVietnamese(rawText);
  const normForSpicy = norm.replace(
    /\b(trai cay|khong cay|ko cay|chua cay|it cay)\b/g,
    " ",
  );

  const isSpicy =
    /\b(cay|ot|sa te|tieu den|spicy|chili|hot|mala|kim chi|kimchi|tom yum)\b/.test(
      normForSpicy,
    );
  const isVegetarian =
    /\b(chay|rau cu|nam|dau hu|salad|vegan|vegetarian|tofu)\b/.test(norm) &&
    !/\b(bo|ga|heo|lon|tom|cua|ca|muc|hai san|beef|pork|chicken|shrimp|seafood)\b/.test(
      norm,
    );
  const isDrink =
    /\b(nuoc|tra|ca phe|coffee|sinh to|ep|bia|ruou|coca|pepsi|soda|drink|beverage|cocktail|mocktail|latte|matcha)\b/.test(
      norm,
    );
  const isDessert =
    /\b(trang mieng|banh ngot|kem|che|pudding|flan|tiramisu|dessert|cake|ice cream|buah)\b/.test(
      norm,
    );
  const isStarter =
    /\b(khai vi|sup|soup|goi|salad|khoai tay chien|starter|appetizer|nem|cha gio)\b/.test(
      norm,
    );

  const allergens = [];
  if (/\b(tom|cua|ghe|muc|ngheu|so|oc|hai san|shrimp|crab|seafood|shellfish|ca|fish)\b/.test(norm)) {
    allergens.push("seafood", "hai san", "tom", "ca");
  }
  if (/\b(dau phong|lac|hat dieu|hanh nhan|oc cho|peanut|nut|nuts)\b/.test(norm)) {
    allergens.push("peanut", "dau phong", "lac", "nut");
  }
  if (/\b(sua|pho mai|cheese|kem|bo|milk|dairy|cream|butter|latte)\b/.test(norm)) {
    allergens.push("dairy", "sua", "pho mai");
  }
  if (/\b(trung|egg)\b/.test(norm)) {
    allergens.push("egg", "trung");
  }
  if (/\b(my|mi|banh mi|bot mi|pasta|spaghetti|pizza|gluten|wheat|bread|noodle)\b/.test(norm)) {
    allergens.push("gluten", "bot mi");
  }

  let courseType = "main";
  if (isDrink) courseType = "drink";
  else if (isDessert) courseType = "dessert";
  else if (isStarter) courseType = "starter";

  return {
    isSpicy,
    isVegetarian,
    courseType,
    allergens: Array.from(new Set(allergens)),
  };
}

/**
 * Xây dựng văn bản ngữ nghĩa giàu thông tin (Semantic Card) cho mỗi món ăn
 */
function buildSemanticDocument(item) {
  const tags = item.dietaryTags || inferDietaryTags(item);
  const modText = Array.isArray(item.modifier_groups)
    ? item.modifier_groups
        .map(
          (g) =>
            `${g.name}: ${(g.options || []).map((o) => o.name).join(", ")}`,
        )
        .join("; ")
    : "";

  return [
    `Món ăn: ${item.name}`,
    `Danh mục: ${item.category_name || "Món chính"}`,
    `Giá: ${Number(item.price).toLocaleString("vi-VN")} VND`,
    item.description ? `Mô tả: ${item.description}` : "",
    modText ? `Tùy chọn thêm: ${modText}` : "",
    item.is_chef_recommended ? "Đặc trưng: Bếp trưởng khuyên dùng (Chef Recommended)" : "",
    Number(item.total_ordered) > 0 ? `Độ phổ biến: Đã phục vụ ${item.total_ordered} phần` : "",
    `Phân loại: ${tags.courseType}, ${tags.isSpicy ? "có vị cay" : "không cay"}${tags.isVegetarian ? ", món chay" : ""}`,
  ]
    .filter(Boolean)
    .join(" | ");
}

function extractEmbeddingVector(embedResponse) {
  if (!embedResponse) return null;
  if (Array.isArray(embedResponse.embeddings) && embedResponse.embeddings[0]?.values) {
    return embedResponse.embeddings[0].values;
  }
  if (embedResponse.embedding?.values) {
    return embedResponse.embedding.values;
  }
  return null;
}

async function embedText(text) {
  const client = getGenAiClient();
  if (!client || !text) return null;

  const cacheKey = cache.buildKey([
    "ai:embed",
    EMBEDDING_MODEL,
    cache.encodeOrHash(text),
  ]);
  const cached = await cache.getJson(cacheKey);
  if (Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  try {
    const response = await client.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
    });
    const vec = extractEmbeddingVector(response);
    if (Array.isArray(vec) && vec.length > 0) {
      await cache.setJson(cacheKey, QUERY_EMBED_TTL_SECONDS, vec);
      return vec;
    }
  } catch (err) {
    console.warn("[aiMenuIndexer] embedText fallback (API unavailable):", err.message);
  }
  return null;
}

function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i += 1) {
    const a = Number(vecA[i]) || 0;
    const b = Number(vecB[i]) || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

/**
 * Truy vấn danh mục món ăn đầy đủ từ PostgreSQL
 */
async function fetchCatalogFromDb() {
  const db = require("../config/db");
  const sql = `
    SELECT
      i.id,
      i.category_id,
      i.name,
      i.description,
      i.price,
      i.prep_time_minutes,
      i.status,
      i.is_chef_recommended,
      c.name AS category_name,
      p.url AS image_url,
      COALESCE(SUM(oi.quantity), 0)::int AS total_ordered
    FROM menu_items i
    JOIN menu_categories c ON c.id = i.category_id
    LEFT JOIN menu_item_photos p
      ON p.menu_item_id = i.id
     AND p.is_primary = true
    LEFT JOIN order_items oi
      ON oi.menu_item_id = i.id
     AND oi.status != 'rejected'
    WHERE i.is_deleted = false
      AND i.status = 'available'
      AND c.status = 'active'
    GROUP BY i.id, c.name, p.url, c.display_order
    ORDER BY i.is_chef_recommended DESC, total_ordered DESC, c.display_order ASC, i.name ASC
  `;
  const result = await db.query(sql);
  return result.rows || [];
}

/**
 * Chuẩn bị Catalog đã được enrich ngữ nghĩa, tokens BM25 và (tùy chọn) Dense Vector Embeddings
 */
async function getIndexedCatalog({ customItems = null, skipEmbeddings = false } = {}) {
  if (Array.isArray(customItems)) {
    return customItems.map((raw) => enrichCatalogItem(raw));
  }

  const version = await cache.getVersion(MENU_CACHE_VERSION_KEY);
  const now = Date.now();

  if (
    inMemoryIndex.version === version &&
    inMemoryIndex.items.length > 0 &&
    inMemoryIndex.expiresAt > now
  ) {
    return inMemoryIndex.items;
  }

  const redisKey = cache.buildKey(["ai:menu:index", `v:${version}`]);
  const cachedItems = await cache.getJson(redisKey);
  if (Array.isArray(cachedItems) && cachedItems.length > 0) {
    inMemoryIndex = {
      version,
      items: cachedItems,
      expiresAt: now + INDEX_TTL_SECONDS * 1000,
    };
    return cachedItems;
  }

  const rows = await fetchCatalogFromDb();
  const enriched = rows.map((row) => enrichCatalogItem(row));

  const client = getGenAiClient();
  if (client && !skipEmbeddings && enriched.length > 0 && enriched.length <= 80) {
    await Promise.all(
      enriched.map(async (item) => {
        const vec = await embedText(item.semanticDoc);
        if (vec) {
          item.embedding = vec;
        }
      }),
    );
  }

  await cache.setJson(redisKey, INDEX_TTL_SECONDS, enriched);
  inMemoryIndex = {
    version,
    items: enriched,
    expiresAt: now + INDEX_TTL_SECONDS * 1000,
  };

  return enriched;
}

function enrichCatalogItem(raw) {
  const price = Number(raw.price) || 0;
  const dietaryTags = raw.dietaryTags || inferDietaryTags(raw);
  const item = {
    id: raw.id,
    category_id: raw.category_id,
    category_name: raw.category_name || "Món chính",
    name: raw.name,
    description: raw.description || "",
    price,
    prep_time_minutes: Number(raw.prep_time_minutes) || 15,
    status: raw.status || "available",
    is_chef_recommended: Boolean(raw.is_chef_recommended),
    image_url: raw.image_url || raw.image || null,
    total_ordered: Number(raw.total_ordered) || 0,
    dietaryTags,
    embedding: raw.embedding || null,
  };

  item.semanticDoc = buildSemanticDocument(item);
  item.normText = normalizeVietnamese(
    `${item.name} ${item.category_name} ${item.description} ${dietaryTags.courseType}`,
  );
  item.tokens = tokenize(item.normText);
  return item;
}

/**
 * Tính điểm BM25 Okapi + Exact Phrase Boost cho Sparse Lexical Leg
 */
function computeLexicalScores(items, query) {
  const queryNorm = normalizeVietnamese(query);
  const queryTokens = tokenize(queryNorm);
  if (!queryTokens.length) {
    return items.map((item) => ({ id: item.id, score: 0 }));
  }

  const N = items.length || 1;
  const avgDl =
    items.reduce((acc, it) => acc + (it.tokens?.length || 1), 0) / N || 1;
  const k1 = 1.5;
  const b = 0.75;

  const docFreq = {};
  for (const qToken of queryTokens) {
    docFreq[qToken] = items.filter((it) =>
      (it.tokens || []).includes(qToken),
    ).length;
  }

  return items.map((item) => {
    const tokens = item.tokens || [];
    const dl = tokens.length || 1;
    let score = 0;

    for (const qToken of queryTokens) {
      const tf = tokens.filter((t) => t === qToken).length;
      if (tf > 0) {
        const df = docFreq[qToken] || 0.5;
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        const num = tf * (k1 + 1);
        const den = tf + k1 * (1 - b + b * (dl / avgDl));
        score += idf * (num / den);
      }
    }

    // Exact substring boost on normalized dish name / category
    const normName = normalizeVietnamese(item.name);
    if (queryNorm && normName.includes(queryNorm)) {
      score += 5.0;
    } else if (queryNorm && item.normText.includes(queryNorm)) {
      score += 2.5;
    }

    return { id: item.id, score };
  });
}

/**
 * Leg 3: Bộ lọc điều kiện cứng (Hard Constraints & Fail-Closed Allergen Safety)
 */
function applyHardConstraints(items, filters = {}) {
  const {
    maxPrice = null,
    minPrice = null,
    category = null,
    onlyChefRecommended = false,
    excludeSpicy = false,
    onlyVegetarian = false,
    courseType = null,
    excludeAllergens = [],
  } = filters;

  const normCategory = category ? normalizeVietnamese(category) : null;
  const normAllergens = (Array.isArray(excludeAllergens) ? excludeAllergens : [])
    .map((a) => normalizeVietnamese(a))
    .filter(Boolean);

  return items.filter((item) => {
    if (item.status && item.status !== "available") return false;

    if (maxPrice !== null && maxPrice !== undefined && Number(maxPrice) > 0) {
      if (item.price > Number(maxPrice)) return false;
    }

    if (minPrice !== null && minPrice !== undefined && Number(minPrice) > 0) {
      if (item.price < Number(minPrice)) return false;
    }

    if (onlyChefRecommended && !item.is_chef_recommended) {
      return false;
    }

    if (excludeSpicy && item.dietaryTags?.isSpicy) {
      return false;
    }

    if (onlyVegetarian && !item.dietaryTags?.isVegetarian) {
      return false;
    }

    if (courseType && item.dietaryTags?.courseType !== courseType) {
      return false;
    }

    if (normCategory) {
      const itemCatNorm = normalizeVietnamese(item.category_name);
      if (!itemCatNorm.includes(normCategory) && !normCategory.includes(itemCatNorm)) {
        return false;
      }
    }

    // Fail-closed allergen check: kiểm tra cả trong dietaryTags.allergens và normText của món
    if (normAllergens.length > 0) {
      const itemAllergens = (item.dietaryTags?.allergens || []).map((a) =>
        normalizeVietnamese(a),
      );
      for (const allergen of normAllergens) {
        if (
          itemAllergens.some((ia) => ia.includes(allergen) || allergen.includes(ia)) ||
          item.normText.includes(allergen)
        ) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * 3-Leg Hybrid Search kết hợp Reciprocal Rank Fusion (RRF)
 * - Leg 1: Dense Vector Search (`gemini-embedding-2`)
 * - Leg 2: Sparse Lexical Search (BM25 Okapi + Vietnamese Normalization)
 * - Leg 3: Hard Constraint & Allergen Filter
 */
async function searchMenuHybrid({
  query = "",
  maxPrice = null,
  minPrice = null,
  category = null,
  onlyChefRecommended = false,
  excludeSpicy = false,
  onlyVegetarian = false,
  courseType = null,
  excludeAllergens = [],
  limit = 6,
  customItems = null,
  skipEmbeddings = false,
} = {}) {
  const catalog = await getIndexedCatalog({ customItems, skipEmbeddings });

  // Leg 3: Hard Constraint Filtering (Fail-Closed)
  const candidates = applyHardConstraints(catalog, {
    maxPrice,
    minPrice,
    category,
    onlyChefRecommended,
    excludeSpicy,
    onlyVegetarian,
    courseType,
    excludeAllergens,
  });

  if (candidates.length === 0) {
    return [];
  }

  // Leg 2: Sparse Lexical Scoring
  const lexicalScores = computeLexicalScores(candidates, query);
  const lexicalRankMap = new Map();
  [...lexicalScores]
    .sort((a, b) => b.score - a.score)
    .forEach((entry, idx) => {
      if (entry.score > 0) {
        lexicalRankMap.set(entry.id, idx + 1);
      }
    });

  // Leg 1: Dense Semantic Scoring (if query is present and embeddings are enabled)
  const denseRankMap = new Map();
  const hasItemEmbeddings = candidates.some((c) => Array.isArray(c.embedding));
  if (query && !skipEmbeddings && hasItemEmbeddings) {
    const queryVec = await embedText(query);
    if (queryVec) {
      const denseScores = candidates.map((item) => ({
        id: item.id,
        score: item.embedding ? cosineSimilarity(queryVec, item.embedding) : 0,
      }));
      denseScores
        .sort((a, b) => b.score - a.score)
        .forEach((entry, idx) => {
          if (entry.score > 0.25) {
            denseRankMap.set(entry.id, idx + 1);
          }
        });
    }
  }

  // Reciprocal Rank Fusion (RRF) + Soft Popularity/Chef Boosting
  const RRF_K = 60;
  const maxOrdered = Math.max(1, ...candidates.map((c) => c.total_ordered || 0));

  const fused = candidates.map((item) => {
    const lexRank = lexicalRankMap.get(item.id);
    const denseRank = denseRankMap.get(item.id);

    let rrfScore = 0;
    if (lexRank) rrfScore += 1 / (RRF_K + lexRank);
    if (denseRank) rrfScore += 1 / (RRF_K + denseRank);

    // Soft boost for Chef Recommended & Best-seller popularity
    const chefBoost = item.is_chef_recommended ? 0.004 : 0;
    const popBoost = ((item.total_ordered || 0) / maxOrdered) * 0.003;

    const finalScore = rrfScore + chefBoost + popBoost;

    return {
      ...formatGroundedDish(item),
      _score: Number(finalScore.toFixed(6)),
      _matchedLexical: Boolean(lexRank),
      _matchedSemantic: Boolean(denseRank),
    };
  });

  // Nếu có query nhưng không khớp từ khóa cụ thể nào (ví dụ: "gợi ý món ngon"), ưu tiên món khớp hoặc Best-seller
  const hasAnyQueryMatch =
    lexicalRankMap.size > 0 || denseRankMap.size > 0;

  const filteredFused =
    query && hasAnyQueryMatch
      ? fused.filter((f) => f._matchedLexical || f._matchedSemantic)
      : fused;

  const finalResults = (filteredFused.length > 0 ? filteredFused : fused)
    .sort((a, b) => b._score - a._score || a.price - b.price)
    .slice(0, Math.max(1, Math.min(20, Number(limit) || 6)));

  return finalResults;
}

/**
 * Fail-Closed Combo Builder:
 * Xây dựng thực đơn theo nhóm (partySize) và ngân sách cứng (budgetVnd),
 * đảm bảo tổng tiền <= budgetVnd tuyệt đối.
 */
async function buildSmartCombo({
  partySize = 2,
  budgetVnd = 300000,
  excludeSpicy = false,
  onlyVegetarian = false,
  excludeAllergens = [],
  preferences = "",
  customItems = null,
  skipEmbeddings = true,
} = {}) {
  const numPeople = Math.max(1, Math.min(20, Number(partySize) || 2));
  const maxBudget = Math.max(10000, Number(budgetVnd) || 300000);

  const candidates = await searchMenuHybrid({
    query: preferences,
    excludeSpicy,
    onlyVegetarian,
    excludeAllergens,
    limit: 50,
    customItems,
    skipEmbeddings,
  });

  const affordable = candidates.filter((c) => c.price > 0 && c.price <= maxBudget);
  if (affordable.length === 0) {
    return {
      valid: false,
      partySize: numPeople,
      budgetVnd: maxBudget,
      totalPrice: 0,
      remainingBudget: maxBudget,
      items: [],
      message: `Không tìm thấy tổ hợp món ăn phù hợp dưới mức ngân sách ${maxBudget.toLocaleString("vi-VN")}đ.`,
    };
  }

  const mains = affordable.filter((i) => i.courseType === "main");
  const starters = affordable.filter((i) => i.courseType === "starter");
  const drinks = affordable.filter((i) => i.courseType === "drink");
  const desserts = affordable.filter((i) => i.courseType === "dessert");

  const selectedMap = new Map();
  let currentTotal = 0;

  const tryAddDish = (dish, qty = 1) => {
    if (!dish) return false;
    const cost = dish.price * qty;
    if (currentTotal + cost > maxBudget) return false;

    const existing = selectedMap.get(dish.id);
    if (existing) {
      existing.quantity += qty;
      existing.subtotal = existing.quantity * existing.price;
    } else {
      selectedMap.set(dish.id, {
        ...dish,
        quantity: qty,
        subtotal: cost,
      });
    }
    currentTotal += cost;
    return true;
  };

  // Bước 1: Chọn món chính (Main courses) cho số người ăn
  const mainPool = mains.length > 0 ? mains : affordable;
  let mainsNeeded = numPeople;
  for (const dish of mainPool) {
    if (mainsNeeded <= 0) break;
    if (tryAddDish(dish, 1)) {
      mainsNeeded -= 1;
    }
  }

  // Bước 2: Chọn đồ uống (Drinks) nếu ngân sách còn đủ
  if (drinks.length > 0) {
    let drinksNeeded = numPeople;
    for (const drink of drinks) {
      if (drinksNeeded <= 0) break;
      if (tryAddDish(drink, 1)) {
        drinksNeeded -= 1;
      }
    }
  }

  // Bước 3: Chọn món khai vị / ăn kèm (Starter) chia sẻ chung bàn
  if (starters.length > 0) {
    for (const starter of starters) {
      if (tryAddDish(starter, 1)) break;
    }
  }

  // Bước 4: Chọn tráng miệng (Dessert) nếu vẫn còn dư ngân sách
  if (desserts.length > 0) {
    for (const dessert of desserts) {
      if (tryAddDish(dessert, 1)) break;
    }
  }

  // Nếu bước 1-4 chưa chọn được món nào do món đầu quá đắt, chọn món rẻ nhất có thể
  if (selectedMap.size === 0) {
    const cheapest = [...affordable].sort((a, b) => a.price - b.price)[0];
    if (cheapest) {
      tryAddDish(cheapest, 1);
    }
  }

  const comboItems = Array.from(selectedMap.values());

  return {
    valid: comboItems.length > 0 && currentTotal <= maxBudget,
    partySize: numPeople,
    budgetVnd: maxBudget,
    totalPrice: currentTotal,
    remainingBudget: Math.max(0, maxBudget - currentTotal),
    items: comboItems,
    message:
      comboItems.length > 0
        ? `Combo gợi ý cho ${numPeople} người gồm ${comboItems.reduce((s, i) => s + i.quantity, 0)} phần với tổng chi phí ${currentTotal.toLocaleString("vi-VN")}đ (tiết kiệm ${(maxBudget - currentTotal).toLocaleString("vi-VN")}đ so với ngân sách).`
        : "Không tìm thấy combo phù hợp ngân sách.",
  };
}

function formatGroundedDish(item) {
  return {
    id: item.id,
    name: item.name,
    category_id: item.category_id,
    category_name: item.category_name || "Món chính",
    description: item.description || "",
    price: Number(item.price) || 0,
    prep_time_minutes: Number(item.prep_time_minutes) || 15,
    is_chef_recommended: Boolean(item.is_chef_recommended),
    image_url: item.image_url || null,
    total_ordered: Number(item.total_ordered) || 0,
    courseType: item.dietaryTags?.courseType || "main",
    isSpicy: Boolean(item.dietaryTags?.isSpicy),
    isVegetarian: Boolean(item.dietaryTags?.isVegetarian),
    allergens: item.dietaryTags?.allergens || [],
  };
}

module.exports = {
  normalizeVietnamese,
  tokenize,
  inferDietaryTags,
  buildSemanticDocument,
  getIndexedCatalog,
  searchMenuHybrid,
  buildSmartCombo,
  formatGroundedDish,
};
