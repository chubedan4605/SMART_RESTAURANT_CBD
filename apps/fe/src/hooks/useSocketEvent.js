// apps/fe/src/hooks/useSocketEvent.js
import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Custom Hook: useSocketEvent
 * Đăng ký lắng nghe sự kiện Socket.IO an toàn:
 * 1. Không bị Effect Thrashing (re-subscribe) khi callback thay đổi state nhờ useRef.
 * 2. Ngăn ngừa Memory Leak: cleanup đúng instance listener của chính component này.
 * 3. Tuyệt đối không xóa nhầm listeners của component khác (tránh bug socket.off('event') wipe-out).
 *
 * @param {string} eventName Tên event cần lắng nghe
 * @param {Function} handler Hàm callback xử lý event
 */
export function useSocketEvent(eventName, handler) {
  const socket = useSocket();
  const savedHandler = useRef(handler);

  // Luôn cập nhật handler mới nhất mà không kích hoạt lại effect
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket || !eventName) return;

    const eventListener = (...args) => {
      if (typeof savedHandler.current === "function") {
        savedHandler.current(...args);
      }
    };

    socket.on(eventName, eventListener);

    return () => {
      socket.off(eventName, eventListener);
    };
  }, [socket, eventName]);
}

export default useSocketEvent;

