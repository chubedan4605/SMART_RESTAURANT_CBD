import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { audioNotificationService } from "../services/audioNotificationService";
import { useSocketEvent } from "../hooks/useSocketEvent";
import SocketContext from "../context/SocketContext";

describe("AudioNotificationService", () => {
  beforeEach(() => {
    audioNotificationService.audioCache.clear();
    audioNotificationService.lastPlayedMap.clear();

    // Mock Audio constructor in browser/jsdom
    class MockAudio {
      constructor(src) {
        this.src = src;
        this.volume = 1;
        this.currentTime = 0;
        this.play = vi.fn().mockResolvedValue();
        this.pause = vi.fn();
      }
    }
    window.Audio = MockAudio;
  });

  it("should throttle rapid audio plays to prevent audio echo/stutter", () => {
    const soundUrl = "/sounds/notification.mp3";

    audioNotificationService.play(soundUrl, { throttleMs: 500 });
    const firstAudio = audioNotificationService.audioCache.get(soundUrl);
    expect(firstAudio.play).toHaveBeenCalledTimes(1);

    // Call immediately again within throttle period
    audioNotificationService.play(soundUrl, { throttleMs: 500 });
    // Should NOT call play again because it's throttled
    expect(firstAudio.play).toHaveBeenCalledTimes(1);
  });
});

describe("useSocketEvent Hook", () => {
  it("should register event with socket.on and unbind exactly with socket.off on unmount", () => {
    const mockSocket = {
      on: vi.fn(),
      off: vi.fn(),
    };

    const handler = vi.fn();
    const wrapper = ({ children }) => (
      <SocketContext.Provider value={mockSocket}>
        {children}
      </SocketContext.Provider>
    );

    const { unmount } = renderHook(
      () => useSocketEvent("order_update", handler),
      { wrapper }
    );

    expect(mockSocket.on).toHaveBeenCalledWith("order_update", expect.any(Function));

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith("order_update", expect.any(Function));
  });
});
