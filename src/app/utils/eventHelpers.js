// Date formatting helpers
export const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr);
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Status helpers
export const getStatusText = (status) => {
  switch (status) {
    case "Upcoming":
      return "Registration Open";
    case "Ongoing":
      return "In Progress";
    case "Completed":
      return "Tournament Ended";
    default:
      return status;
  }
};

export const getEventType = (title, organizer) => {
  const lowerTitle = (title || "").toLowerCase();
  const lowerOrg = (organizer || "").toLowerCase();

  if (
    lowerTitle.includes("brand") ||
    lowerTitle.includes("deal") ||
    lowerTitle.includes("sponsor")
  ) {
    return "Brand Deal";
  }
  if (lowerTitle.includes("scrim")) {
    return "Scrims";
  }
  return "Tournament";
};

// Sharing helpers
export const generateShareMessage = (event) => {
  const eventDate =
    event.start_date || event.date
      ? new Date(event.start_date || event.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Soon";
  const location = event.location || event.venue || "Online";
  const platform = event.platform || "All Platforms";
  const status =
    event.status === "Upcoming"
      ? "Registration Open"
      : event.status === "Ongoing"
        ? "In Progress"
        : "Completed";

  let prizeText = "";
  if (event.prizePool && event.prizePool > 0) {
    prizeText = ` • Prize Pool: ${event.currency} ${event.prizePool.toLocaleString()}`;
  }

  return `🎮 ${event.title}

📅 ${eventDate} • ${status}
📍 ${location} • ${platform}

Join the action! Sign up now on Inception Games.${prizeText}`;
};
