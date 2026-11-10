const {
  chatWithDiningAssistant,
  getSmartSuggestions,
} = require("../services/aiAssistantService");
const aiChatSessionRepository = require("../repositories/aiChatSessionRepository");

function writeSseEvent(res, eventName, payload) {
  if (res.writableEnded || res.destroyed) return;
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
  if (typeof res.flush === "function") {
    res.flush();
  }
}

exports.getSuggestions = async (req, res) => {
  try {
    const language = req.query.lang === "en" ? "en" : "vi";
    const suggestions = await getSmartSuggestions({ language });
    return res.status(200).json({ suggestions });
  } catch (err) {
    console.error("[aiController.getSuggestions] error:", err);
    return res
      .status(500)
      .json({ message: "Không thể tải gợi ý từ trợ lý AI" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { tableCode } = req.query;
    if (!tableCode) {
      return res.status(200).json({ messages: [], interactionId: null });
    }
    const session = await aiChatSessionRepository.findByTableCode(tableCode);
    return res.status(200).json({
      messages: session?.messages || [],
      interactionId: session?.interaction_id || null,
    });
  } catch (err) {
    console.error("[aiController.getHistory] error:", err);
    return res.status(500).json({ message: "Không thể tải lịch sử chat AI" });
  }
};

exports.resetSession = async (req, res) => {
  try {
    const { tableCode } = req.body || {};
    if (tableCode) {
      await aiChatSessionRepository.clearSession(tableCode);
    }
    return res.status(200).json({
      success: true,
      message: "Đã làm mới phiên hội thoại AI thành công",
    });
  } catch (err) {
    console.error("[aiController.resetSession] error:", err);
    return res.status(500).json({ message: "Không thể làm mới phiên chat" });
  }
};

exports.chat = async (req, res) => {
  try {
    const {
      message,
      previousInteractionId = null,
      tableCode = null,
      cartItems = [],
      language = "vi",
    } = req.body || {};

    let effectiveInteractionId = previousInteractionId;
    if (!effectiveInteractionId && tableCode) {
      const existingSession = await aiChatSessionRepository.findByTableCode(tableCode);
      if (existingSession?.interaction_id) {
        effectiveInteractionId = existingSession.interaction_id;
      }
    }

    const result = await chatWithDiningAssistant({
      message,
      previousInteractionId: effectiveInteractionId,
      tableCode,
      cartItems,
      language,
    });

    if (tableCode) {
      try {
        await aiChatSessionRepository.appendMessages({
          tableCode,
          interactionId: result.interactionId || null,
          newMessages: [
            {
              id: `user-${Date.now()}`,
              role: "user",
              text: message,
              createdAt: new Date().toISOString(),
            },
            {
              id: `asst-${Date.now()}`,
              role: "assistant",
              text: result.reply,
              recommendedDishes: result.recommendedDishes || [],
              cartActions: result.cartActions || [],
              comboSummary: result.comboSummary || null,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      } catch (saveErr) {
        console.warn("[aiController.chat] Failed to save chat session:", saveErr.message);
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      message: err.message || "Lỗi xử lý yêu cầu AI Sommelier",
    });
  }
};

exports.chatStream = async (req, res) => {
  const {
    message,
    previousInteractionId = null,
    tableCode = null,
    cartItems = [],
    language = "vi",
  } = req.body || {};

  if (!message || !String(message).trim()) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập nội dung câu hỏi cho trợ lý AI." });
  }

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  let clientClosed = false;
  res.on("close", () => {
    if (!res.writableEnded) {
      clientClosed = true;
    }
  });

  try {
    let effectiveInteractionId = previousInteractionId;
    if (!effectiveInteractionId && tableCode) {
      const existingSession = await aiChatSessionRepository.findByTableCode(tableCode);
      if (existingSession?.interaction_id) {
        effectiveInteractionId = existingSession.interaction_id;
      }
    }

    const result = await chatWithDiningAssistant({
      message,
      previousInteractionId: effectiveInteractionId,
      tableCode,
      cartItems,
      language,
      onStatus: (statusText) => {
        if (!clientClosed && !res.writableEnded) {
          writeSseEvent(res, "status", { status: statusText });
        }
      },
    });

    if (tableCode) {
      try {
        await aiChatSessionRepository.appendMessages({
          tableCode,
          interactionId: result.interactionId || null,
          newMessages: [
            {
              id: `user-${Date.now()}`,
              role: "user",
              text: message,
              createdAt: new Date().toISOString(),
            },
            {
              id: `asst-${Date.now()}`,
              role: "assistant",
              text: result.reply,
              recommendedDishes: result.recommendedDishes || [],
              cartActions: result.cartActions || [],
              comboSummary: result.comboSummary || null,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      } catch (saveErr) {
        console.warn("[aiController.chatStream] Failed to save chat session:", saveErr.message);
      }
    }

    if (clientClosed || res.writableEnded) {
      return res.end();
    }

    // Gửi trước danh sách món ăn Grounding & Cart Actions để UI chuẩn bị render thẻ
    writeSseEvent(res, "grounding", {
      recommendedDishes: result.recommendedDishes || [],
      cartActions: result.cartActions || [],
      comboSummary: result.comboSummary || null,
    });

    // Stream từng cụm từ (token-chunk streaming) cho hiệu ứng gõ chữ mượt mà
    const fullText = String(result.reply || "");
    const chunks = fullText.match(/.{1,18}(\s|$)|\S+/g) || [fullText];

    for (const chunk of chunks) {
      if (clientClosed || res.writableEnded) break;
      writeSseEvent(res, "delta", { text: chunk });
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    if (!clientClosed && !res.writableEnded) {
      writeSseEvent(res, "done", {
        interactionId: result.interactionId,
        reply: result.reply,
        recommendedDishes: result.recommendedDishes || [],
        cartActions: result.cartActions || [],
        comboSummary: result.comboSummary || null,
      });
    }

    return res.end();
  } catch (err) {
    if (!clientClosed && !res.writableEnded) {
      writeSseEvent(res, "error", {
        message: err.message || "Lỗi kết nối trợ lý AI",
      });
    }
    return res.end();
  }
};
