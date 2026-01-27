import { useRef, useCallback, useEffect, useState } from "react";

// Sound effect types for the casino portfolio
export type SoundType =
  | "shuffle"
  | "deal"
  | "flip"
  | "play"
  | "fold"
  | "hit"
  | "close";

// Map sound types to audio file paths
const SOUND_PATHS: Record<SoundType, string> = {
  shuffle: "/audio/mixkit-thin-metal-card-deck-shuffle-3175.wav",
  deal: "/audio/mixkit-poker-card-flick-2002.wav",
  flip: "/audio/mixkit-poker-card-flick-2002.wav",
  play: "/audio/mixkit-cards-deck-hits-1994.wav",
  fold: "/audio/mixkit-cards-deck-hits-1994.wav", // Different from flip - uses deck hits
  hit: "/audio/mixkit-cards-deck-hits-1994.wav",
  close: "/audio/mixkit-poker-card-flick-2002.wav",
};

// Volume levels for each sound (0-1)
const SOUND_VOLUMES: Record<SoundType, number> = {
  shuffle: 0.4,
  deal: 0.3,
  flip: 0.25,
  play: 0.5,
  fold: 0.35, // Slightly louder for fold impact
  hit: 0.4,
  close: 0.25,
};

interface UseAudioOptions {
  defaultMuted?: boolean;
  defaultVolume?: number;
}

interface UseAudioReturn {
  playSound: (type: SoundType) => void;
  playSoundDelayed: (type: SoundType, delayMs: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  isLoaded: boolean;
}

export function useAudio(options: UseAudioOptions = {}): UseAudioReturn {
  const { defaultMuted = false, defaultVolume = 0.5 } = options;

  // State
  const [isMuted, setIsMuted] = useState(() => {
    // Persist mute preference
    const saved = localStorage.getItem("casino-audio-muted");
    return saved ? saved === "true" : defaultMuted;
  });
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("casino-audio-volume");
    return saved ? parseFloat(saved) : defaultVolume;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Audio cache - preloaded audio elements
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  // Preload all sounds on mount
  useEffect(() => {
    const loadPromises: Promise<void>[] = [];

    (Object.keys(SOUND_PATHS) as SoundType[]).forEach((type) => {
      const audio = new Audio(SOUND_PATHS[type]);
      audio.preload = "auto";
      audio.volume = SOUND_VOLUMES[type] * volume;

      const loadPromise = new Promise<void>((resolve) => {
        audio.addEventListener("canplaythrough", () => resolve(), {
          once: true,
        });
        audio.addEventListener(
          "error",
          () => {
            console.warn(`Failed to load sound: ${type}`);
            resolve(); // Resolve anyway to not block other sounds
          },
          { once: true },
        );
      });

      loadPromises.push(loadPromise);
      audioCache.current.set(type, audio);
    });

    Promise.all(loadPromises).then(() => {
      setIsLoaded(true);
    });

    return () => {
      // Cleanup
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioCache.current.clear();
    };
  }, []);

  // Update volumes when global volume changes
  useEffect(() => {
    audioCache.current.forEach((audio, type) => {
      audio.volume = SOUND_VOLUMES[type] * volume;
    });
    localStorage.setItem("casino-audio-volume", String(volume));
  }, [volume]);

  // Persist mute preference
  useEffect(() => {
    localStorage.setItem("casino-audio-muted", String(isMuted));
  }, [isMuted]);

  // Play a sound
  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted) return;

      const cachedAudio = audioCache.current.get(type);
      if (cachedAudio) {
        // Clone and play for overlapping sounds
        const audio = cachedAudio.cloneNode(true) as HTMLAudioElement;
        audio.volume = SOUND_VOLUMES[type] * volume;
        audio.currentTime = 0;

        audio.play().catch((err) => {
          // Autoplay blocked - common on first interaction
          console.debug("Audio play blocked:", err.message);
        });

        // Cleanup after playing
        audio.addEventListener(
          "ended",
          () => {
            audio.remove();
          },
          { once: true },
        );
      }
    },
    [isMuted, volume],
  );

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Set volume (0-1)
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  // Play sound with delay
  const playSoundDelayed = useCallback(
    (type: SoundType, delayMs: number) => {
      setTimeout(() => playSound(type), delayMs);
    },
    [playSound],
  );

  return {
    playSound,
    playSoundDelayed,
    isMuted,
    toggleMute,
    setVolume,
    volume,
    isLoaded,
  };
}
