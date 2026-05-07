const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { createDatabase, sequelize } = require("./config/db");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use("/file", express.static(path.join(__dirname, "file")));

app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

app.use(express.static(path.join(__dirname, "dist")));

app.use("/api", require("./routers/index"));


app.use((req, res, next) => {
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/uploads") ||
    req.path.startsWith("/assets")
  ) {
    return next();
  }

  // res.sendFile(path.join(__dirname, "dist", "index.html"));
});


const startServer = async () => {
  try {
    // Create database if it doesn't exist
    await createDatabase();
    console.log("✅ Database connected successfully");

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ alter: false, force: false, logging: false });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Database tables synchronized");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
  }
};

startServer();
