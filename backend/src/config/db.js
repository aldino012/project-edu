const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // Akan otomatis pilih 'mysql' atau 'postgres'
    port: process.env.DB_PORT,
    logging: false,
    define: {
      timestamps: false,
      freezeTableName: true,
    },
    // Pool sangat penting agar koneksi tidak mudah 'stuck' atau hang
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Jika menggunakan Postgres di beberapa environment Linux tertentu,
    // terkadang butuh dialecOptions tambahan (opsional)
    dialectOptions:
      process.env.DB_DIALECT === "postgres"
        ? {
            // Tambahkan ssl: false jika koneksi lokal tidak pakai SSL
            // ssl: { rejectUnauthorized: false }
          }
        : {},
  },
);

module.exports = sequelize;