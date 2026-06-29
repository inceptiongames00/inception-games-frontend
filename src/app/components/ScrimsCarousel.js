"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";
import { useState, useEffect } from "react";

const GAMES_DATA = [
  {
    title: "Free Fire",
    label: "FREE ENTRY",
    date: "30TH JUNE",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=600&fit=crop",
    bgGradient: "from-pink-600 to-pink-500",
  },
  {
    title: "PUBG Mobile",
    label: "FREE ENTRY",
    date: "30TH JUNE",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&h=600&fit=crop",
    bgGradient: "from-purple-600 to-purple-500",
  },
  {
    title: "eFootball 2025",
    label: "FREE ENTRY",
    date: "30TH JUNE",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=500&h=600&fit=crop",
    bgGradient: "from-yellow-600 to-yellow-500",
  },
  {
    title: "FC 25",
    label: "FREE ENTRY",
    date: "30TH JUNE",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&h=600&fit=crop",
    bgGradient: "from-blue-600 to-blue-500",
  },
];

export default function ScrimsCarousel({ onLoginClick }) {
  const { user } = useAuth();
  const { navigateToTab } = useProfileNavigation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCardClick = () => {
    if (isHydrated && user) {
      navigateToTab("Scrims");
    } else {
      onLoginClick();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* Scrolling container */}
      <div className="flex animate-scrims-scroll">
        {/* First set */}
        {GAMES_DATA.map((game, index) => (
          <GameCard
            key={`game-1-${index}`}
            game={game}
            onClick={handleCardClick}
            isHydrated={isHydrated}
            user={user}
          />
        ))}

        {/* Duplicate set for seamless loop */}
        {GAMES_DATA.map((game, index) => (
          <GameCard
            key={`game-2-${index}`}
            game={game}
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

function GameCard({ game, onClick, isHydrated, user }) {
  return (
    <div
      className="px-2 sm:px-3 md:px-4"
      style={{ width: "270px", height: "320px", flexShrink: 0 }}
    >
      <div className="group cursor-pointer h-full">
        <div
          className="relative transition-all duration-300 hover:scale-105 h-full"
          style={{
            backgroundImage: 'url(/assets/frame.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '12px',
            boxShadow: "0 0 30px rgba(255, 0, 255, 0.2)",
          }}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden rounded-lg">
            {/* Image Section */}
            <div className="relative flex-1 overflow-hidden">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
              <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg" />

              {/* CTA Button */}
              <button
                onClick={onClick}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full text-white font-semibold text-sm transition-all duration-300">
                  {isHydrated && user ? "Go To Scrim" : "Sign In"}
                </span>
              </button>
            </div>

            {/* Info Section */}
            <div className="relative bg-gradient-to-r px-3 py-3.5 text-center flex flex-col items-center">
              <h3
                className="text-xs font-bold mb-1 uppercase tracking-wider line-clamp-1 group-hover:text-white transition-colors duration-300"
                style={{ color: '#FFFA5B' }}
              >
                {game.label}
              </h3>
              <p className="text-[9px] font-bold text-yellow-300 mb-1 uppercase group-hover:text-yellow-100 transition-colors duration-300">
                <span style={{ color: '#FFFFFF' }}>STARTING</span> {game.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
