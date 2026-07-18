"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function TournamentsSection() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tournaments.map((tournament, idx) => (
        <motion.div
          key={tournament.id || idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.6 }}
          whileHover={{ y: -4 }}
          className="group rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_35px_rgba(168,85,247,.2)] backdrop-blur-sm"
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
      ))}
    </div>
  );
}
