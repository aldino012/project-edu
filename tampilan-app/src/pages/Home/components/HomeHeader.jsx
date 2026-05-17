import React from "react";
import { useNavigate } from "react-router-dom";

import { FaVolumeUp, FaVolumeMute, FaCog } from "react-icons/fa";
import Text from "../../../components/Text";

const HomeHeader = ({ audioRef, isPlaying, toggleAudio }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= TOMBOL SUARA ================= */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 left-6 z-30 bg-white p-4 rounded-full shadow-lg text-[#ff6b6b] hover:scale-110 hover:shadow-xl transition-all duration-300 border-4 border-[#ff6b6b]/20"
      >
        {isPlaying ? (
          <FaVolumeUp size={24} />
        ) : (
          <FaVolumeMute size={24} className="text-gray-400" />
        )}
      </button>

      {/* ================= TOMBOL ADMIN ================= */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-6 right-6 z-30 bg-white/70 hover:bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-500 hover:text-gray-800 flex items-center gap-2 border-2 border-transparent hover:border-gray-200"
      >
        <FaCog size={20} className="animate-spin-slow" />

        <Text
          textKey="admin_sidebar_title"
          className="text-xs font-bold hidden md:block"
        />
      </button>

      {/* ================= JUDUL ================= */}
      <div className="mb-14 z-20 relative mt-10">
        <Text
          textKey="title_main"
          variant="title"
          align="center"
          className="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] text-5xl font-black tracking-widest"
        />
      </div>
    </>
  );
};

export default HomeHeader;