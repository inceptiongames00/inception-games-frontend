"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ScrimsCarousel({ onLoginClick }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drag/swipe refs — no state so no re-renders
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragOffsetAtStart = useRef(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://inception-games.an.r.appspot.com/api/v1/events/tournaments/free-events",
        );
        if (!response.ok) throw new Error("Failed to fetch tournaments");
        const data = await response.json();

        let tournamentsArray = [];
        if (Array.isArray(data)) {
          tournamentsArray = data;
        } else if (data && Array.isArray(data.data)) {
          tournamentsArray = data.data;
        } else if (data && Array.isArray(data.tournaments)) {
          tournamentsArray = data.tournaments;
        } else if (data && typeof data === "object") {
          tournamentsArray = [data];
        }

        sessionStorage.setItem("free-event", JSON.stringify(tournamentsArray));
        setTournaments(tournamentsArray);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [isHydrated]);

  // ── Drag / swipe helpers ──────────────────────────────────────────────────

  /** Read the live translateX being applied by the CSS animation. */
  const getCurrentOffset = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const matrix = window.getComputedStyle(el).transform;
    if (!matrix || matrix === "none") return 0;
    const match = matrix.match(/matrix.*\((.+)\)/);
    if (!match) return 0;
    return parseFloat(match[1].split(", ")[4]) || 0;
  };

  /** Pause animation and lock the track at its current pixel position. */
  const freezeAtCurrentOffset = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const offset = getCurrentOffset();
    el.style.animationPlayState = "paused";
    el.style.transform = `translateX(${offset}px)`;
    el.style.animation = "none"; // detach so manual transform takes over
    return offset;
  };

  /** Resume animation from the given pixel offset without a visible jump. */
  const resumeAnimation = useCallback(
    (offsetPx, stripWidth, duration) => {
      const el = trackRef.current;
      if (!el) return;
      // Clamp into one full strip loop
      const clamped = ((offsetPx % stripWidth) - stripWidth) % stripWidth; // negative offset
      const progress = Math.abs(clamped) / stripWidth; // 0..1
      const delay = -(progress * duration);
      el.style.transform = "";
      el.style.animation = `ticker ${duration}s linear ${delay}s infinite`;
      el.style.animationPlayState = "running";
    },
    []
  );

  const onDragStart = useCallback((clientX) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    dragOffsetAtStart.current = freezeAtCurrentOffset();
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
  }, []);

  const onDragMove = useCallback((clientX) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = clientX - dragStartX.current;
    trackRef.current.style.transform = `translateX(${dragOffsetAtStart.current + delta}px)`;
  }, []);

  const onDragEnd = useCallback(
    (clientX, stripWidth, duration) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (trackRef.current) trackRef.current.style.cursor = "grab";
      const delta = clientX - dragStartX.current;
      const finalOffset = dragOffsetAtStart.current + delta;
      resumeAnimation(finalOffset, stripWidth, duration);
    },
    [resumeAnimation]
  );

  // ── Card click ────────────────────────────────────────────────────────────

  const handleCardClick = () => {
    if (isHydrated && user) {
      router.push(`/profile?tab=Free Event`);
    } else {
      onLoginClick();
    }
  };

  if (!isHydrated || loading || tournaments.length === 0) return null;

  // Repeat enough times so the strip is always wider than the viewport
  const repeated = [
    ...tournaments,
    ...tournaments,
    ...tournaments,
    ...tournaments,
  ];
  // Total width of one full set (card width 270px + px-2 padding ~16px = ~286px)
  const cardWidth = 286;
  const stripWidth = tournaments.length * cardWidth;

  return (
    <>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${stripWidth}px); }
        }
        .scrims-track {
          animation: ticker ${tournaments.length * 5}s linear infinite;
          will-change: transform;
        }
        .scrims-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="relative overflow-hidden"
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX, stripWidth, tournaments.length * 5)}
        onMouseLeave={(e) => { if (isDragging.current) onDragEnd(e.clientX, stripWidth, tournaments.length * 5); }}
      >
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

        {/* Ticker track */}
        <div
          ref={trackRef}
          className="flex scrims-track cursor-grab select-none"
          onMouseDown={(e) => onDragStart(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX, stripWidth, tournaments.length * 5)}
          style={{ touchAction: "pan-y pinch-zoom" }}
        >
          {repeated.map((tournament, index) => (
            <GameCard
              key={index}
              tournament={tournament}
              onClick={handleCardClick}
              isHydrated={isHydrated}
              user={user}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function GameCard({ tournament, onClick, isHydrated, user }) {
  const getGameImage = () => {
    if (tournament.banner_image) return tournament.banner_image;
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=600&fit=crop";
  };

  const getStartDate = () => {
    if (tournament.start_at) {
      return new Date(tournament.start_at)
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase();
    }
    return "COMING SOON";
  };

  return (
    <div
      className="px-2 sm:px-3 md:px-4 flex-shrink-0"
      style={{ width: "270px", height: "320px" }}
    >
      <div className="group cursor-pointer h-full">
        <div
          className="relative transition-all duration-300 hover:scale-105 h-full"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/jvpygp4b/image/upload/v1783241169/frame_qqaibz.png)",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "12px",
            boxShadow: "0 0 30px rgba(255, 0, 255, 0.2)",
          }}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden rounded-lg">
            {/* Image Section */}
            <div className="relative flex-1 overflow-hidden bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getGameImage()}
                alt={tournament.title || "Tournament"}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
              <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg" />

              {/* CTA Button */}
              <button
                onClick={() => onClick(tournament.id)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full text-white font-semibold text-sm transition-all duration-300 cursor-pointer">
                  {isHydrated && user ? "Go To Tournament" : "Sign In"}
                </span>
              </button>
            </div>

            {/* Info Section */}
            <div className="relative bg-gradient-to-r px-3 py-3.5 text-center flex flex-col items-center">
              <h3
                className="text-xs font-bold mb-1 uppercase tracking-wider line-clamp-1 group-hover:text-white transition-colors duration-300"
                style={{ color: "#FFFA5B" }}
              >
                {tournament.game}
              </h3>
              <p className="text-[9px] font-bold text-yellow-300 uppercase group-hover:text-yellow-100 transition-colors duration-300">
                <span style={{ color: "#FFFFFF" }}>STARTING</span>{" "}
                {getStartDate()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
