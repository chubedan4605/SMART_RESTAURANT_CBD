const {
  normalizeVietnamese,
  inferDietaryTags,
  searchMenuHybrid,
  buildSmartCombo,
} = require("../src/services/aiMenuIndexer");
const {
  resolveCartMutation,
  chatWithDiningAssistant,
  getSmartSuggestions,
} = require("../src/services/aiAssistantService");

const MOCK_MENU_ITEMS = [
  {
    id: "dish-1",
    category_id: "cat-main",
    category_name: "Món chính",
    name: "Bò Bít Tết Sốt Tiêu Đen",
    description: "Thịt bò Mỹ áp chảo dùng kèm sốt tiêu đen cay nồng và khoai tây",
    price: 145000,
    prep_time_minutes: 15,
    status: "available",
    is_chef_recommended: true,
    total_ordered: 120,
    image_url: "https://example.com/steak.jpg",
  },
  {
    id: "dish-2",
    category_id: "cat-main",
    category_name: "Món chính",
    name: "Cá Hồi Áp Chảo Sốt Chanh Dây",
    description: "Cá hồi Na Uy tươi ngon, vị thanh đạm không cay",
    price: 165000,
    prep_time_minutes: 15,
    status: "available",
    is_chef_recommended: true,
    total_ordered: 95,
    image_url: "https://example.com/salmon.jpg",
  },
  {
    id: "dish-3",
    category_id: "cat-main",
    category_name: "Món chính",
    name: "Cơm Gà Nướng Mật Ong",
    description: "Đùi gà nướng mật ong thơm mềm, không cay, phù hợp trẻ em",
    price: 85000,
    prep_time_minutes: 12,
    status: "available",
    is_chef_recommended: false,
    total_ordered: 80,
    image_url: "https://example.com/chicken.jpg",
  },
  {
    id: "dish-4",
    category_id: "cat-starter",
    category_name: "Khai vị",
    name: "Salad Rau Củ Quả Tươi",
    description: "Món chay thanh đạm với rau hữu cơ và sốt dầu giấm",
    price: 55000,
    prep_time_minutes: 8,
    status: "available",
    is_chef_recommended: false,
    total_ordered: 60,
    image_url: "https://example.com/salad.jpg",
  },
  {
    id: "dish-5",
    category_id: "cat-starter",
    category_name: "Khai vị",
    name: "Tôm Chiên Hoàng Kim Sốt Cay",
    description: "Tôm sú tươi chiên giòn xóc ớt cay và đậu phộng rang",
    price: 110000,
    prep_time_minutes: 10,
    status: "available",
    is_chef_recommended: true,
    total_ordered: 110,
    image_url: "https://example.com/shrimp.jpg",
  },
  {
    id: "dish-6",
    category_id: "cat-drink",
    category_name: "Đồ uống",
    name: "Trà Đào Cam Sả",
    description: "Trà trái cây tươi mát giải nhiệt",
    price: 45000,
    prep_time_minutes: 5,
    status: "available",
    is_chef_recommended: true,
    total_ordered: 200,
    image_url: "https://example.com/peachtea.jpg",
  },
];

describe("AI Menu Indexer & 3-Leg Hybrid RAG Engine", () => {
  it("normalizes Vietnamese diacritics accurately", () => {
    expect(normalizeVietnamese("Bò Bít Tết Sốt Tiêu Đen!")).toBe(
      "bo bit tet sot tieu den",
    );
  });

  it("infers dietary tags, courseType, and allergens from dish metadata", () => {
    const shrimpTags = inferDietaryTags(MOCK_MENU_ITEMS[4]);
    expect(shrimpTags.isSpicy).toBe(true);
    expect(shrimpTags.allergens).toEqual(
      expect.arrayContaining(["hai san", "dau phong"]),
    );

    const saladTags = inferDietaryTags(MOCK_MENU_ITEMS[3]);
    expect(saladTags.isVegetarian).toBe(true);
    expect(saladTags.courseType).toBe("starter");

    const teaTags = inferDietaryTags(MOCK_MENU_ITEMS[5]);
    expect(teaTags.courseType).toBe("drink");
  });

  it("matches dishes via Vietnamese diacritic-insensitive lexical search", async () => {
    const results = await searchMenuHybrid({
      query: "bo bit tet",
      customItems: MOCK_MENU_ITEMS,
      skipEmbeddings: true,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("dish-1");
  });

  it("enforces Fail-Closed Allergen & Spicy exclusions and Max Price filters", async () => {
    const safeResults = await searchMenuHybrid({
      query: "",
      maxPrice: 150000,
      excludeSpicy: true,
      excludeAllergens: ["hai san"],
      customItems: MOCK_MENU_ITEMS,
      skipEmbeddings: true,
    });

    // Should exclude dish-1 (spicy), dish-2 (>150k & seafood), dish-5 (spicy & seafood)
    const ids = safeResults.map((r) => r.id);
    expect(ids).not.toContain("dish-1");
    expect(ids).not.toContain("dish-2");
    expect(ids).not.toContain("dish-5");
    expect(ids).toEqual(expect.arrayContaining(["dish-3", "dish-4", "dish-6"]));
  });

  it("builds a Fail-Closed Combo strictly under budgetVnd", async () => {
    const combo = await buildSmartCombo({
      partySize: 2,
      budgetVnd: 300000,
      excludeSpicy: true,
      customItems: MOCK_MENU_ITEMS,
      skipEmbeddings: true,
    });

    expect(combo.valid).toBe(true);
    expect(combo.totalPrice).toBeGreaterThan(0);
    expect(combo.totalPrice).toBeLessThanOrEqual(300000);
    expect(combo.items.every((item) => !item.isSpicy)).toBe(true);
  });
});

describe("AI Dining Assistant Service (Agentic Tools & Grounding)", () => {
  it("resolves cart mutations grounded against the live catalog", async () => {
    const res = await resolveCartMutation({
      action: "add",
      items: [{ dish_name_or_id: "Trà đào cam sả", quantity: 3, note: "ít đá" }],
      customItems: MOCK_MENU_ITEMS,
    });

    expect(res.success).toBe(true);
    expect(res.cartActions).toHaveLength(1);
    expect(res.cartActions[0]).toMatchObject({
      action: "add",
      quantity: 3,
      note: "ít đá",
      dish: {
        id: "dish-6",
        name: "Trà Đào Cam Sả",
        price: 45000,
      },
    });
  });

  it("handles natural language ordering intent and emits cartActions", async () => {
    const response = await chatWithDiningAssistant({
      message: "Thêm giúp mình 2 phần Bò Bít Tết Sốt Tiêu Đen vào giỏ hàng",
      tableCode: "Bàn 05",
      cartItems: [],
      customItems: MOCK_MENU_ITEMS,
    });

    expect(response.cartActions.length).toBeGreaterThan(0);
    expect(response.cartActions[0].dish.id).toBe("dish-1");
    expect(response.cartActions[0].quantity).toBe(2);
  });

  it("handles combo recommendation intent with strict budget compliance", async () => {
    const response = await chatWithDiningAssistant({
      message: "Tư vấn combo 2 người dưới 300k không cay",
      tableCode: "Bàn 02",
      cartItems: [],
      customItems: MOCK_MENU_ITEMS,
    });

    expect(response.comboSummary).toBeDefined();
    expect(response.comboSummary.valid).toBe(true);
    expect(response.comboSummary.totalPrice).toBeLessThanOrEqual(300000);
    expect(response.recommendedDishes.length).toBeGreaterThan(0);
  });

  it("returns localized smart suggestions", async () => {
    const viSuggestions = await getSmartSuggestions({ language: "vi" });
    const enSuggestions = await getSmartSuggestions({ language: "en" });

    expect(viSuggestions.length).toBeGreaterThanOrEqual(3);
    expect(enSuggestions.length).toBeGreaterThanOrEqual(3);
  });

  it("handles greeting and chit-chat naturally without dumping dishes", async () => {
    const greetingRes = await chatWithDiningAssistant({
      message: "hi",
      tableCode: "Bàn 01",
      customItems: MOCK_MENU_ITEMS,
    });

    expect(greetingRes.reply).toContain("Lumière Bistro xin chào");
    expect(greetingRes.recommendedDishes).toHaveLength(0);

    const thanksRes = await chatWithDiningAssistant({
      message: "Cảm ơn bot nhiều nhé!",
      tableCode: "Bàn 01",
      customItems: MOCK_MENU_ITEMS,
    });

    expect(thanksRes.reply).toContain("rất hân hạnh được phục vụ");
  });
});

