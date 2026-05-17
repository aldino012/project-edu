# EduPlay: Platform Web Edukasi Interaktif Anak

EduPlay adalah aplikasi web edukasi interaktif yang dirancang untuk membantu anak usia dini mengenal **huruf, angka, dan warna** melalui visual (gambar/GIF) dan audio (MP3). Platform ini dilengkapi dengan **kuis interaktif** untuk mengevaluasi hasil belajar serta **Dashboard Admin** untuk mengelola konten pembelajaran secara dinamis (CRUD).

Aplikasi ini menggunakan arsitektur *decoupled* (RESTful API + SPA) dan telah dikontainerisasi sepenuhnya dengan Docker.

---

## 🚀 Fitur Utama

### 👶 Untuk Anak (Pengguna)
- **Materi Huruf & Angka** – Dilengkapi navigasi (paginasi), gambar interaktif, dan pelafalan audio.
- **Materi Warna** – Pembelajaran visual berbasis palet warna dengan efek suara.
- **Kuis Interaktif** – Umpan balik visual (senang/sedih) dan ringkasan skor akhir.

### 👨‍💻 Untuk Admin
- **Autentikasi aman** dengan `authMiddleware`
- **Manajemen konten penuh (CRUD)** untuk:
  - Angka
  - Huruf
  - Warna
  - Kuis
- **Bulk Import** – Memudahkan pengisian data awal secara massal.

---

## 🛠️ Teknologi yang Digunakan

| Bagian       | Teknologi |
|--------------|-----------|
| **Backend**  | Node.js, Express.js (v5.2.1), PostgreSQL, Sequelize ORM (v6.37.8), Multer (upload file) |
| **Frontend** | React (v19), Vite (v8), Tailwind CSS (v4), Nginx (serving SPA) |
| **Arsitektur** | Custom Hooks Pattern (pemisahan logika dari UI) |
| **Tunneling** | Cloudflare Tunnel (akses publik otomatis) |

---

## 📁 Struktur Folder

```
project-edu/
├── backend/                  # RESTful API (Express.js + Sequelize)
│   ├── src/
│   │   └── uploads/          # Tempat penyimpanan file audio & gambar
│   ├── Dockerfile
│   └── package.json
│
├── tampilan-app/             # React + Vite (SPA)
│   ├── src/                  # Components, Pages, Hooks
│   ├── nginx.conf
│   └── Dockerfile
│
├── .env                      # Variabel lingkungan (DB, Ports, dll)
├── docker-compose.yml        # Orkestrasi container
└── README.md
```

---

## ⚙️ Cara Menjalankan Proyek

### ✅ Prasyarat
- Docker & Docker Compose terinstal

---

### 🐳 Menjalankan dengan Docker

1. **Clone repositori**
   ```bash
   git clone https://github.com/aldin012/project-edu.git
   cd project-edu
   ```

2. **Buat file `.env`** di folder root (sejajar dengan `docker-compose.yml`):
   ```env
   # Database
   DB_NAME=edu_database
   DB_USER=postgres
   DB_PASSWORD=password_database_anda
   
   # Ports
   DB_PORT_EXTERNAL=5433
   BE_PORT_EXTERNAL=5000
   FE_EXTERNAL_PORT=8080
   
   # Token Admin
   ADMIN_TOKEN=rahasia123
   ```

3. **Build dan jalankan container**
   ```bash
   docker-compose up -d --build
   ```

4. **Akses aplikasi**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:5000`

5. **Akses dari internet (otomatis dengan Cloudflare Tunnel)**
   - Setelah container berjalan, cek URL tunnel:
     ```bash
     docker logs cloudflare-tunnel
     ```
   - Akan muncul URL seperti `https://xxxx-xxx-xxx-xxx-xxxx.trycloudflare.com`

---

### 💻 Opsi Manual (Tanpa Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd tampilan-app
npm install
npm run dev
```

> **Catatan:** Untuk mode manual, pastikan PostgreSQL berjalan di lokal Anda.

---

## 📌 Catatan Penting

- **Frontend** berjalan di port `8080` (bisa diubah via `.env`)
- **Backend** berjalan di port `5000`
- **Database** berjalan di port `5433` (eksternal) untuk mencegah konflik dengan PostgreSQL lokal
- File upload (audio/gambar) disimpan di `./backend/src/uploads` dan tetap persist meskipun container di-restart
- **Cloudflare Tunnel** otomatis memberikan URL publik tanpa perlu konfigurasi domain

---

## 🛑 Menghentikan Aplikasi

```bash
docker-compose down
```

Untuk menghapus volume database juga:
```bash
docker-compose down -v
```

---

## 📞 Kontak & Dukungan

