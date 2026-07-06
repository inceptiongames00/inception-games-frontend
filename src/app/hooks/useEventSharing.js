import { useCallback } from "react";
import { generateShareMessage } from "@/app/utils/eventHelpers";

export const useEventSharing = (event) => {
  const handleShare = useCallback(async (onSuccess) => {
    const shareMessage = generateShareMessage(event);
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareMessage,
          url: currentUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(currentUrl);
      onSuccess?.("success", "Link copied to clipboard!");
    }
  }, [event]);

  const handleFacebookShare = useCallback(() => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareMessage = generateShareMessage(event);

    if (window.FB) {
      FB.ui(
        {
          method: "share",
          href: currentUrl,
          hashtag: "#SnSGames",
          quote: shareMessage,
          display: "popup",
        },
        function (response) {},
      );
    } else {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareMessage)}`;
      window.open(facebookUrl, "facebook-share", "width=600,height=400");
    }
  }, [event]);

  const handleTwitterShare = useCallback(() => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareMessage = generateShareMessage(event);
    const twitterText = `${shareMessage} 🏆`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(twitterText)}`;
    window.open(twitterShareUrl, "twitter-share", "width=600,height=400");
  }, [event]);

  const handleWhatsappShare = useCallback(() => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareMessage = generateShareMessage(event);
    const whatsappMessage = `${shareMessage} Check it out: ${currentUrl}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappShareUrl, "whatsapp-share");
  }, [event]);

  const handleCopyLink = useCallback((onSuccess) => {
    navigator.clipboard.writeText(window.location.href);
    onSuccess?.("success", "Link copied to clipboard!");
  }, []);

  return {
    handleShare,
    handleFacebookShare,
    handleTwitterShare,
    handleWhatsappShare,
    handleCopyLink,
  };
};
