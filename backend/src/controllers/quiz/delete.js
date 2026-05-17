const { Quiz } = require("../../models");

// 5. DELETE: Hapus Soal
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gunakan destroy dengan klausa where untuk langsung menghapus
    const result = await Quiz.destroy({ where: { id } });
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "Data tidak ditemukan" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Soal berhasil dihapus" 
    });
  } catch (error) {
    console.error("Error Delete Quiz:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Gagal menghapus soal", 
      error: error.message 
    });
  }
};

module.exports = deleteQuiz;