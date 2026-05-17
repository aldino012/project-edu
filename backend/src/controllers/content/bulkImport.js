const fs = require("fs");
const path = require("path");
const { Content, Category } = require("../../models"); // Sesuaikan path model Anda
const { kamusHuruf, angkaKeTerbilang } = require("../../utils/contentHelpers");

const bulkImportSamples = async (req, res) => {
  try {
    const { category_id } = req.body;

    // Cek Kategori
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Kategori tidak ditemukan" });
    }

    const categoryName = category.name.toLowerCase();
    let type = "";
    if (categoryName.includes("angka")) type = "angka";
    else if (categoryName.includes("huruf")) type = "huruf";
    else if (categoryName.includes("warna")) type = "warna";
    else {
      return res.status(400).json({
        success: false,
        message: "Kategori ini belum didukung untuk sinkronisasi massal.",
      });
    }

    // Path setup
    const sampleBasePath = path.join(process.cwd(), "src/sample");
    const uploadAudioPath = path.join(process.cwd(), "src/uploads/audio");
    const uploadImagePath = path.join(process.cwd(), "src/uploads/images");
    
    const results = [];

    // Ambil data yang sudah ada di database untuk mencegah duplikasi
    const existingContents = await Content.findAll({ where: { category_id } });
    const existingValues = existingContents.map((c) => c.value.toUpperCase());

    // Pastikan folder tujuan ada
    if (!fs.existsSync(uploadAudioPath))
      fs.mkdirSync(uploadAudioPath, { recursive: true });
    if (!fs.existsSync(uploadImagePath))
      fs.mkdirSync(uploadImagePath, { recursive: true });

    // Lakukan Sinkronisasi Berdasarkan Tipe
    if (type === "angka") {
      const audioPath = path.join(sampleBasePath, "audio/angka");
      if (fs.existsSync(audioPath)) {
        const files = fs.readdirSync(audioPath);
        for (const file of files) {
          const value = path.parse(file).name; // Ambil "10" dari "10.mp3"

          // Skip jika sudah ada di DB
          if (existingValues.includes(value.toUpperCase())) continue;

          // Copy file audio
          fs.copyFileSync(
            path.join(audioPath, file),
            path.join(uploadAudioPath, file),
          );

          results.push({
            category_id: category.id,
            value: value,
            label: angkaKeTerbilang(value), // Import dari utils
            image_url: null,
            audio_url: `/uploads/audio/${file}`,
          });
        }
      }
    } else if (type === "huruf") {
      const imagePath = path.join(sampleBasePath, "images/huruf");
      if (fs.existsSync(imagePath)) {
        const files = fs.readdirSync(imagePath);
        for (const file of files) {
          const char = path.parse(file).name.toUpperCase(); // Ambil "A" dari "A.png"

          if (existingValues.includes(char)) continue;

          // Copy file gambar
          fs.copyFileSync(
            path.join(imagePath, file),
            path.join(uploadImagePath, file),
          );

          // Penamaan audio
          const audioFileName = `${char.toLowerCase()}.mp3`;

          // Cek apakah di folder sample audio juga sudah ada file audionya
          const sampleAudioSrc = path.join(
            sampleBasePath,
            `audio/huruf/${audioFileName}`,
          );
          if (fs.existsSync(sampleAudioSrc)) {
            fs.copyFileSync(
              sampleAudioSrc,
              path.join(uploadAudioPath, audioFileName),
            );
          }

          results.push({
            category_id: category.id,
            value: char,
            label: kamusHuruf[char] || char, // Import dari utils
            image_url: `/uploads/images/${file}`,
            audio_url: `/uploads/audio/${audioFileName}`,
          });
        }
      }
    } else if (type === "warna") {
      // Logika warna membaca dari file JSON
      const jsonPath = path.join(sampleBasePath, "warna.json");

      if (fs.existsSync(jsonPath)) {
        const rawData = fs.readFileSync(jsonPath, "utf-8"); // Membaca file json
        const warnaData = JSON.parse(rawData);

        for (const item of warnaData) {
          // Cek duplikasi berdasarkan Hex value
          if (existingValues.includes(item.value.toUpperCase())) continue;

          results.push({
            category_id: category.id,
            value: item.value.toUpperCase(),
            label: item.label, // Warna sudah ada di JSON, jadi langsung ambil
            image_url: null,
            audio_url: null,
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "File warna.json tidak ditemukan di folder src/sample.",
        });
      }
    }

    // Insert massal ke Database jika ada data baru
    if (results.length > 0) {
      await Content.bulkCreate(results);
    }

    return res.status(200).json({
      success: true,
      message: `Berhasil mengimpor ${results.length} materi ${type} baru.`,
      data: results,
    });
  } catch (error) {
    console.error("🔥 Error Bulk Import:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal melakukan sinkronisasi massal",
      error: error.message,
    });
  }
};

module.exports = bulkImportSamples;