import { useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { API } from "@/lib/api";

export const useEventRegistration = (event) => {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const showNotificationMessage = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      4000,
    );
  };

  const getPrice = () => {
    if (!event) return 0;
    switch (event.eventType) {
      case "Tournament":
        return 499;
      case "Scrims":
        return 199;
      case "Brand Deal":
        // This would need formData context to properly determine
        return 499;
      default:
        return 0;
    }
  };

  const handleRegistrationSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Client-side validation
      if (!formData.fullName || formData.fullName.trim() === "") {
        showNotificationMessage("error", "Full name is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.email || formData.email.trim() === "") {
        showNotificationMessage("error", "Email is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.phone || formData.phone.trim() === "") {
        showNotificationMessage("error", "Phone number is required");
        setIsSubmitting(false);
        return;
      }

      // Scrims registration (team-based, new API)
      if (event?.eventType === "Scrims") {
        if (!formData.selectedSlotId) {
          showNotificationMessage("error", "Please select a slot");
          setIsSubmitting(false);
          return;
        }

        const isSoloMode =
          (event?.game_mode || event?.teamType || "").toLowerCase() === "solo";

        if (!isSoloMode) {
          if (!formData.teamName || formData.teamName.trim() === "") {
            showNotificationMessage("error", "Team name is required");
            setIsSubmitting(false);
            return;
          }
        }

        if (!formData.inGameName || !formData.inGameId) {
          showNotificationMessage(
            "error",
            isSoloMode
              ? "In-game name and ID are required"
              : "Captain in-game name and ID are required",
          );
          setIsSubmitting(false);
          return;
        }

        // Validate each additional player
        for (let i = 0; i < formData.players.length; i++) {
          const p = formData.players[i];
          if (
            !p.full_name?.trim() ||
            !p.email?.trim() ||
            !p.in_game_name?.trim() ||
            !p.in_game_id?.trim()
          ) {
            showNotificationMessage(
              "error",
              `Please complete details for Player ${i + 2}`,
            );
            setIsSubmitting(false);
            return;
          }
        }

        const scrimPayload = {
          team_name: isSoloMode
            ? formData.inGameName.trim() || formData.fullName.trim()
            : formData.teamName.trim(),
          game_mode: event?.game_mode || event?.teamType || null,
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          in_game_name: formData.inGameName.trim(),
          in_game_id: formData.inGameId.trim(),
          discord_id: formData.discordId.trim() || null,
          players: isSoloMode
            ? []
            : formData.players.map((p) => ({
                full_name: p.full_name.trim(),
                email: p.email.trim(),
                phone: p.phone?.trim() || null,
                in_game_name: p.in_game_name.trim(),
                uid: p.in_game_id.trim(),
                discord_id: p.discord_id?.trim() || null,
              })),
        };

        const scrimRes = await fetch(
          API.SCRIMS_REGISTER.replace(":scrimId", params.eventId).replace(
            ":slotId",
            formData.selectedSlotId,
          ),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scrimPayload),
          },
        );

        const scrimData = await scrimRes.json();

        if (!scrimRes.ok) {
          showNotificationMessage(
            "error",
            scrimData.message ||
              scrimData.error ||
              "Registration failed. Please try again.",
          );
          setIsSubmitting(false);
          return;
        }

        setShowSuccessModal(true);
        setIsSubmitting(false);
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
        return;
      }

      // Tournament/Brand Deal registration
      const gameName = event?.game?.name || event?.gameName || "EA FC 26";
      const address = event?.address || "Online";

      const payload = {
        event_id: parseInt(params.eventId),
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        game_name: gameName,
        address: address,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/participants/tournaments/${params.eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showNotificationMessage(
          "error",
          data.message || data.error || "Registration failed. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      setShowSuccessModal(true);
      setIsSubmitting(false);
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      showNotificationMessage(
        "error",
        "Network error. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    notification,
    showSuccessModal,
    setShowSuccessModal,
    showNotificationMessage,
    handleRegistrationSubmit,
    getPrice,
  };
};
