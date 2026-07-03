export const updateMetaTags = (event) => {
  if (!event) return;

  const updateMetaTag = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  const updateNameMetaTag = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  // Get absolute base URL
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "http:";
  const host =
    typeof window !== "undefined" ? window.location.host : "localhost:3001";
  const baseUrl = `${protocol}//${host}`;

  // Get the banner image with fallback strategy
  let absoluteImageUrl = event.absoluteBannerUrl;
  let bannerImagePath = event.banner_image;

  if (!absoluteImageUrl) {
    let bannerImage = event.banner_image;
    bannerImagePath = bannerImage;

    if (!bannerImage) {
      bannerImage = event.gameImage || event.game?.image;
      bannerImagePath = bannerImage;
    }

    if (!bannerImage) {
      bannerImagePath = bannerImage;
    }

    if (bannerImage && bannerImage.startsWith("http")) {
      absoluteImageUrl = bannerImage;
    } else if (bannerImage && bannerImage.startsWith("/")) {
      absoluteImageUrl = `${baseUrl}${bannerImage}`;
    } else if (bannerImage) {
      absoluteImageUrl = `${baseUrl}/${bannerImage}`;
    } else {
      absoluteImageUrl = `${baseUrl}/api/og-image/${event.id}`;
    }
  }

  const eventUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const eventDate =
    event.start_date || event.date
      ? new Date(event.start_date || event.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "TBD";

  const location = event.location || event.venue || "Online";
  const platform = event.platform || "All Platforms";
  const status =
    event.status === "Upcoming"
      ? "Registration Open"
      : event.status === "Ongoing"
        ? "In Progress"
        : "Completed";

  let description = `${event.title} - ${status} on ${eventDate} in ${location}`;
  if (event.prizePool && event.prizePool > 0) {
    description += `. Prize Pool: ${event.currency} ${event.prizePool.toLocaleString()}`;
  }
  description += `. Join the competition on Inception Games platform!`;

  // Determine image type
  let imageType = "image/jpeg";
  if (bannerImagePath) {
    if (bannerImagePath.includes(".webp")) imageType = "image/webp";
    else if (bannerImagePath.includes(".png")) imageType = "image/png";
    else if (bannerImagePath.includes(".gif")) imageType = "image/gif";
  }

  // Convert to HTTPS for production
  if (
    absoluteImageUrl &&
    absoluteImageUrl.startsWith("http://") &&
    typeof window !== "undefined"
  ) {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocalhost) {
      absoluteImageUrl = absoluteImageUrl.replace("http://", "https://");
    }
  }

  // Open Graph tags
  updateMetaTag("og:title", event.title || "Inception Games Tournament");
  updateMetaTag("og:description", description);
  updateMetaTag("og:image", absoluteImageUrl);
  updateMetaTag("og:image:width", "1200");
  updateMetaTag("og:image:height", "630");
  updateMetaTag("og:image:type", imageType);
  updateMetaTag("og:image:alt", `${event.title} Tournament Card`);
  updateMetaTag("og:url", eventUrl);
  updateMetaTag("og:type", "website");
  updateMetaTag("og:site_name", "Inception Games");
  updateMetaTag("fb:app_id", process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1234567890");

  // Twitter Card tags
  updateNameMetaTag("twitter:card", "summary_large_image");
  updateNameMetaTag(
    "twitter:title",
    event.title || "Inception Games Tournament",
  );
  updateNameMetaTag("twitter:description", description);
  updateNameMetaTag("twitter:image", absoluteImageUrl);
  updateNameMetaTag("twitter:image:alt", `${event.title} Tournament Card`);
  updateNameMetaTag("twitter:site", "@SnSGames");
  updateNameMetaTag("twitter:creator", "@SnSGames");
  updateNameMetaTag("twitter:domain", host);

  // LinkedIn tags
  updateMetaTag(
    "og:image:secure_url",
    absoluteImageUrl.replace("http://", "https://"),
  );

  // Additional meta tags
  updateNameMetaTag("description", description);
  updateMetaTag("og:locale", "en_US");
};
