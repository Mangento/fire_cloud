const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const {validateEmailData} = require("./utils/validator");
const {detectHost} = require("./utils/hostDetector");
const {logger} = require("./utils/logger");

// Check if running in Firebase Functions environment
const isFirebaseEnvironment = process.env.FUNCTION_NAME !== undefined;

let functions, admin;
if (isFirebaseEnvironment) {
  functions = require("firebase-functions");
  admin = require("firebase-admin");
  admin.initializeApp();
}

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

/**
 * Send Email Handler
 * Handles email sending via Postfix/SMTP with validation and logging
 * Works as both Firebase Function and Express middleware
 */
async function sendEmailHandler(req, res) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logger.info(`[${requestId}] Incoming email request`, {
    method: req.method,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Only allow POST requests
  if (req.method !== "POST") {
    logger.warn(`[${requestId}] Invalid method: ${req.method}`);
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
      requestId: requestId,
    });
  }

  try {
    // Validate incoming data
    const {error, value} = validateEmailData(req.body);

    if (error) {
      logger.warn(`[${requestId}] Validation error`, {
        errors: error.details.map((d) => d.message),
        receivedData: req.body,
      });

      return res.status(400).json({
        success: false,
        error: "Invalid data provided",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
        requestId: requestId,
      });
    }

    const {to, subject, text, html, from} = value;

    // Detect host information
    const hostInfo = detectHost(req);

    logger.info(`[${requestId}] Host detected`, hostInfo);

    // Get SMTP configuration from environment
    const smtpConfig = {
      host: (isFirebaseEnvironment ? functions.config().smtp?.host : null) || process.env.SMTP_HOST || "localhost",
      port: parseInt((isFirebaseEnvironment ? functions.config().smtp?.port : null) || process.env.SMTP_PORT || "25"),
      secure: ((isFirebaseEnvironment ? functions.config().smtp?.secure === "true" : false) || process.env.SMTP_SECURE === "true") || false,
      auth: ((isFirebaseEnvironment ? functions.config().smtp?.user : null) || process.env.SMTP_USER) ? {
        user: (isFirebaseEnvironment ? functions.config().smtp?.user : null) || process.env.SMTP_USER,
        pass: (isFirebaseEnvironment ? functions.config().smtp?.pass : null) || process.env.SMTP_PASS,
      } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    };

    logger.info(`[${requestId}] SMTP Configuration`, {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      authConfigured: !!smtpConfig.auth,
    });

    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify SMTP connection
    try {
      await transporter.verify();
      logger.info(`[${requestId}] SMTP connection verified`);
    } catch (verifyError) {
      logger.error(`[${requestId}] SMTP verification failed`, {
        error: verifyError.message,
      });
    }

    // Mail options
    const mailOptions = {
      from: from || (isFirebaseEnvironment ? functions.config().smtp?.from : null) || process.env.SMTP_FROM || "noreply@example.com",
      to: to,
      subject: subject,
      text: text,
      html: html || text,
      headers: {
        "X-Request-ID": requestId,
        "X-Host-Info": JSON.stringify(hostInfo),
      },
    };

    logger.info(`[${requestId}] Sending email`, {
      to: to,
      subject: subject,
      from: mailOptions.from,
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);

    const duration = Date.now() - startTime;

    logger.info(`[${requestId}] Email sent successfully`, {
      messageId: info.messageId,
      response: info.response,
      duration: `${duration}ms`,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      requestId: requestId,
      messageId: info.messageId,
      hostInfo: hostInfo,
      duration: duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error(`[${requestId}] Error sending email`, {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });

    return res.status(500).json({
      success: false,
      error: "Failed to send email",
      message: error.message,
      requestId: requestId,
    });
  }
}

/**
 * Health Check Handler
 * Works as both Firebase Function and Express middleware
 */
function healthCheckHandler(req, res) {
  const hostInfo = detectHost(req);

  logger.info("Health check requested", {
    ip: req.ip,
    host: hostInfo.hostname,
  });

  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    hostInfo: hostInfo,
    service: "postfix-mailer",
    version: "1.0.0",
  });
}

// Export for both Firebase Functions and Express
if (isFirebaseEnvironment) {
  // Firebase Functions export
  exports.sendEmail = functions.https.onRequest(sendEmailHandler);
  exports.healthCheck = functions.https.onRequest(healthCheckHandler);
} else {
  // Express export (for Upsun/standalone server)
  exports.sendEmail = sendEmailHandler;
  exports.healthCheck = healthCheckHandler;
}
