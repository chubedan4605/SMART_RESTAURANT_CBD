import axiosClient from "../store/axiosClient";

const BASE_API_URL =
  `${import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000"}/api`;

export const aiApi = {
  async getSuggestions(lang = "vi") {
    return axiosClient.get("/ai/suggestions", {
      params: { lang },
      skipLoading: true,
    });
  },

  async chat(payload) {
    return axiosClient.post("/ai/chat", payload, {
      skipLoading: true,
    });
  },

  async streamChat(
    payload,
    { onStatus, onGrounding, onDelta, onDone, onError, signal } = {},
  ) {
    try {
      const response = await fetch(`${BASE_API_URL}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok || !response.body) {
        const fallback = await this.chat(payload);
        if (onGrounding) {
          onGrounding({
            recommendedDishes: fallback.recommendedDishes || [],
            cartActions: fallback.cartActions || [],
            comboSummary: fallback.comboSummary || null,
          });
        }
        if (onDone) onDone(fallback);
        return fallback;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let receivedDone = false;
      let hasData = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const lines = block.split("\n");
          let eventType = "message";
          let dataStr = "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataStr += line.slice(5).trim();
            }
          }

          if (!dataStr) continue;
          let parsedData = null;
          try {
            parsedData = JSON.parse(dataStr);
          } catch {
            continue;
          }

          if (eventType === "status" && onStatus) {
            onStatus(parsedData.status);
          } else if (eventType === "grounding" && onGrounding) {
            hasData = true;
            onGrounding(parsedData);
          } else if (eventType === "delta" && onDelta) {
            hasData = true;
            onDelta(parsedData.text || "");
          } else if (eventType === "done") {
            receivedDone = true;
            if (onDone) onDone(parsedData);
          } else if (eventType === "error" && onError) {
            onError(new Error(parsedData.message || "AI Stream Error"));
            return;
          }
        }
      }

      if (!receivedDone && !hasData) {
        const fallback = await this.chat(payload);
        if (onGrounding) {
          onGrounding({
            recommendedDishes: fallback.recommendedDishes || [],
            cartActions: fallback.cartActions || [],
            comboSummary: fallback.comboSummary || null,
          });
        }
        if (onDone) onDone(fallback);
      } else if (!receivedDone && hasData && onDone) {
        onDone();
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      try {
        const fallback = await this.chat(payload);
        if (onGrounding) {
          onGrounding({
            recommendedDishes: fallback.recommendedDishes || [],
            cartActions: fallback.cartActions || [],
            comboSummary: fallback.comboSummary || null,
          });
        }
        if (onDone) onDone(fallback);
      } catch (fallbackErr) {
        if (onError) onError(fallbackErr);
      }
    }
  },
};

