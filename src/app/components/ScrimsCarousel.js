"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ScrimsCarousel({ onLoginClick }) {
  const { user } = useAuth();
  const router = useRouter();
  const { navigateToTab } = useProfileNavigation();
  const [isHydrated, setIsHydrated] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Handle different response formats
        let tournamentsArray = [];
        if (Array.isArray(data)) {
          tournamentsArray = data;
        } else if (data && Array.isArray(data.data)) {
          tournamentsArray = data.data;
        } else if (data && Array.isArray(data.tournaments)) {
          tournamentsArray = data.tournaments;
        } else if (data && typeof data === "object") {
          // Single tournament object - wrap in array
          tournamentsArray = [data];
        }

        localStorage.setItem("free-event", JSON.stringify(tournamentsArray));
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

  const handleCardClick = (id) => {
    router.push(`esports-arena/${id}?action=view`);
    // if (isHydrated && user) {
    //   navigateToTab("Free Event");
    // } else {
    //   onLoginClick();
    // }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* Scrolling container */}
      <div className="flex animate-scrims-scroll">
        {/* First set */}
        {tournaments.map((tournament, index) => (
          <GameCard
            key={`tournament-1-${index}`}
            tournament={tournament}
            onClick={handleCardClick}
            isHydrated={isHydrated}
            user={user}
          />
        ))}

        {/* Duplicate set for seamless loop */}
        {tournaments.map((tournament, index) => (
          <GameCard
            key={`tournament-2-${index}`}
            tournament={tournament}
            onClick={handleCardClick}
            isHydrated={isHydrated}
            user={user}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes scrims-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scrims-scroll {
          animation: scrims-scroll 40s linear infinite;
        }

        .animate-scrims-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function GameCard({ tournament, onClick, isHydrated, user }) {
  // Determine the game image and label from tournament
  const getGameImage = () => {
    if (tournament.banner_image) return tournament.banner_image;
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=600&fit=crop";
  };

  // const getGameLabel = () => {
  //   if (tournament.entry_type === "Free" || tournament.entry_fee === "0.00") {
  //     return "FREE ENTRY";
  //   }
  //   return `${tournament.entry_fee} ENTRY`;
  // };

  const getStartDate = () => {
    if (tournament.start_at) {
      const date = new Date(tournament.start_at);
      return date
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
      className="px-2 sm:px-3 md:px-4"
      style={{ width: "270px", height: "320px", flexShrink: 0 }}
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

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg" />

              {/* CTA Button */}
              <button
                onClick={() => onClick(tournament.id)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full text-white font-semibold text-sm transition-all duration-300 cursor-pointer">
                  {/* {isHydrated && user ? "Go To Tournament" : "Sign In"} */}
                  Go To Details
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
