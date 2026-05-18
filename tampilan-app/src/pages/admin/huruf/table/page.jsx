import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Text from "../../../../components/Text";
import Button from "../../../../components/Button";

// IMPORT HOOK DAN KOMPONEN PAGINATION GLOBAL
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import useTableHuruf from "../hook/useTableHuruf";
import {
  FaPlus,
  FaSync,
  FaEdit,
  FaTrash,
  FaFont,
  FaImage,
  FaInfoCircle,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const TableHuruf = () => {
  const navigate = useNavigate();

  const { dataHuruf, isLoading, isSyncing, handleBulkImport, handleDelete } =
    useTableHuruf();

  // STATE UNTUK MENAMPUNG HASIL PENCARIAN
  const [filteredData, setFilteredData] = useState(dataHuruf);
  
  // STATE UNTUK MENAMPILKAN POPUP INFO
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // REF UNTUK MODAL CONTENT
  const modalContentRef = useRef(null);

  // MENGGUNAKAN PAGINATION GLOBAL DENGAN DATA YANG SUDAH DI FILTER
  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(filteredData);

  // Handler untuk hasil pencarian
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  // Toggle popup info
  const toggleInfoPopup = () => {
    setShowInfoPopup(!showInfoPopup);
  };

  // Handler untuk klik di luar modal
  const handleOutsideClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      toggleInfoPopup();
    }
  };

  // Lock body scroll ketika modal terbuka
  useEffect(() => {
    if (showInfoPopup) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      // Tambahkan event listener untuk klik di luar modal
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      
      // Hapus event listener
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showInfoPopup]);

  return (
    <div className="space-y-6">
      {/* POPUP INFO - DENGAN FITUR KLIK DI LUAR MODAL */}
      {showInfoPopup && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%'
            }}
          />
          
          {/* Container flex untuk centering */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Popup Content - dengan ref untuk deteksi klik di luar */}
            <div 
              ref={modalContentRef}
              className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FaSync className="text-blue-500" />
                    <h3 className="font-bold text-lg text-slate-800">Info Sinkronisasi Data</h3>
                  </div>
                  <button
                    onClick={toggleInfoPopup}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    title="Tutup"
                  >
                    ✕
                  </button>
                </div>

                {/* Konten Info */}
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm">
                    Tombol <strong>Sinkronkan</strong> berfungsi untuk mengambil dan memperbarui data huruf dari server.
                  </p>
                  
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-700">Total Data Huruf:</span>
                      <span className="text-2xl font-black text-blue-600">{dataHuruf.length}</span>
                    </div>
                    
                    <div className="border-t border-blue-100 pt-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Daftar Huruf:</p>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {dataHuruf.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm">
                            <span className="font-black text-blue-600 w-6">{item.value}</span>
                            <span className="text-slate-600">-</span>
                            <span className="text-slate-700">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center pt-2">
                    Klik di luar area ini atau tekan tombol ✕ untuk menutup
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            textKey="admin_huruf_title"
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <FaFont className="text-blue-500" />
            Data Huruf
          </Text>

          <p className="text-slate-500 text-sm mt-1 font-medium">
            Total:{" "}
            <span className="text-blue-600 font-bold">{dataHuruf.length}</span>{" "}
            Huruf terdaftar
            {filteredData.length !== dataHuruf.length && (
              <span className="text-green-600 ml-2">
                (Menampilkan {filteredData.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* SYNC BUTTON DENGAN ICON INFO DI POJOK KANAN ATAS */}
          <div className="relative inline-block flex-1 sm:flex-none">
            <Button
              onClick={handleBulkImport}
              disabled={isSyncing}
              variant="secondary"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 shadow-sm transition-all w-full"
            >
              <FaSync className={`${isSyncing ? "animate-spin" : ""}`} />
              <span className="font-bold">
                {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
              </span>
            </Button>
            
            {/* Icon info di pojok kanan atas tombol */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfoPopup();
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg border border-slate-200 text-slate-400 hover:text-green-500 transition-all z-10 hover:scale-110 active:scale-95"
              title="Info Sinkronisasi"
            >
              <FaInfoCircle size={16} />
            </button>
          </div>

          {/* ADD BUTTON */}
          <Button
            onClick={() => navigate("/admin/huruf/add")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex-1 sm:flex-none"
          >
            <FaPlus />
            <span className="font-bold">Tambah Baru</span>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <Search
          data={dataHuruf}
          onSearchResults={handleSearchResults}
          searchFields={['label', 'value']}
          placeholder="Cari huruf berdasarkan nama atau huruf..."
          className="w-full sm:w-80 md:w-96"
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <FaSync className="animate-spin text-4xl text-blue-400 mb-4" />
            <Text className="text-slate-500 font-bold animate-pulse">
              Memuat Data...
            </Text>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <IoSearch className="text-6xl text-slate-300" />
              <Text className="text-slate-400 font-bold text-lg">
                {dataHuruf.length === 0 
                  ? "Belum ada data huruf terdaftar."
                  : "Tidak ada hasil yang sesuai dengan pencarian."}
              </Text>
              {dataHuruf.length > 0 && (
                <Button
                  onClick={() => setFilteredData(dataHuruf)}
                  variant="secondary"
                  className="mt-2 px-6 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Tampilkan Semua Data
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse">
              {/* THEAD */}
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    No
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">
                    Huruf
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Label Nama
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">
                    Gambar
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Audio Suara
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* TBODY */}
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item, index) => {
                  const ITEMS_PER_PAGE = 10;
                  const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-slate-400 font-bold">
                        {rowNumber}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <span className="font-black text-2xl uppercase">
                            {item.value}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-700 uppercase tracking-wide">
                        {item.label}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.image_url ? (
                          <div className="flex justify-center">
                            <img
                              src={item.image_url}
                              alt={item.label}
                              className="w-14 h-14 object-contain rounded-xl border border-slate-200 bg-white shadow-sm hover:scale-110 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-300">
                            <FaImage size={24} className="mb-1 opacity-50" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Kosong
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.audio_url ? (
                          <audio
                            src={item.audio_url}
                            controls
                            className="h-10 w-48 outline-none rounded-full grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg">
                            Tidak ada audio
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/huruf/edit/${item.id}`)
                            }
                            className="p-3 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 tooltip hover:scale-110 active:scale-95"
                            title="Edit Huruf"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Hapus Huruf"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PAGINATION */}
            {filteredData.length > 0 && (
              <div className="w-full pt-4 pb-2 border-t border-slate-100 bg-white/50 flex justify-center">
                <div className="transform scale-90 -mt-6 md:-mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrev={prevPage}
                    onNext={nextPage}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableHuruf;