import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { getGameImage } from "@/app/utils/gameData";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useEventData = (eventId) => {
  // Initialize state with potential cached value
  const [event, setEvent] = useState(() => {
    if (typeof window !== "undefined" && eventId) {
      const cachedEvent = sessionStorage.getItem(`event_${eventId}`);
      console.log("cachedEvent", cachedEvent);
      if (cachedEvent) {
        try {
          return JSON.parse(cachedEvent);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined" && eventId) {
      const cachedEvent = sessionStorage.getItem(`event_${eventId}`);
      return !cachedEvent;
    }
    return true;
  });

  const [error, setError] = useState(null);

  const transformScrim = (matchedScrim) => {
    const bannerImage = matchedScrim.banner_image;
    return {
      ...matchedScrim,
      eventType: "Scrims",
      game: {
        name: matchedScrim.game || "Gaming Event",
        image: getGameImage(matchedScrim.title, matchedScrim.game),
      },
      gameName: matchedScrim.game || "Gaming Event",
      gameImage: getGameImage(matchedScrim.title, matchedScrim.game),
      date: matchedScrim.start_at,
      endDate: matchedScrim.end_at,
      location: matchedScrim.region,
      platform: matchedScrim.platform || "All Platforms",
      teamType: matchedScrim.game_mode || "Open",
      team_size: matchedScrim.team_size || 1,
      teamSize: matchedScrim.team_size || 1,
      prizePool: parseFloat(matchedScrim.prize_pool) || 0,
      currency: matchedScrim.currency || "BDT",
      totalSlots: matchedScrim.max_teams || 0,
      filledSlots: matchedScrim.filled_teams || 0,
      registrationStart: matchedScrim.reg_start_at,
      registrationEnd: matchedScrim.reg_end_at,
      tournamentStart: matchedScrim.start_at,
      tournamentEnd: matchedScrim.end_at,
      host: matchedScrim.hosted_by || "Inception Games",
      organizer: matchedScrim.hosted_by || "Inception Games",
      slots: matchedScrim.slots || [],
      banner_image: bannerImage,
      absoluteBannerUrl: bannerImage,
    };
  };

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const cacheKey = "scrims_cache";
        const cacheTimestampKey = "scrims_cache_timestamp";
        const eventCacheKey = `event_${eventId}`;

        // Check if we have this specific event cached (from navigation)
        const cachedEvent = sessionStorage.getItem(eventCacheKey);
        if (cachedEvent) {
          try {
            const parsedEvent = JSON.parse(cachedEvent);
            setEvent(parsedEvent);
            setLoading(false);
            return;
          } catch (e) {
            // Invalid cache, continue to fetch
          }
        }

        setLoading(true);

        let allScrims = null;
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheTimestamp = sessionStorage.getItem(cacheTimestampKey);
        const now = Date.now();

        // Use cache if it exists and is still fresh
        if (
          cachedData &&
          cacheTimestamp &&
          now - parseInt(cacheTimestamp) < CACHE_DURATION
        ) {
          allScrims = JSON.parse(cachedData);
        } else {
          // Fetch fresh data from API
          const scrimsRes = await fetch(
            "https://inception-games.an.r.appspot.com/api/v1/scrims",
          );
          if (scrimsRes.ok) {
            const scrimsJson = await scrimsRes.json();
            allScrims = scrimsJson.scrims || scrimsJson.data || [];
            // Cache the scrims data
            sessionStorage.setItem(cacheKey, JSON.stringify(allScrims));
            sessionStorage.setItem(cacheTimestampKey, now.toString());
          }
        }

        // Search for matching scrim in cached/fetched data
        if (allScrims && allScrims.length > 0) {
          const matchedScrim = allScrims.find(
            (s) => s.id === eventId || s.id === parseInt(eventId),
          );
          if (matchedScrim) {
            const transformedEvent = transformScrim(matchedScrim);
            setEvent(transformedEvent);
            // Cache this specific event for instant load on back-navigation
            sessionStorage.setItem(
              eventCacheKey,
              JSON.stringify(transformedEvent),
            );
            setLoading(false);
            return;
          }
        }

        // Try alternative API endpoint for tournaments/brand deals
        const url = API.EVENTS_GET_BY_ID.replace(":eventId", eventId);
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data) {
          let eventData =
            data.tournament || (data.success && data.data ? data.data : data);

          let bannerImage = eventData.banner_image;
          let absoluteBannerUrl = bannerImage;

          if (bannerImage) {
            if (bannerImage.startsWith("http")) {
              absoluteBannerUrl = bannerImage;
            } else {
              const apiBase = "https://inception-games.an.r.appspot.com/api/v1";
              absoluteBannerUrl = bannerImage.startsWith("/")
                ? `${apiBase}${bannerImage}`
                : `${apiBase}/${bannerImage}`;
            }
          }

          const transformedEvent = {
            ...eventData,
            id: eventData.id,
            title: eventData.title,
            game: {
              name: eventData.game || "Gaming Event",
              image: getGameImage(eventData.title, eventData.game),
            },
            gameName: eventData.game || "Gaming Event",
            gameImage: getGameImage(eventData.title, eventData.game),
            date: eventData.event_date || eventData.date,
            endDate: eventData.tournament_end_at || eventData.endDate,
            location: eventData.region || eventData.location,
            platform: eventData.platform || "All Platforms",
            teamType: eventData.game_mode || "Open",
            prizePool: parseFloat(eventData.prize_pool) || 0,
            currency: eventData.currency || "BDT",
            totalSlots: eventData.max_slots || 64,
            filledSlots: eventData.filled_slots || 0,
            registrationStart: eventData.reg_start_at,
            registration_start: eventData.reg_start_at,
            registrationEnd: eventData.reg_end_at,
            registration_end: eventData.reg_end_at,
            tournamentStart: eventData.tournament_start_at,
            tournamentEnd: eventData.tournament_end_at,
            host: eventData.hosted_by || "Inception Games",
            organizer: eventData.hosted_by || "Inception Games",
            banner_image: eventData.banner_image,
            absoluteBannerUrl: absoluteBannerUrl,
          };

          setEvent(transformedEvent);
          setLoading(false);
        } else {
          setError("Failed to load event");
          setLoading(false);
        }
      } catch (error) {
        setError("Network error. Please try again.");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
};
