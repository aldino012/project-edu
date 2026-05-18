import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table"; // IMPORT TABLE GLOBAL

// IMPORT HOOK DAN KOMPONEN PAGINATION GLOBAL
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import useTableAngka from "../hook/useTableAngka";
import {
  FaPlus,
  FaSync,
  FaSortNumericUpAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const TableAngka = () => {
  const {
    dataAngka,
    isLoading,
    isSyncing,
    handleBulkImport,
    handleDelete,
    navigate,
  } = useTableAngka();

  const [filteredData, setFilteredData] = useState(dataAngka);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const modalContentRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(filteredData);

  useEffect(() => {
    setFilteredData(dataAngka);
  }, [dataAngka]);

  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  const handleEdit = (row) => {
    navigate(`/admin/angka/edit/${row.id}`);
  };

  const handleDeleteItem = (row) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus angka "${row.label}"?`)) {
      handleDelete(row.id);
    }
  };

  // DEFINISI KOLOM - MEMPERTAHANKAN TAMPILAN ASLI
  const columns = [
    {
      header: "No",
      accessor: "no",
      headerClassName: "text-center", // Optional
      cellClassName: "text-slate-400 font-bold text-sm",
      render: (row, index, currentPage, rowNumber) => rowNumber,
    },
    {
      header: "Visual Angka",
      accessor: "value",
      headerClassName: "text-center",
      cellClassName: "text-center",
      render: (row) => (
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:scale-110">
          <span className="font-black text-2xl">{row.value}</span>
        </div>
      ),
    },
    {
      header: "Label Nama",
      accessor: "label",
      cellClassName: "font-black text-slate-700 tracking-wide",
      render: (row) => row.label,
    },
    {
      header: "Audio Suara",
      accessor: "audio_url",
      render: (row) => (
        row.audio_url ? (
          <audio
            controls
            src={row.audio_url}
            className="h-10 w-48 outline-none rounded-full grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
            preload="metadata"
          />
        ) : (
          <span className="text-xs font-bold text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg">
            Tidak ada audio
          </span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* POPUP INFO (SAMA PERSIS SEPERTI SEBELUMNYA) */}
      {showInfoPopup && (
        // ... kode popup info sama persis seperti sebelumnya
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* ... */}
        </div>
      )}

      {/* HEADER (SAMA PERSIS SEPERTI SEBELUMNYA) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        {/* ... konten header sama persis */}
        <div>
          <Text variant="subtitle" className="text-slate-800 font-black text-xl flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FaSortNumericUpAlt className="text-blue-500 text-sm" />
            </div>
            Data Angka
          </Text>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Total: <span className="text-blue-600 font-bold">{dataAngka.length}</span> Angka terdaftar
            {filteredData.length !== dataAngka.length && (
              <span className="text-green-600 ml-2">(Menampilkan {filteredData.length} hasil)</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative inline-block flex-1 sm:flex-none">
            <Button
              onClick={handleBulkImport}
              disabled={isSyncing}
              variant="secondary"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 shadow-sm transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSync className={`${isSyncing ? "animate-spin" : ""} text-sm`} />
              <span className="font-bold">{isSyncing ? "Menyinkronkan..." : "Sinkronkan"}</span>
            </Button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfoPopup(!showInfoPopup);
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg border border-slate-200 text-slate-400 hover:text-green-500 transition-all z-10 hover:scale-110"
            >
              <FaInfoCircle size={16} />
            </button>
          </div>

          <Button
            onClick={() => navigate("/admin/angka/add")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex-1 sm:flex-none"
          >
            <FaPlus className="text-sm" />
            <span className="font-bold">Tambah Baru</span>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <Search
          data={dataAngka}
          onSearchResults={handleSearchResults}
          searchFields={['label', 'value']}
          placeholder="Cari angka berdasarkan nama atau nilai..."
          className="w-full sm:w-80 md:w-96"
        />
      </div>

      {/* TABLE CONTAINER - MENGGUNAKAN TABLE GLOBAL */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="relative">
              <FaSync className="animate-spin text-5xl text-blue-400 mb-4" />
              <div className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-20"></div>
            </div>
            <Text className="text-slate-500 font-bold animate-pulse mt-4">
              Memuat Data...
            </Text>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <IoSearch className="text-4xl text-slate-300" />
              </div>
              <Text className="text-slate-400 font-bold text-lg">
                {dataAngka.length === 0 
                  ? "Belum ada data angka terdaftar."
                  : "Tidak ada hasil yang sesuai dengan pencarian."}
              </Text>
              {dataAngka.length > 0 && (
                <Button
                  onClick={() => setFilteredData(dataAngka)}
                  variant="secondary"
                  className="mt-2 px-6 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Tampilkan Semua Data
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={currentItems}
              onEdit={handleEdit}
              onDelete={handleDeleteItem}
              currentPage={currentPage}
              itemsPerPage={10}
            />
            
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
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default TableAngka;