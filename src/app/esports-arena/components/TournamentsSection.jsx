"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";

export default function TournamentsSection({ onLoginClick }) {
  const { user } = useAuth();
  const { navigateToTab } = useProfileNavigation();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://inception-games.an.r.appspot.com/api/v1/cms/tournaments/all"
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
          tournamentsArray = [data];
        }

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

  const handleCardClick = () => {
    if (isHydrated && user) {
      navigateToTab("Tournament");
    } else {
      onLoginClick?.();
    }
  };

  if (!isHydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-purple-500 animate-spin" />
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 text-lg">No tournaments available at this time.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* Scrolling container */}
      <div className="flex animate-tournaments-scroll">
        {/* First set */}
        {tournaments.map((tournament, index) => (
          <TournamentCard
            key={`tournament-1-${index}`}
            tournament={tournament}
            onClick={handleCardClick}
            isHydrated={isHydrated}
            user={user}
          />
        ))}

        {/* Duplicate set for seamless loop */}
        {tournaments.map((tournament, index) => (
          <TournamentCard
            key={`tournament-2-${index}`}
            tournament={tournament}
            onClick={handleCardClick}
            isHydrated={isHydrated}
            user={user}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes tournaments-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-tournaments-scroll {
          animation: tournaments-scroll 60s linear infinite;
        }

        .animate-tournaments-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function TournamentCard({ tournament, onClick, isHydrated, user }) {
  return (
    <div className="px-2 sm:px-3 md:px-4" style={{ width: "300px", flexShrink: 0 }}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_35px_rgba(168,85,247,.2)] backdrop-blur-sm h-full relative"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
          <Image
            src={
              tournament.banner_image ||
              "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=600&fit=crop"
            }
            alt={tournament.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg" />

          {/* CTA Button */}
          <button
            onClick={onClick}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full text-white font-semibold text-sm transition-all duration-300">
              {isHydrated && user ? "Go To Tournament" : "Sign In"}
            </span>
          </button>

          {tournament.status && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-purple-600">
              {tournament.status}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {tournament.title}
          </h3>

          <div className="space-y-2 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-400">Game:</span> {tournament.game}
            </p>
            <p>
              <span className="text-zinc-400">Prize Pool:</span> {tournament.prize_pool} {tournament.currency}
            </p>
            <p>
              <span className="text-zinc-400">Team Size:</span> {tournament.team_size}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
