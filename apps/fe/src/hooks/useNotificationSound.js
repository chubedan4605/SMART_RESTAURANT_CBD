// apps/fe/src/hooks/useNotificationSound.js
import { useCallback } from "react";
import { audioNotificationService } from "../services/audioNotificationService";

export function useNotificationSound(soundUrl = "/sounds/notification.mp3") {
  const play = useCallback(
    (options = {}) => {
      audioNotificationService.play(soundUrl, options);
    },
    [soundUrl],
  );

  const stop = useCallback(() => {
    audioNotificationService.stop(soundUrl);
  }, [soundUrl]);

  return { play, stop };
}

export default useNotificationSound;
