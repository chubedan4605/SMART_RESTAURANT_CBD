import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import cartReducer from "../store/slices/cartSlice";
import AiDiningAssistant from "../Components/customer/AiDiningAssistant";

vi.mock("../services/aiApi", () => ({
  aiApi: {
    getSuggestions: vi.fn().mockResolvedValue({
      suggestions: [
        {
          id: "best-seller",
          label: "⭐ Món Best-Seller của Bếp trưởng",
          prompt: "Gợi ý món best seller",
        },
      ],
    }),
    streamChat: vi.fn().mockImplementation(async (_payload, callbacks) => {
      if (callbacks?.onGrounding) {
        callbacks.onGrounding({
          recommendedDishes: [
            {
              id: "dish-test-1",
              name: "Bò Bít Tết Sốt Tiêu Đen",
              price: 145000,
              is_chef_recommended: true,
              image_url: null,
            },
          ],
          cartActions: [],
          comboSummary: null,
        });
      }
      if (callbacks?.onDelta) {
        callbacks.onDelta("Gợi ý cho bạn món **Bò Bít Tết Sốt Tiêu Đen**!");
      }
      if (callbacks?.onDone) {
        callbacks.onDone({
          interactionId: "test-int-1",
          reply: "Gợi ý cho bạn món **Bò Bít Tết Sốt Tiêu Đen**!",
          recommendedDishes: [
            {
              id: "dish-test-1",
              name: "Bò Bít Tết Sốt Tiêu Đen",
              price: 145000,
              is_chef_recommended: true,
              image_url: null,
            },
          ],
          cartActions: [],
          comboSummary: null,
        });
      }
    }),
  },
}));

describe("AiDiningAssistant Component", () => {
  it("opens the AI Sommelier drawer, streams response, and adds grounded dish to Redux cart", async () => {
    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AiDiningAssistant />
        </MemoryRouter>
      </Provider>,
    );

    const openBtn = screen.getByRole("button", {
      name: /Mở Trợ lý Ẩm thực AI/i,
    });
    expect(openBtn).toBeInTheDocument();

    fireEvent.click(openBtn);

    expect(
      screen.getByText(/AI Sommelier & Dining Assistant/i),
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(
      /Hỏi món ngon, tính combo hoặc nhắn đặt món/i,
    );
    fireEvent.change(input, { target: { value: "Gợi ý món bò ngon" } });

    const sendBtn = screen.getByRole("button", { name: /Gửi tin nhắn/i });
    fireEvent.click(sendBtn);

    const dishCardTitles = await screen.findAllByText("Bò Bít Tết Sốt Tiêu Đen");
    expect(dishCardTitles.length).toBeGreaterThanOrEqual(2);

    const addBtn = screen.getByRole("button", { name: /Thêm/i });
    fireEvent.click(addBtn);

    const state = store.getState();
    expect(state.cart.totalItems).toBe(1);
    expect(state.cart.items[0].name).toBe("Bò Bít Tết Sốt Tiêu Đen");
  });
});
