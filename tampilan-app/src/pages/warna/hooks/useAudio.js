import { useRef, useEffect, useCallback } from "react";

const useAudio = () => {
  const audioRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const playAudio = useCallback(
    (url) => {
      stopAudio(); // Hentikan audio sebelumnya jika ada
      if (url) {
        audioRef.current = new Audio(url);
        audioRef.current.play().catch((e) => console.log("Audio diblokir:", e));
      }
    },
    [stopAudio],
  );

  // Cleanup: matikan audio saat komponen yang memakai hook ini di-unmount
  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return { playAudio, stopAudio };
};

export default useAudio;