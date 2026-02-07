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
const server = app.listen(PORT, '0.0.0.0', () => {
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
  } else if (process.env.K_SERVICE) {
    console.log(`☁️  Running on Google Cloud Run`);
    console.log(`   Service: ${process.env.K_SERVICE}`);
  } else {
    console.log(`💻 Running locally`);
  }
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
