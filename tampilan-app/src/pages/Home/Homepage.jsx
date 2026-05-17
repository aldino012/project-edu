import React from "react";
import { useNavigate } from "react-router-dom";

import useHomeAudio from "./hooks/useHomeAudio";

import HomeAudio from "./components/HomeAudio";
import HomeHeader from "./components/HomeHeader";
import HomeDecorations from "./components/HomeDecorations";
import HomeMenu from "./components/HomeMenu";

const Homepage = () => {
  const navigate = useNavigate();

  const { audioRef, isPlaying, toggleAudio } = useHomeAudio();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4bc0f8] via-[#8ce0ff] to-[#d6f5ff] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <HomeAudio audioRef={audioRef} />

      <HomeHeader
        audioRef={audioRef}
        isPlaying={isPlaying}
        toggleAudio={toggleAudio}
      />

      <HomeDecorations />

      <HomeMenu />
    </div>
  );
};

export default Homepage;
