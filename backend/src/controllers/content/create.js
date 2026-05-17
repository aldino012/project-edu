const { Content, Category } = require("../../models");
const {
  kamusHuruf,
  angkaKeTerbilang,
  isValidLetter,
  isValidNumber,
} = require("../../utils/contentHelpers");

const createContent = async (req, res) => {
  try {
    const { category_id, value, label, image_url, audio_url } = req.body;

    // =========================
    // CHECK CATEGORY
    // =========================
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Kategori dengan ID '${category_id}' tidak ditemukan.`,
      });
    }

    const finalValue = String(value).toUpperCase();
    let finalLabel = label; // Inisialisasi label awal

    // =========================
    // DUPLIKAT CHECK PER CATEGORY
    // =========================
    const existing = await Content.findOne({
      where: {
        category_id,
        value: finalValue,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Value sudah ada di kategori ini (tidak boleh duplikat)",
      });
    }

    // =========================
    // RULE: HURUF (A-Z ONLY) + AUTO LABEL
    // =========================
    if (category.name.toLowerCase().includes("huruf")) {
      // Menggunakan helper isValidLetter dari utils
      if (!isValidLetter(finalValue)) {
        return res.status(400).json({
          success: false,
          message: "Huruf hanya boleh A-Z",
        });
      }

      // Jika label kosong, ambil dari kamusHuruf
      if (!finalLabel) {
        finalLabel = kamusHuruf[finalValue] || null;
      }

      if (!finalLabel) {
        return res.status(400).json({
          success: false,
          message:
            "Label wajib diisi atau pastikan huruf valid untuk auto-label",
        });
      }
    }

    // =========================
    // RULE: ANGKA (0 - 100) + AUTO LABEL
    // =========================
    if (category.name.toLowerCase().includes("angka")) {
      // Menggunakan helper isValidNumber dari utils
      if (!isValidNumber(finalValue)) {
        return res.status(400).json({
          success: false,
          message: "Angka hanya boleh 0 - 100",
        });
      }

      // Jika label kosong, otomatis jadikan terbilang
      if (!finalLabel) {
        finalLabel = angkaKeTerbilang(finalValue);
      }
    }

    // =========================
    // SIMPAN SEBAGAI PATH RELATIF
    // =========================
    const finalImageUrl = req.files?.image
      ? `/uploads/images/${req.files.image[0].filename}`
      : image_url || null;

    const finalAudioUrl = req.files?.audio
      ? `/uploads/audio/${req.files.audio[0].filename}`
      : audio_url || null;

    // =========================
    // CREATE CONTENT
    // =========================
    const newContent = await Content.create({
      category_id: category.id,
      value: finalValue,
      label: finalLabel, // Menggunakan label yang sudah diproses (manual/auto)
      image_url: finalImageUrl,
      audio_url: finalAudioUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Materi berhasil ditambahkan",
      data: newContent,
    });
  } catch (error) {
    console.error("Error Create Content:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menambah materi",
      error: error.message,
    });
  }
};

module.exports = createContent;