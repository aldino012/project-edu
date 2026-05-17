import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";

// IMPORT HOOK DAN KOMPONEN PAGINATION GLOBAL
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import { useQuizTable } from "../hook/useQuizTable";
import { FaPlus, FaSpinner, FaEdit, FaTrash, FaListAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const TableQuiz = () => {
  const navigate = useNavigate();
  const { dataQuiz, isLoading, deleteQuiz } = useQuizTable();

  // STATE UNTUK MENAMPUNG HASIL PENCARIAN
  const [filteredData, setFilteredData] = useState(dataQuiz);

  // MENGGUNAKAN PAGINATION GLOBAL DENGAN DATA YANG SUDAH DI FILTER
  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(filteredData);

  // Handler untuk hasil pencarian
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <FaListAlt className="text-blue-500" />
            Data Kuis
          </Text>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Total:{" "}
            <span className="text-blue-600 font-bold">{dataQuiz.length}</span>{" "}
            Soal terdaftar
            {filteredData.length !== dataQuiz.length && (
              <span className="text-green-600 ml-2">
                (Menampilkan {filteredData.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/admin/quiz/add")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex-1 sm:flex-none"
          >
            <FaPlus />
            <span className="font-bold">Tambah Soal</span>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <Search
          data={dataQuiz}
          onSearchResults={handleSearchResults}
          searchFields={['question_text', 'category.name', 'correctContent.label', 'answer_key']}
          placeholder="Cari berdasarkan pertanyaan, kategori, atau jawaban..."
          className="w-full sm:w-80 md:w-96"
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-blue-400 mb-4" />
            <Text className="text-slate-500 font-bold animate-pulse">
              Memuat Data Kuis...
            </Text>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <IoSearch className="text-6xl text-slate-300" />
              <Text className="text-slate-400 font-bold text-lg">
                {dataQuiz.length === 0 
                  ? "Belum ada soal kuis yang terdaftar."
                  : "Tidak ada hasil yang sesuai dengan pencarian."}
              </Text>
              {dataQuiz.length > 0 && (
                <Button
                  onClick={() => setFilteredData(dataQuiz)}
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
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Kategori
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap min-w-[250px]">
                    Pertanyaan
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Kunci Jawaban
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* TBODY - Menggunakan currentItems */}
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item, index) => {
                  const ITEMS_PER_PAGE = 10;
                  const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      {/* NOMOR URUT DINAMIS BERDASARKAN HALAMAN */}
                      <td className="px-6 py-4 text-slate-400 font-bold">
                        {rowNumber}
                      </td>

                      {/* KATEGORI */}
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-blue-100">
                          {item.category?.name || "Tanpa Kategori"}
                        </span>
                      </td>

                      {/* PERTANYAAN */}
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        <div
                          className="max-w-md truncate"
                          title={item.question_text}
                        >
                          {item.question_text}
                        </div>
                      </td>

                      {/* JAWABAN BENAR */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                          <span className="font-black bg-white px-2 py-0.5 rounded shadow-sm text-xs">
                            {item.answer_key}
                          </span>
                          <span className="text-sm font-bold">
                            {item.correctContent?.label || "-"}
                          </span>
                        </div>
                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/quiz/edit/${item.id}`)
                            }
                            className="p-3 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            title="Edit Kuis"
                          >
                            <FaEdit size={16} />
                          </button>

                          <button
                            onClick={() => deleteQuiz(item.id)}
                            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            title="Hapus Kuis"
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

            {/* KOMPONEN PAGINATION GLOBAL DI BAWAH TABEL */}
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

export default TableQuiz;