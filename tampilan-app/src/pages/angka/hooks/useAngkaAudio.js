import { useRef } from "react";

export const useAngkaAudio = () => {
  const audioRef = useRef(null);

  const playAudio = (url) => {
    stopAudio(); // pastikan tidak ada audio lain yang jalan

    if (url) {
      audioRef.current = new Audio(url);

      audioRef.current.play().catch((err) => {
        console.warn("Audio gagal diputar:", err);
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const cleanupAudio = () => {
    stopAudio();
  };

  return {
    playAudio,
    stopAudio,
    cleanupAudio,
  };
};
