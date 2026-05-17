const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const contentController = require("../controllers/contentController");

// 1. Middleware Auth Admin
const requireAdmin = require("../middlewares/authMiddleware");

// 2. FIXED: Upload directory (absolute path lebih aman)
const baseUploadPath = path.join(__dirname, "../uploads");
const imageUploadPath = path.join(baseUploadPath, "images");
const audioUploadPath = path.join(baseUploadPath, "audio");

// 3. Auto create folder jika belum ada
[baseUploadPath, imageUploadPath, audioUploadPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 4. Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, imageUploadPath);
    } else if (file.fieldname === "audio") {
      cb(null, audioUploadPath);
    } else {
      return cb(new Error('Field file hanya boleh "image" atau "audio"'));
    }
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 5. File filter (opsional tapi bagus untuk keamanan)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File image harus berupa gambar"), false);
    }
  }

  if (file.fieldname === "audio") {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("File audio harus berupa audio"), false);
    }
  }

  cb(null, true);
};

// 6. Upload config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// 7. Multi field upload
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

// =======================
// PUBLIC ROUTES
// =======================

router.get("/", contentController.getAllContents);

router.get("/:id", contentController.getContentById);

// =======================
// ADMIN ROUTES
// =======================

// ENDPOINT BULK IMPORT (Diletakkan di atas agar tidak terbaca sebagai /:id)
router.post("/bulk-import", requireAdmin, contentController.bulkImportSamples);

router.post("/", requireAdmin, uploadFields, contentController.createContent);

router.put("/:id", requireAdmin, uploadFields, contentController.updateContent);

router.delete("/:id", requireAdmin, contentController.deleteContent);

module.exports = router;