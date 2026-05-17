import React from "react";

// ==========================================
// 1. WADAH TEKS (DICTIONARY)
// ==========================================
export const APP_TEXTS = {
  // --- Homepage / Game Menu ---
  title_main: "MARI BELAJAR BERSAMA",
  card_huruf: "MENGENAL\nHURUF",
  card_angka: "MENGENAL\nANGKA",
  card_warna: "MENGENAL\nWARNA",
  card_quiz: "MAIN\nKUIS",

  // --- Admin Panel Specific ---
  admin_sidebar_title: "ADMIN PANEL",
  admin_menu_angka: "Manajemen Angka",
  admin_menu_huruf: "Manajemen Huruf",
  admin_menu_warna: "Manajemen Warna",
  admin_menu_quiz: "Manajemen Kuis",
  admin_welcome: "Selamat Datang di Panel Kontrol",

  // --- Admin Login ---
  admin_login_subtitle: "Panel Kontrol Manajemen Konten",
  admin_login_token_label: "Access Token",
  admin_login_btn: "LOGIN",
  admin_login_footer: "Sesi Admin: 60 Menit",

  // --- Admin CRUD General & Huruf ---
  admin_huruf_title: "Data Master Huruf",
  admin_huruf_add: "Tambah Huruf Baru",
  admin_huruf_edit: "Edit Data Huruf",

  table_no: "No",
  table_huruf: "Huruf",
  table_gambar: "Gambar",
  table_audio: "Audio",
  table_aksi: "Aksi",

  msg_empty_data: "Belum ada data tersedia.",
  msg_delete_confirm: "Apakah Anda yakin ingin menghapus data ini?",

  // --- Quiz & Game Flow ---
  quiz_title: "AYO TEBAK!",
  quiz_score: "Skor Kamu",
  quiz_next: "Lanjut",
  quiz_finish: "Selesai",
  quiz_retry: "Main Lagi",

  // --- Form & Label ---
  label_huruf: "Karakter Huruf", // Spesifik untuk form huruf
  label_kategori: "Nama Kategori",
  label_upload_img: "Upload Gambar",
  label_upload_aud: "Upload Audio",

  // --- Buttons ---
  btn_tambah: "Tambah Data",
  btn_simpan: "Simpan Data",
  btn_batal: "Batal",
  btn_kembali: "Kembali",
  btn_keluar: "Keluar",
  btn_main: "Mulai Bermain",
  btn_edit: "Edit",
  btn_hapus: "Hapus",

  // --- Feedback / Status ---
  loading: "Memuat data...",
  error_fetch: "Gagal mengambil data dari server",
};

// ==========================================
// 2. KOMPONEN TEXT UTAMA
// ==========================================
const Text = ({
  textKey,
  children,
  variant = "body",
  align = "left",
  as,
  className = "",
  ...props
}) => {
  let content = APP_TEXTS[textKey];

  if (!content) {
    content = children || textKey;
  }

  const formatContent = (text) => {
    if (typeof text !== "string") return text;
    return text.split("\n").map((item, index) => (
      <React.Fragment key={index}>
        {item}
        {index !== text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const variants = {
    title:
      "text-3xl md:text-5xl font-black tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]",
    subtitle: "text-xl md:text-2xl font-bold tracking-wide drop-shadow-sm",
    body: "text-base md:text-lg font-medium leading-relaxed",
    label: "text-sm font-bold tracking-wider uppercase opacity-80",
    alphabet:
      "text-6xl md:text-8xl font-black drop-shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:scale-110 transition-transform cursor-pointer",
    admin_nav:
      "text-sm font-semibold tracking-wide hover:text-blue-500 transition-colors",
    // Tambahan variant untuk teks footer atau label kecil di login
    caption: "text-[10px] font-bold uppercase tracking-wider opacity-60",
    // Variant khusus untuk header tabel admin
    table_head: "text-xs font-bold text-slate-500 uppercase tracking-wider",
  };

  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  let Component = as;
  if (!Component) {
    if (variant === "title") Component = "h1";
    else if (variant === "subtitle") Component = "h2";
    else if (variant === "alphabet") Component = "span";
    else if (variant === "label" || variant === "table_head")
      Component = "label";
    else Component = "p";
  }

  return (
    <Component
      className={`${variants[variant] || variants.body} ${alignments[align] || alignments.left} ${className}`}
      {...props}
    >
      {formatContent(content)}
    </Component>
  );
};

export default Text;