function getOperatingSystem(userAgent) {
  userAgent = userAgent.toLowerCase();

  if (
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    userAgent.includes("ipod")
  ) {
    return "iOS";
  } else if (userAgent.includes("android")) {
    return "Android";
  } else if (userAgent.includes("windows")) {
    return "Windows";
  } else if (userAgent.includes("mac os") || userAgent.includes("macintosh")) {
    return "Mac OS";
  } else if (userAgent.includes("linux")) {
    return "Linux";
  } else {
    return "Unknown";
  }
}

function formatDate(date) {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");
  return formattedDate;
}

module.exports = {
  getOperatingSystem,
  formatDate
};
