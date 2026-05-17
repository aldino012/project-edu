import React from "react";
import Button from "./Button"; // Memanggil Button.jsx yang sudah dibuat
import { FaEdit, FaTrash } from "react-icons/fa"; // Icon untuk tombol aksi

const Table = ({
  columns = [], // Array untuk nama-nama kolom
  data = [], // Array dari backend (data tabel)
  onEdit, // Fungsi saat tombol edit diklik
  onDelete, // Fungsi saat tombol hapus diklik
}) => {
  return (
    <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-[3px] border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          {/* ================= HEADER TABEL ================= */}
          <thead>
            <tr className="bg-slate-100 border-b-[3px] border-slate-200">
              {/* Looping untuk header kolom dinamis */}
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-5">
                  {/* WADAH TEKS: Judul Kolom (misal: "GAMBAR", "AUDIO") ditaruh di sini */}
                </th>
              ))}

              {/* Kolom statis untuk Aksi (Edit/Hapus) */}
              <th className="px-6 py-5 text-center">
                {/* WADAH TEKS: Judul Kolom "AKSI" ditaruh di sini */}
              </th>
            </tr>
          </thead>

          {/* ================= ISI TABEL (BODY) ================= */}
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  {/* Looping Data per Baris */}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {/* Ini adalah data dinamis dari backend, jadi tidak perlu Text.jsx kamus, 
                          bisa langsung dirender atau menggunakan Text.jsx sebagai style saja */}
                      {row[col.accessor]}
                    </td>
                  ))}

                  {/* Tombol Aksi (Edit & Hapus) menggunakan Button.jsx */}
                  <td className="px-6 py-4 flex items-center justify-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit && onEdit(row)}
                      className="flex items-center gap-2"
                    >
                      <FaEdit />
                      {/* WADAH TEKS: Tombol "EDIT" ditaruh di sini */}
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete && onDelete(row)}
                      className="flex items-center gap-2"
                    >
                      <FaTrash />
                      {/* WADAH TEKS: Tombol "HAPUS" ditaruh di sini */}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              /* ================= STATE JIKA DATA KOSONG ================= */
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-16 text-center"
                >
                  {/* WADAH TEKS: Pesan "Data Tidak Ditemukan" ditaruh di sini */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;