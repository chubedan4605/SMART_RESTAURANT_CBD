const { GoogleGenAI } = require("@google/genai");
const {
  getIndexedCatalog,
  searchMenuHybrid,
  buildSmartCombo,
  normalizeVietnamese,
} = require("./aiMenuIndexer");

const AGENT_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

let genAiClient = null;
function getGenAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({ apiKey });
  }
  return genAiClient;
}

/**
 * Định nghĩa bộ 3 Agentic Tools theo chuẩn Interactions API (@google/genai >= 2.29.1)
 */
const DINING_AGENT_TOOLS = [
  {
    type: "function",
    name: "search_menu_semantic",
    description:
      "Search the restaurant's live menu using 3-leg hybrid retrieval (semantic + Vietnamese keyword + hard price/allergen/spicy filters). Always call this tool before recommending specific dishes.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keywords describing dish name, flavor, ingredient, or category (e.g. 'bo bit tet', 'hai san', 'thanh dam', 'trang mieng').",
        },
        max_price: {
          type: "number",
          description: "Maximum price per dish in VND (e.g. 150000).",
        },
        only_chef_recommended: {
          type: "boolean",
          description: "Set true if the customer asks for signature, best-seller, or chef's recommended dishes.",
        },
        exclude_spicy: {
          type: "boolean",
          description: "Set true if the customer cannot eat spicy food.",
        },
        only_vegetarian: {
          type: "boolean",
          description: "Set true if the customer requests vegetarian/vegan dishes.",
        },
        exclude_allergens: {
          type: "array",
          items: { type: "string" },
          description: "List of allergens or ingredients to strictly exclude (e.g. ['hai san', 'dau phong', 'sua']).",
        },
        limit: {
          type: "number",
          description: "Maximum number of dishes to return (default 5).",
        },
      },
    },
  },
  {
    type: "function",
    name: "build_combo_recommendation",
    description:
      "Build a complete meal combo for a group of diners under a strict total budget in VND (Fail-Closed Budget Math). Use when customer mentions number of people or total meal budget.",
    parameters: {
      type: "object",
      properties: {
        party_size: {
          type: "number",
          description: "Number of diners (e.g. 2, 4).",
        },
        budget_vnd: {
          type: "number",
          description: "Maximum total budget in VND for the entire combo (e.g. 300000, 500000).",
        },
        exclude_spicy: {
          type: "boolean",
          description: "Exclude spicy dishes from the combo.",
        },
        only_vegetarian: {
          type: "boolean",
          description: "Only include vegetarian dishes.",
        },
        exclude_allergens: {
          type: "array",
          items: { type: "string" },
          description: "Allergens to strictly exclude from the combo.",
        },
        preferences: {
          type: "string",
          description: "Additional flavor or ingredient preferences.",
        },
      },
      required: ["party_size", "budget_vnd"],
    },
  },
  {
    type: "function",
    name: "mutate_customer_cart",
    description:
      "Add or remove dishes directly in the customer's live shopping cart when the customer explicitly asks to order, add, or put items into their cart.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["add", "remove"],
          description: "Whether to add items to the cart or remove them.",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              dish_name_or_id: {
                type: "string",
                description: "Exact dish ID or dish name from the menu.",
              },
              quantity: {
                type: "number",
                description: "Quantity to add/remove (default 1).",
              },
              note: {
                type: "string",
                description: "Special preparation note (e.g. 'ít cay', 'không hành').",
              },
            },
            required: ["dish_name_or_id"],
          },
          description: "List of dishes to mutate in the cart.",
        },
      },
      required: ["action", "items"],
    },
  },
];

/**
 * Dining Context Resolver: Tổng hợp ngữ cảnh bàn ăn, giỏ hàng hiện tại và ngôn ngữ
 */
function resolveDiningContext({
  tableCode = null,
  cartItems = [],
  language = "vi",
} = {}) {
  const safeCart = Array.isArray(cartItems) ? cartItems : [];
  const cartTotalVnd = safeCart.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1),
    0,
  );
  const cartCount = safeCart.reduce(
    (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
    0,
  );

  const cartSummaryText =
    safeCart.length > 0
      ? safeCart
          .map(
            (i) =>
              `${i.quantity || 1}x ${i.name} (${Number(i.price || 0).toLocaleString("vi-VN")}đ)`,
          )
          .join(", ")
      : "Chưa có món nào trong giỏ";

  return {
    tableCode: tableCode || "Khách tại bàn",
    language: language === "en" ? "en" : "vi",
    cartCount,
    cartTotalVnd,
    cartSummaryText,
  };
}

function buildSystemInstruction(diningContext) {
  const isEn = diningContext.language === "en";
  return [
    "You are the AI Sommelier & Smart Dining Assistant at Lumière Bistro.",
    `Current Dining Context: Table=${diningContext.tableCode} | Current Cart (${diningContext.cartCount} items, ${diningContext.cartTotalVnd.toLocaleString("vi-VN")} VND): ${diningContext.cartSummaryText}.`,
    "CRITICAL RULES:",
    "1. When the customer simply greets you (e.g. 'hi', 'hello', 'chào bạn', 'alo'), respond warmly as the AI Sommelier, introduce how you can help (recommend signature dishes, filter dietary restrictions, build budget combos, or order directly into cart), WITHOUT calling menu tools or forcing dish lists unless they explicitly ask.",
    "2. NEVER invent or hallucinate dishes or prices. Always use `search_menu_semantic` or `build_combo_recommendation` to retrieve real dishes from the live menu.",
    "3. Respect all dietary restrictions and allergens strictly (Fail-Closed Safety). If a customer mentions an allergy or 'no spicy', pass `exclude_allergens` or `exclude_spicy: true` to the tools.",
    "4. When the customer asks for a group meal or budget combo (e.g. 'combo 2 người dưới 300k'), ALWAYS call `build_combo_recommendation` so the total price is mathematically guaranteed to be within budget.",
    "5. When the customer explicitly asks to order or add items to their cart (e.g. 'Thêm cho mình 2 phần...', 'Lấy cho anh...'), call `mutate_customer_cart` to add the dishes directly to their cart.",
    isEn
      ? "6. Respond warmly, concisely, and professionally in English. Highlight dish names, prices in VND, and why they match the guest's request."
      : "6. Trả lời thân thiện, tinh tế, ngắn gọn bằng Tiếng Việt như một chuyên gia ẩm thực thực thụ. Nêu rõ tên món, mức giá (VNĐ) và lý do phù hợp với khẩu vị của khách.",
  ].join("\n");
}

/**
 * Thực thi hàm `mutate_customer_cart` có đối chiếu Grounding với danh mục món thực tế
 */
async function resolveCartMutation({
  action = "add",
  items = [],
  customItems = null,
}) {
  const catalog = await getIndexedCatalog({
    customItems,
    skipEmbeddings: true,
  });
  const cartActions = [];
  const matchedDishes = [];

  for (const reqItem of items || []) {
    const rawKey = String(reqItem.dish_name_or_id || "").trim();
    if (!rawKey) continue;

    const normKey = normalizeVietnamese(rawKey);
    const quantity = Math.max(1, Math.min(20, Number(reqItem.quantity) || 1));
    const note = reqItem.note ? String(reqItem.note).trim() : "";

    // 1. Tìm chính xác theo ID hoặc tên chuẩn hóa
    let matched = catalog.find(
      (c) =>
        String(c.id) === rawKey || normalizeVietnamese(c.name) === normKey,
    );

    // 2. Nếu chưa khớp 100%, tìm theo substring tên món
    if (!matched) {
      matched = catalog.find(
        (c) =>
          normalizeVietnamese(c.name).includes(normKey) ||
          normKey.includes(normalizeVietnamese(c.name)),
      );
    }

    // 3. Nếu vẫn chưa thấy, dùng lexical search lấy top 1
    if (!matched) {
      const topHits = await searchMenuHybrid({
        query: rawKey,
        limit: 1,
        customItems: catalog,
        skipEmbeddings: true,
      });
      matched = topHits[0] || null;
    }

    if (matched) {
      cartActions.push({
        action: action === "remove" ? "remove" : "add",
        dish: {
          id: matched.id,
          name: matched.name,
          price: Number(matched.price) || 0,
          image_url: matched.image_url || null,
          category_name: matched.category_name || "Món chính",
        },
        quantity,
        note,
      });
      matchedDishes.push(matched);
    }
  }

  return {
    success: cartActions.length > 0,
    cartActions,
    matchedDishes,
  };
}

/**
 * Phân tích câu hỏi tự nhiên (Intent & Constraint Parser) phục vụ cả Tool Fallback & Grounding
 */
function parseUserIntentAndConstraints(message = "") {
  const norm = normalizeVietnamese(message);

  // Phát hiện ngân sách: "300k", "300 nghin", "300 ngan", "300.000", "300000"
  let budgetVnd = null;
  const kMatch = norm.match(/\b(\d{2,4})\s*(k|nghin|ngan)\b/);
  const fullMatch = message.match(/\b(\d{2,3})[.,](\d{3})\b/) || norm.match(/\b(\d{5,7})\b/);
  if (kMatch) {
    budgetVnd = Number(kMatch[1]) * 1000;
  } else if (fullMatch) {
    budgetVnd =
      fullMatch.length >= 3
        ? Number(`${fullMatch[1]}${fullMatch[2]}`)
        : Number(fullMatch[1]);
  }

  // Phát hiện số người: "2 nguoi", "nhom 4 nguoi", "combo 3 nguoi"
  let partySize = null;
  const peopleMatch = norm.match(/\b(\d{1,2})\s*(nguoi|khach|phan|suat|people|person|pax)\b/);
  if (peopleMatch) {
    partySize = Number(peopleMatch[1]);
  }

  const isComboIntent =
    /\b(combo|set|nhom|di \d+\s*nguoi|tu van thuc don)\b/.test(norm) ||
    (Boolean(partySize) && Boolean(budgetVnd));

  const isOrderIntent =
    /\b(them vao gio|dat mon|cho minh goi|lay cho minh|order giup|them giup|cho \d+\s*phan|goi \d+\s*phan|add to cart)\b/.test(
      norm,
    );

  const excludeSpicy =
    /\b(khong cay|ko cay|it cay|khong an cay|non spicy|no spicy|thanh dam)\b/.test(
      norm,
    );

  const onlyVegetarian = /\b(an chay|mon chay|chay|vegan|vegetarian)\b/.test(norm);

  const onlyChefRecommended =
    /\b(best seller|bestseller|ban chay|dac sac|bep truong|signature|ngon nhat|de xuat|recommend)\b/.test(
      norm,
    );

  const excludeAllergens = [];
  if (/\b(di ung hai san|di ung tom|khong an hai san|khong hai san|no seafood|no shrimp)\b/.test(norm)) {
    excludeAllergens.push("hai san", "tom");
  }
  if (/\b(di ung dau phong|di ung lac|khong dau phong|peanut allergy|no peanut)\b/.test(norm)) {
    excludeAllergens.push("dau phong", "lac");
  }
  if (/\b(di ung sua|khong uong sua|lactose|no dairy)\b/.test(norm)) {
    excludeAllergens.push("sua", "pho mai");
  }

  // Phát hiện lời chào (Greeting) và cảm ơn (Gratitude)
  const isGreeting =
    /^(hi|hello|helo|hey|chao|chao ban|xin chao|alo|alo ban|ad oi|bot oi|em oi|ban oi)(\s*!|\s*\.|\s*)?$/i.test(
      norm.trim(),
    ) ||
    (/\b(hi|hello|xin chao|chao ban|chao em|chao bot|chao shop|chao ad)\b/i.test(norm) &&
      !budgetVnd &&
      !partySize &&
      !isOrderIntent &&
      !onlyChefRecommended &&
      !onlyVegetarian &&
      !excludeSpicy);

  const isGratitude =
    /\b(cam on|thank|thanks|thank you|tks|tuyet voi)\b/i.test(norm) &&
    !budgetVnd &&
    !partySize &&
    !isOrderIntent;

  // Làm sạch từ khóa tìm kiếm (bỏ các stop-words hội thoại)
  const cleanQuery = norm
    .replace(
      /\b(goi y|tu van|cho minh|giup minh|mon nao|co mon gi|duoi|khoang|tam|vnd|dong|\d+k|\d+nghin|khong cay|ko cay|an chay|best seller|bep truong|them vao gio|lay cho|nhom|nguoi|combo|hi|hello|xin chao|chao ban)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

  return {
    budgetVnd,
    partySize,
    isGreeting,
    isGratitude,
    isComboIntent,
    isOrderIntent,
    excludeSpicy,
    onlyVegetarian,
    onlyChefRecommended,
    excludeAllergens,
    cleanQuery,
  };
}

/**
 * Thực thi Deterministic Hybrid RAG + Rule-based Response khi không có GEMINI_API_KEY
 * hoặc dùng làm bước tiền xử lý siêu tốc
 */
async function runDeterministicAssistant({
  message,
  diningContext = {},
  customItems = null,
}) {
  const parsed = parseUserIntentAndConstraints(message);
  let recommendedDishes = [];
  let cartActions = [];
  let comboSummary = null;
  let reply = "";

  // Case 0: Khách chào hỏi (Greeting)
  if (parsed.isGreeting) {
    const isEn = diningContext?.language === "en";
    reply = isEn
      ? [
          "Hello! 👋 I'm your **AI Sommelier & Dining Assistant** at Lumière Bistro.",
          "I'm here to help you explore our menu and enjoy an unforgettable meal! You can ask me to:",
          "• 🌟 **Recommend chef's signature** or best-selling dishes",
          "• 🥗 **Filter by your taste** (vegan, no spicy, allergen-free)",
          "• 🍷 **Build a custom combo** within your budget (e.g. *'Dinner combo for 2 under 400k'*)",
          "• 🛒 **Directly order** or add items to your cart (e.g. *'Add 2 Coca Colas to cart'*)",
          "",
          "What flavors or dishes are you craving today?",
        ].join("\n")
      : [
          "Dạ Lumière Bistro xin chào bạn! 👋 Em là **AI Sommelier** — trợ lý ẩm thực của nhà hàng.",
          "Rất vui được hỗ trợ bạn hôm nay! Bạn có thể thoải mái nhờ em:",
          "• 🌟 **Gợi ý món đặc sắc** hoặc món Best-Seller của Bếp trưởng",
          "• 🥗 **Tìm món theo khẩu vị & kiêng khem** (thanh đạm, ăn chay, không cay, không dị ứng)",
          "• 🍷 **Thiết kế Combo theo ngân sách** (VD: *'Combo 2 người dưới 400k'* hoặc *'Set ăn trưa 150k'*...)",
          "• 🛒 **Đặt món nhanh vào giỏ hàng** (VD: *'Lấy cho mình 1 burger bò và 2 lon coca'*...)",
          "",
          "Hôm nay bạn muốn thưởng thức món gì hoặc cần em tư vấn hương vị nào không ạ?",
        ].join("\n");

    return {
      interactionId: `local-${Date.now()}`,
      reply,
      recommendedDishes: [],
      cartActions: [],
      comboSummary: null,
    };
  }

  // Case 0.5: Lời cảm ơn / phản hồi tích cực (Gratitude)
  if (parsed.isGratitude) {
    const isEn = diningContext?.language === "en";
    reply = isEn
      ? "You're very welcome! 😊 Wishing you a wonderful dining experience at Lumière Bistro. Feel free to message me anytime if you'd like to order more dishes or drinks!"
      : "Dạ rất hân hạnh được phục vụ bạn! 😊 Chúc bạn có một bữa ăn thật ngon miệng và trọn vẹn tại Lumière Bistro. Bất cứ khi nào cần chọn thêm món hoặc đồ uống, bạn cứ nhắn em nhé!";

    return {
      interactionId: `local-${Date.now()}`,
      reply,
      recommendedDishes: [],
      cartActions: [],
      comboSummary: null,
    };
  }

  // Case 1: Khách yêu cầu thêm món vào giỏ hàng trực tiếp
  if (parsed.isOrderIntent) {
    const qtyMatch = normalizeVietnamese(message).match(/\b(\d+)\s*(phan|ly|suat|dia|bat|lon|chai)?\b/);
    const qty = qtyMatch ? Math.max(1, Math.min(10, Number(qtyMatch[1]))) : 1;
    const dishQuery = parsed.cleanQuery || message;

    const mutation = await resolveCartMutation({
      action: "add",
      items: [{ dish_name_or_id: dishQuery, quantity: qty }],
      customItems,
    });

    if (mutation.success) {
      cartActions = mutation.cartActions;
      recommendedDishes = mutation.matchedDishes;
      const addedText = cartActions
        .map(
          (a) =>
            `**${a.quantity}x ${a.dish.name}** (${(a.dish.price * a.quantity).toLocaleString("vi-VN")}đ)`,
        )
        .join(", ");
      reply = `Mình đã thêm ${addedText} trực tiếp vào giỏ hàng của bạn! Bạn có thể kiểm tra lại giỏ hàng hoặc nhắn mình nếu muốn chọn thêm đồ uống hay món ăn kèm nhé.`;
      return {
        interactionId: `local-${Date.now()}`,
        reply,
        recommendedDishes,
        cartActions,
        comboSummary,
      };
    }
  }

  // Case 2: Khách yêu cầu tư vấn Combo theo số người / ngân sách
  if (parsed.isComboIntent) {
    const combo = await buildSmartCombo({
      partySize: parsed.partySize || 2,
      budgetVnd: parsed.budgetVnd || 300000,
      excludeSpicy: parsed.excludeSpicy,
      onlyVegetarian: parsed.onlyVegetarian,
      excludeAllergens: parsed.excludeAllergens,
      preferences: parsed.cleanQuery,
      customItems,
      skipEmbeddings: true,
    });

    comboSummary = combo;
    recommendedDishes = combo.items;

    if (combo.valid && combo.items.length > 0) {
      const lines = combo.items.map(
        (it, idx) =>
          `${idx + 1}. **${it.name}** (${it.quantity} phần) — ${it.subtotal.toLocaleString("vi-VN")}đ`,
      );
      reply = [
        `Dựa trên yêu cầu cho **${combo.partySize} người** với ngân sách **${combo.budgetVnd.toLocaleString("vi-VN")}đ**${parsed.excludeSpicy ? " (không cay)" : ""}, mình gợi ý thực đơn cân bằng sau:`,
        "",
        ...lines,
        "",
        `👉 **Tổng cộng:** **${combo.totalPrice.toLocaleString("vi-VN")}đ** (còn dư ${combo.remainingBudget.toLocaleString("vi-VN")}đ trong ngân sách). Bạn có thể bấm **"+ Thêm vào giỏ"** trên từng thẻ món bên dưới nhé!`,
      ].join("\n");
    } else {
      reply = combo.message;
    }

    return {
      interactionId: `local-${Date.now()}`,
      reply,
      recommendedDishes,
      cartActions,
      comboSummary,
    };
  }

  // Case 3: Tìm kiếm Hybrid 3-Leg theo khẩu vị / mức giá / dị ứng / Best-seller
  recommendedDishes = await searchMenuHybrid({
    query: parsed.cleanQuery,
    maxPrice: parsed.budgetVnd,
    onlyChefRecommended: parsed.onlyChefRecommended,
    excludeSpicy: parsed.excludeSpicy,
    onlyVegetarian: parsed.onlyVegetarian,
    excludeAllergens: parsed.excludeAllergens,
    limit: 5,
    customItems,
    skipEmbeddings: true,
  });

  if (recommendedDishes.length === 0 && parsed.onlyChefRecommended) {
    recommendedDishes = await searchMenuHybrid({
      query: parsed.cleanQuery,
      maxPrice: parsed.budgetVnd,
      excludeSpicy: parsed.excludeSpicy,
      onlyVegetarian: parsed.onlyVegetarian,
      excludeAllergens: parsed.excludeAllergens,
      limit: 5,
      customItems,
      skipEmbeddings: true,
    });
  }

  if (recommendedDishes.length === 0) {
    reply =
      "Hiện tại thực đơn chưa có món nào khớp chính xác với toàn bộ bộ lọc của bạn. Bạn thử nới rộng mức giá hoặc cho mình biết thêm nguyên liệu yêu thích nhé!";
  } else {
    const bulletLines = recommendedDishes.slice(0, 4).map((d) => {
      const badge = d.is_chef_recommended ? " ⭐ *(Bếp trưởng khuyên dùng)*" : "";
      return `- **${d.name}** — **${d.price.toLocaleString("vi-VN")}đ**${badge}${d.description ? `: ${d.description}` : ""}`;
    });

    const filterNotes = [];
    if (parsed.budgetVnd) {
      filterNotes.push(`dưới ${parsed.budgetVnd.toLocaleString("vi-VN")}đ`);
    }
    if (parsed.excludeSpicy) filterNotes.push("không cay");
    if (parsed.onlyVegetarian) filterNotes.push("thuần chay/thanh đạm");
    if (parsed.excludeAllergens.length > 0) {
      filterNotes.push(`đã loại trừ dị ứng (${parsed.excludeAllergens.join(", ")})`);
    }

    const intro =
      filterNotes.length > 0
        ? `Mình đã lọc thực đơn theo tiêu chí **${filterNotes.join(", ")}** và chọn ra các món phù hợp nhất cho bàn của bạn:`
        : `Dưới đây là những món ăn nổi bật trong thực đơn phù hợp nhất với yêu cầu của bạn:`;

    reply = [
      intro,
      "",
      ...bulletLines,
      "",
      "Bạn có thể bấm nút **+ Thêm vào giỏ** ngay trên thẻ món ăn bên dưới hoặc nhắn mình đặt giúp nhé!",
    ].join("\n");
  }

  return {
    interactionId: `local-${Date.now()}`,
    reply,
    recommendedDishes,
    cartActions,
    comboSummary,
  };
}

/**
 * Điều phối Agentic Loop trên Gemini 3.8 Flash (Interactions API)
 */
async function chatWithDiningAssistant({
  message,
  previousInteractionId = null,
  tableCode = null,
  cartItems = [],
  language = "vi",
  customItems = null,
  onStatus = null,
}) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) {
    const err = new Error("Vui lòng nhập nội dung câu hỏi cho trợ lý AI.");
    err.status = 400;
    throw err;
  }

  const diningContext = resolveDiningContext({
    tableCode,
    cartItems,
    language,
  });

  const client = getGenAiClient();
  if (!client) {
    if (typeof onStatus === "function") {
      onStatus("Đang tra cứu thực đơn & kiểm tra điều kiện...");
    }
    return runDeterministicAssistant({
      message: cleanMessage,
      diningContext,
      customItems,
    });
  }

  const systemInstruction = buildSystemInstruction(diningContext);
  const groundedDishMap = new Map();
  const collectedCartActions = [];
  let comboSummary = null;

  try {
    if (typeof onStatus === "function") {
      onStatus("AI Sommelier đang phân tích yêu cầu của bạn...");
    }

    const createParams = {
      model: AGENT_MODEL,
      input: cleanMessage,
      system_instruction: systemInstruction,
      tools: DINING_AGENT_TOOLS,
      generation_config: {
        thinking_level: "low",
      },
    };

    if (
      previousInteractionId &&
      !String(previousInteractionId).startsWith("local-")
    ) {
      createParams.previous_interaction_id = previousInteractionId;
    }

    let interaction = null;
    try {
      interaction = await client.interactions.create(createParams);
    } catch (initialErr) {
      if (
        initialErr?.message?.includes("503") ||
        initialErr?.message?.includes("429")
      ) {
        // Tự động thử lại 1 lần sau 800ms đối với lỗi gián đoạn tạm thời của server Gemini
        await new Promise((r) => setTimeout(r, 800));
        interaction = await client.interactions.create(createParams);
      } else {
        throw initialErr;
      }
    }

    // Vòng lặp xử lý Function Calling theo chuẩn Interactions API (tối đa 3 bước gọi tool)
    for (let turn = 0; turn < 3; turn += 1) {
      const steps = Array.isArray(interaction?.steps) ? interaction.steps : [];
      const functionCalls = steps.filter((s) => s.type === "function_call");

      if (functionCalls.length === 0) {
        break;
      }

      const functionResultsInput = [];

      for (const fcStep of functionCalls) {
        const args = fcStep.arguments || {};
        let toolOutput = {};

        if (fcStep.name === "search_menu_semantic") {
          if (typeof onStatus === "function") {
            onStatus("Đang tìm kiếm món ăn phù hợp trong thực đơn...");
          }
          const dishes = await searchMenuHybrid({
            query: args.query || "",
            maxPrice: args.max_price ?? null,
            onlyChefRecommended: Boolean(args.only_chef_recommended),
            excludeSpicy: Boolean(args.exclude_spicy),
            onlyVegetarian: Boolean(args.only_vegetarian),
            excludeAllergens: Array.isArray(args.exclude_allergens)
              ? args.exclude_allergens
              : [],
            limit: args.limit || 5,
            customItems,
          });
          dishes.forEach((d) => groundedDishMap.set(d.id, d));
          toolOutput = { dishes, count: dishes.length };
        } else if (fcStep.name === "build_combo_recommendation") {
          if (typeof onStatus === "function") {
            onStatus("Đang tính toán Combo tối ưu theo ngân sách...");
          }
          const combo = await buildSmartCombo({
            partySize: args.party_size || 2,
            budgetVnd: args.budget_vnd || 300000,
            excludeSpicy: Boolean(args.exclude_spicy),
            onlyVegetarian: Boolean(args.only_vegetarian),
            excludeAllergens: Array.isArray(args.exclude_allergens)
              ? args.exclude_allergens
              : [],
            preferences: args.preferences || "",
            customItems,
          });
          comboSummary = combo;
          (combo.items || []).forEach((d) => groundedDishMap.set(d.id, d));
          toolOutput = combo;
        } else if (fcStep.name === "mutate_customer_cart") {
          if (typeof onStatus === "function") {
            onStatus("Đang cập nhật món ăn vào giỏ hàng của bạn...");
          }
          const mutation = await resolveCartMutation({
            action: args.action || "add",
            items: args.items || [],
            customItems,
          });
          collectedCartActions.push(...mutation.cartActions);
          mutation.matchedDishes.forEach((d) => groundedDishMap.set(d.id, d));
          toolOutput = {
            success: mutation.success,
            added_or_removed: mutation.cartActions,
          };
        } else {
          toolOutput = { error: `Unknown tool ${fcStep.name}` };
        }

        functionResultsInput.push({
          type: "function_result",
          name: fcStep.name,
          call_id: fcStep.id,
          result: [{ type: "text", text: JSON.stringify(toolOutput) }],
        });
      }

      interaction = await client.interactions.create({
        model: AGENT_MODEL,
        input: functionResultsInput,
        system_instruction: systemInstruction,
        tools: DINING_AGENT_TOOLS,
        previous_interaction_id: interaction.id,
        generation_config: {
          thinking_level: "low",
        },
      });
    }

    let replyText = interaction?.output_text || "";
    if (!replyText && Array.isArray(interaction?.steps)) {
      const textParts = [];
      for (const s of interaction.steps) {
        if (s.type === "model_output" && Array.isArray(s.content)) {
          for (const c of s.content) {
            if (c.type === "text" && c.text) textParts.push(c.text);
          }
        }
      }
      replyText = textParts.join("\n").trim();
    }

    // Nếu model trả lời mà chưa gọi tool, tự động chạy Grounding Verifier để đính kèm thẻ món ăn được nhắc tên
    if (groundedDishMap.size === 0) {
      const catalog = await getIndexedCatalog({
        customItems,
        skipEmbeddings: true,
      });
      const normReply = normalizeVietnamese(replyText);
      for (const item of catalog) {
        const normName = normalizeVietnamese(item.name);
        if (normName.length >= 3 && normReply.includes(normName)) {
          groundedDishMap.set(item.id, item);
        }
      }
    }

    if (!replyText) {
      return runDeterministicAssistant({
        message: cleanMessage,
        diningContext,
        customItems,
      });
    }

    return {
      interactionId: interaction.id || `gemini-${Date.now()}`,
      reply: replyText,
      recommendedDishes: Array.from(groundedDishMap.values()).slice(0, 6),
      cartActions: collectedCartActions,
      comboSummary,
    };
  } catch (err) {
    console.warn(
      "[aiAssistantService] Gemini API error, using deterministic hybrid fallback:",
      err.message,
    );
    return runDeterministicAssistant({
      message: cleanMessage,
      diningContext,
      customItems,
    });
  }
}

/**
 * Gợi ý câu hỏi thông minh (Quick Chips) theo khung giờ phục vụ
 */
async function getSmartSuggestions({ language = "vi" } = {}) {
  const hour = new Date().getHours();
  const isEn = language === "en";

  if (isEn) {
    return [
      {
        id: "best-seller",
        label: "⭐ Chef's Best-Sellers",
        prompt: "Recommend the signature best-seller dishes recommended by the Chef.",
      },
      {
        id: "combo-2",
        label: "🍱 Combo for 2 under 300k",
        prompt: "Suggest a balanced meal combo for 2 people under 300k VND.",
      },
      {
        id: "non-spicy",
        label: "🌿 Mild & Non-Spicy Dishes",
        prompt: "Recommend delicious mild dishes that are not spicy.",
      },
      {
        id: "drinks-dessert",
        label: "🍹 Refreshing Drinks & Desserts",
        prompt: "What refreshing drinks and desserts do you have today?",
      },
    ];
  }

  const timeChip =
    hour < 11
      ? {
          id: "morning",
          label: "☀️ Món ngon nhẹ nhàng buổi sáng",
          prompt: "Gợi ý giúp mình các món ăn nhẹ nhàng và đồ uống dưới 100k.",
        }
      : hour < 15
        ? {
            id: "lunch",
            label: "🍱 Combo ăn trưa 2 người dưới 300k",
            prompt: "Tư vấn giúp mình combo ăn trưa cho 2 người dưới 300k.",
          }
        : {
            id: "dinner",
            label: "🍷 Combo bữa tối 2 người dưới 400k",
            prompt: "Tư vấn giúp mình combo ăn tối cho 2 người dưới 400k.",
          };

  return [
    {
      id: "best-seller",
      label: "⭐ Món Best-Seller của Bếp trưởng",
      prompt: "Gợi ý cho mình những món Best-seller đặc sắc nhất do Bếp trưởng khuyên dùng.",
    },
    timeChip,
    {
      id: "non-spicy",
      label: "🌿 Món ngon thanh đạm, không cay",
      prompt: "Gợi ý các món ngon thanh đạm, không cay cho bàn mình nhé.",
    },
    {
      id: "allergy-safe",
      label: "🛡️ Không hải sản & dưới 150k",
      prompt: "Mình bị dị ứng hải sản, gợi ý giúp mình món chính ngon dưới 150k.",
    },
  ];
}

module.exports = {
  DINING_AGENT_TOOLS,
  resolveDiningContext,
  parseUserIntentAndConstraints,
  resolveCartMutation,
  runDeterministicAssistant,
  chatWithDiningAssistant,
  getSmartSuggestions,
};
