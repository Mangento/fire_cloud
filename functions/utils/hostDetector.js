const os = require("os");

/**
 * Automatically detect host information from the request and system
 * @param {Object} req - Express request object
 * @return {Object} Host information
 */
function detectHost(req) {
  const hostname = os.hostname();
  const platform = os.platform();
  const architecture = os.arch();
  const cpuCount = os.cpus().length;
  const totalMemory = (os.totalmem() / (1024 ** 3)).toFixed(2); // GB
  const freeMemory = (os.freemem() / (1024 ** 3)).toFixed(2); // GB
  const uptime = Math.floor(os.uptime() / 60); // minutes

  // Extract request information
  const clientIp = req.ip ||
                   req.headers["x-forwarded-for"] ||
                   req.connection?.remoteAddress ||
                   "unknown";

  const userAgent = req.get("user-agent") || "unknown";
  const requestHost = req.get("host") || "unknown";
  const protocol = req.protocol || "http";
  const originalUrl = req.originalUrl || req.url || "/";

  // Cloud environment detection
  const isFirebase = process.env.FUNCTION_NAME !== undefined;
  const isGCP = process.env.GCP_PROJECT !== undefined ||
                process.env.GCLOUD_PROJECT !== undefined;
  const isUpsun = process.env.PLATFORM_APPLICATION_NAME !== undefined ||
                  process.env.PLATFORM_PROJECT !== undefined;
  const isVercel = process.env.VERCEL !== undefined;
  const isNetlify = process.env.NETLIFY !== undefined;

  const functionName = process.env.FUNCTION_NAME || "unknown";
  const functionRegion = process.env.FUNCTION_REGION || process.env.PLATFORM_REGION || "unknown";
  const gcpProject = process.env.GCP_PROJECT ||
                     process.env.GCLOUD_PROJECT ||
                     "unknown";
  
  // Upsun/Platform.sh specific variables
  const platformProject = process.env.PLATFORM_PROJECT || "unknown";
  const platformApp = process.env.PLATFORM_APPLICATION_NAME || "unknown";
  const platformBranch = process.env.PLATFORM_BRANCH || "unknown";
  const platformEnvironment = process.env.PLATFORM_ENVIRONMENT || "unknown";

  return {
    // System information
    hostname: hostname,
    platform: platform,
    architecture: architecture,
    cpuCount: cpuCount,
    memory: {
      total: `${totalMemory} GB`,
      free: `${freeMemory} GB`,
      used: `${(totalMemory - freeMemory).toFixed(2)} GB`,
    },
    uptime: `${uptime} minutes`,

    // Request information
    client: {
      ip: clientIp,
      userAgent: userAgent,
    },
    request: {
      host: requestHost,
      protocol: protocol,
      url: originalUrl,
      fullUrl: `${protocol}://${requestHost}${originalUrl}`,
    },

    // Cloud environment
    environment: {
      isFirebase: isFirebase,
      isGCP: isGCP,
      isUpsun: isUpsun,
      isVercel: isVercel,
      isNetlify: isNetlify,
      functionName: functionName,
      functionRegion: functionRegion,
      gcpProject: gcpProject,
      platformProject: platformProject,
      platformApp: platformApp,
      platformBranch: platformBranch,
      platformEnvironment: platformEnvironment,
      nodeVersion: process.version,
      provider: isUpsun ? 'Upsun' : isFirebase ? 'Firebase' : isVercel ? 'Vercel' : isNetlify ? 'Netlify' : isGCP ? 'GCP' : 'Unknown',
    },

    // Timestamp
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get simplified host string for logging
 * @param {Object} req - Express request object
 * @return {string} Simple host string
 */
function getHostString(req) {
  const hostInfo = detectHost(req);
  return `${hostInfo.hostname} (${hostInfo.platform}/${hostInfo.architecture})`;
}

module.exports = {
  detectHost,
  getHostString,
};
