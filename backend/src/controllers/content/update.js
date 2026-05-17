const { Content, Category } = require("../../models");
const { deleteFile, isValidLetter, isValidNumber } = require("../../utils/contentHelpers");

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    let { category_id, value, label, image_url, audio_url } = req.body;

    // =========================
    // SANITIZE ID (Mencegah error jika ID double dari FE)
    // =========================
    const cleanId = Number(String(id).split(",")[0]);
    const cleanCategoryId = category_id
      ? Number(String(category_id).split(",")[0])
      : null;

    // =========================
    // FIND EXISTING CONTENT
    // =========================
    const content = await Content.findByPk(cleanId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Materi tidak ditemukan",
      });
    }

    // =========================
    // VALIDASI KATEGORI
    // =========================
    const category = await Category.findByPk(
      cleanCategoryId || content.category_id,
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    let finalValue = value ? String(value).toUpperCase() : content.value;

    // =========================
    // DUPLICATE CHECK
    // =========================
    if (value) {
      const duplicate = await Content.findOne({
        where: {
          category_id: category.id,
          value: finalValue,
        },
      });

      if (duplicate && duplicate.id !== content.id) {
        return res.status(400).json({
          success: false,
          message: "Value sudah digunakan di kategori ini",
        });
      }
    }

    // =========================
    // RULE VALIDASI (HURUF & ANGKA)
    // =========================
    if (category.name.toLowerCase().includes("huruf")) {
      // Menggunakan helper isValidLetter
      if (value && !isValidLetter(finalValue)) {
        return res.status(400).json({
          success: false,
          message: "Huruf hanya boleh A-Z",
        });
      }
    }

    if (category.name.toLowerCase().includes("angka")) {
      // Menggunakan helper isValidNumber
      if (value && !isValidNumber(finalValue)) {
        return res.status(400).json({
          success: false,
          message: "Angka hanya boleh 0 - 100",
        });
      }
      // Rule: Angka biasanya tidak butuh gambar
      if (req.files?.image) {
        return res.status(400).json({
          success: false,
          message: "Kategori Angka tidak diperbolehkan mengunggah gambar",
        });
      }
    }

    // =========================
    // LOGIKA UPDATE FILE (IMAGE & AUDIO)
    // =========================
    let newImageUrl = content.image_url;
    let newAudioUrl = content.audio_url;

    // --- PROSES GAMBAR ---
    if (req.files?.image) {
      // Jika ada file baru diunggah, simpan path relatif
      newImageUrl = `/uploads/images/${req.files.image[0].filename}`;

      // HAPUS FILE LAMA DARI DISK (Menggunakan helper deleteFile)
      if (content.image_url && content.image_url.startsWith("/uploads/")) {
        deleteFile(content.image_url);
      }
    } else if (image_url === "" || image_url === null) {
      // Jika FE mengirim instruksi hapus gambar (opsional)
      if (content.image_url) deleteFile(content.image_url);
      newImageUrl = null;
    }

    // --- PROSES AUDIO ---
    if (req.files?.audio) {
      // Jika ada file baru diunggah, simpan path relatif
      newAudioUrl = `/uploads/audio/${req.files.audio[0].filename}`;

      // HAPUS FILE LAMA DARI DISK (Menggunakan helper deleteFile)
      if (content.audio_url && content.audio_url.startsWith("/uploads/")) {
        deleteFile(content.audio_url);
      }
    } else if (audio_url === "" || audio_url === null) {
      // Jika FE mengirim instruksi hapus audio (opsional)
      if (content.audio_url) deleteFile(content.audio_url);
      newAudioUrl = null;
    }

    // =========================
    // EKSEKUSI UPDATE KE DATABASE
    // =========================
    await content.update({
      category_id: category.id,
      value: finalValue,
      label: label || content.label,
      image_url: newImageUrl,
      audio_url: newAudioUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Materi berhasil diperbarui",
      data: content,
    });
  } catch (error) {
    console.error("🔥 Error Update Content:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengupdate materi",
      error: error.message,
    });
  }
};

module.exports = updateContent;