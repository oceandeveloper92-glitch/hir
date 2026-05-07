const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME || "hir_international";
const DB_USER = process.env.DB_USER || "hir";
const DB_PASSWORD = process.env.DB_PASSWORD != null ? process.env.DB_PASSWORD : "#Bhavy@8803";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
   
    await connection.end();

    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
};

module.exports = { sequelize, createDatabase };
