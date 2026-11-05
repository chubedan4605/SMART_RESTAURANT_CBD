// apps/fe/src/services/audioNotificationService.js
/**
 * AudioNotificationService - Singleton Audio Controller
 * Đảm bảo:
 * 1. Chống vọng tiếng (Echo / Audio Stuttering) khi nhiều component cùng lắng nghe 1 event (throttle 300ms).
 * 2. Tái sử dụng Audio instances, tránh rác bộ nhớ (Memory Leak).
 * 3. Xử lý êm xuôi lỗi chặn Autoplay từ trình duyệt.
 */

class AudioNotificationService {
  constructor() {
    this.audioCache = new Map();
    this.lastPlayedMap = new Map();
  }

  getAudioInstance(soundUrl) {
    if (!this.audioCache.has(soundUrl)) {
      try {
        const audio = new Audio(soundUrl);
        audio.preload = "auto";
        this.audioCache.set(soundUrl, audio);
      } catch (err) {
        console.warn("🔇 Không thể khởi tạo Audio:", err);
        return null;
      }
    }
    return this.audioCache.get(soundUrl);
  }

  play(soundUrl, options = {}) {
    const { volume = 0.7, throttleMs = 300 } = options;
    const now = Date.now();
    const lastPlayed = this.lastPlayedMap.get(soundUrl) || 0;

    // Chặn phát đè âm thanh nếu nằm trong khoảng throttle
    if (now - lastPlayed < throttleMs) {
      return;
    }
    this.lastPlayedMap.set(soundUrl, now);

    const audio = this.getAudioInstance(soundUrl);
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume));
    audio.currentTime = 0;

    audio.play().catch((err) => {
      // Browser autoplay policy có thể chặn nếu chưa có user gesture
      console.warn("🔇 Trình duyệt hoãn phát âm thanh thông báo:", err.message);
    });
  }

  stop(soundUrl) {
    const audio = this.audioCache.get(soundUrl);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  stopAll() {
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

export const audioNotificationService = new AudioNotificationService();
export default audioNotificationService;

