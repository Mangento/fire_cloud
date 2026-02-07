const express = require("express");
const path = require("path");
const cors = require("cors");

// Import the functions
const sendEmailHandler = require("./functions/index").sendEmail;
const healthCheckHandler = require("./functions/index").healthCheck;

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Convert Firebase Functions to Express routes
app.post("/api/send-email", (req, res) => {
  sendEmailHandler(req, res);
});

app.get("/api/health", (req, res) => {
  healthCheckHandler(req, res);
});

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Postfix Mailer server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📧 API Endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  
  // Auto-detect environment
  if (process.env.PLATFORM_PROJECT) {
    console.log(`☁️  Running on Upsun/Platform.sh`);
    console.log(`   Project: ${process.env.PLATFORM_PROJECT}`);
    console.log(`   Branch: ${process.env.PLATFORM_BRANCH || 'unknown'}`);
  } else if (process.env.FUNCTION_NAME) {
    console.log(`☁️  Running on Firebase Functions`);
  } else {
    console.log(`💻 Running locally`);
  }
});

module.exports = app;
