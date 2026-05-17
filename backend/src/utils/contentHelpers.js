const fs = require("fs");
const path = require("path");

/**
 * Helper function untuk menghapus file fisik di storage dengan aman.
 * Fungsi ini mengonversi URL Database menjadi Path File Sistem lokal.
 */
const deleteFile = (filePath) => {
  if (!filePath || typeof filePath !== "string") return;

  try {
    const urlPathname = filePath; 

    // Hilangkan slash di depan agar bisa digabung dengan path.join
    const relativePath = urlPathname.startsWith("/")
      ? urlPathname.substring(1)
      : urlPathname;

    // Mengubah 'uploads/' menjadi 'src/uploads/'.
    const physicalPath = relativePath.replace("uploads/", "src/uploads/");

    // Gabungkan dengan path absolut project
    const fullPath = path.resolve(process.cwd(), physicalPath);

    // Eksekusi penghapusan jika file benar-benar ada
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Berhasil menghapus file fisik: ${path.basename(fullPath)}`);
    } else {
      console.log(`⚠️ File tidak ditemukan pada path: ${fullPath}`);
    }
  } catch (error) {
    console.error("❌ Gagal menghapus file fisik:", error.message);
  }
};

/**
 * Helper: validasi huruf A-Z
 */
const isValidLetter = (value) => {
  return /^[A-Z]$/.test(value);
};

/**
 * Helper: validasi angka 0 - 100
 */
const isValidNumber = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= 100;
};

// ==========================================
// KAMUS & KONVERSI DATA
// ==========================================

const kamusHuruf = {
  A: "Ayam", B: "Babi", C: "Cicak", D: "Domba", E: "Elang",
  F: "Flaminggo", G: "Gajah", H: "Harimau", I: "Itik", J: "Jerapah",
  K: "Kucing", L: "Lebah", M: "Monyet", N: "Naga", O: "Orang Utan",
  P: "Pinguin", Q: "Quran", R: "Rubah", S: "Sapi", T: "T-Rex",
  U: "Ular", V: "Violin", W: "Wortel", X: "Xesophone", Y: "Yuyu", Z: "Zebrah",
};

/**
 * Helper: Mengubah angka 0-100 menjadi teks terbilang Bahasa Indonesia
 */
const angkaKeTerbilang = (n) => {
  const satuan = ["Nol", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  const num = parseInt(n);

  if (isNaN(num)) return n;
  if (num <= 11) return satuan[num];
  if (num < 20) return angkaKeTerbilang(num % 10) + " Belas";
  if (num < 100) {
    const hasilPuluhan = satuan[Math.floor(num / 10)] + " Puluh";
    const sisa = num % 10;
    return sisa !== 0 ? hasilPuluhan + " " + satuan[sisa] : hasilPuluhan;
  }
  if (num === 100) return "Seratus";
  
  return n.toString();
};

module.exports = {
  deleteFile,
  isValidLetter,
  isValidNumber,
  kamusHuruf,
  angkaKeTerbilang,
};