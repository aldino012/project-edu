import { useRef, useState } from "react";

const useHurufAudio = () => {
  const audioRef = useRef(null);
  const [flippedCard, setFlippedCard] = useState(null);

  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (url) {
      audioRef.current = new Audio(url);
      audioRef.current.play().catch(() => {
        console.log("Audio diblokir");
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleFlip = (id, audioUrl) => {
    if (flippedCard === id) {
      setFlippedCard(null);
      stopAudio();
    } else {
      setFlippedCard(id);
      playAudio(audioUrl);
    }
  };

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return {
    flippedCard,
    handleFlip,
    stopAudio,
    cleanupAudio,
  };
};

export default useHurufAudio;