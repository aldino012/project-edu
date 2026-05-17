const { Content } = require("../../models");
const { deleteFile } = require("../../utils/contentHelpers");

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Cari data di database
    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Materi tidak ditemukan",
      });
    }

    // 2. Hapus file Gambar jika merupakan file lokal (berada di folder uploads)
    if (content.image_url && content.image_url.startsWith("/uploads/")) {
      console.log("Menghapus file gambar fisik...");
      deleteFile(content.image_url);
    }

    // 3. Hapus file Audio jika merupakan file lokal
    if (content.audio_url && content.audio_url.startsWith("/uploads/")) {
      console.log("Menghapus file audio fisik...");
      deleteFile(content.audio_url);
    }

    // 4. Hapus data dari database
    await content.destroy();

    // 5. Respon sukses
    return res.status(200).json({
      success: true,
      message: "Materi dan file fisik terkait berhasil dihapus selamanya",
    });
  } catch (error) {
    console.error("🔥 Error Delete Content:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus materi",
      error: error.message,
    });
  }
};

module.exports = deleteContent;