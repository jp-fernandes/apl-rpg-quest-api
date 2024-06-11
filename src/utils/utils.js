function getOperatingSystem(userAgent) {
  userAgent = userAgent.toLowerCase();

  switch (true) {
    case userAgent.includes("iphone"):
    case userAgent.includes("ipad"):
    case userAgent.includes("ipod"):
      return "iOS";
    case userAgent.includes("android"):
      return "Android";
    case userAgent.includes("windows"):
      return "Windows";
    case userAgent.includes("mac os"):
    case userAgent.includes("macintosh"):
      return "Mac OS";
    case userAgent.includes("linux"):
      return "Linux";
    default:
      return "Unknown";
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

module.exports = {
  getOperatingSystem,
  formatDate
};
