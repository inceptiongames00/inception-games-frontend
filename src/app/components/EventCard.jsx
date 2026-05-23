"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Clock, MapPin, Gamepad2 } from "lucide-react";
import Image from "next/image";

export default function EventCard({ event, onClick }) {
  const eventImage =
    event.image ||
    event.game?.image ||
    "https://images.unsplash.com/photo-1538481143235-c8f91f34e613?w=500&h=300&fit=crop";

  const gameName = event.game?.name || event.game_name || "Gaming Event";
  const eventType = event.eventType || event.type || "Tournament";
  const participantCount = event.participants_count || event.participantCount || 0;
  const status = event.status || "Upcoming";

  const statusColors = {
    upcoming: "bg-blue-500/20 text-blue-300",
    live: "bg-green-500/20 text-green-300",
    ended: "bg-gray-500/20 text-gray-300",
    "registration closed": "bg-red-500/20 text-red-300",
  };

  const statusColor = statusColors[status.toLowerCase()] || statusColors.upcoming;

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer h-full"
      onClick={() => onClick?.(event)}
    >
      <div className="relative bg-gradient-to-b from-gray-900/40 to-gray-950/60 rounded-xl border border-white/10 overflow-hidden h-full flex flex-col backdrop-blur-md hover:border-purple-500/30 transition-colors">
        {/* Image */}
        <div className="relative w-full h-40 overflow-hidden bg-gray-900">
          <Image
            src={eventImage}
            alt={event.title}
            width={400}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1538481143235-c8f91f34e613?w=500&h=300&fit=crop";
            }}
          />
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColor} backdrop-blur-sm`}>
            {status}
          </div>
          {/* Game Logo */}
          {event.game?.image && (
            <div className="absolute bottom-2 left-2 w-10 h-10 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 p-1 flex items-center justify-center">
              <Image
                src={event.game.image}
                alt={gameName}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>

          {/* Game Name */}
          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
            <Gamepad2 size={12} />
            {gameName}
          </p>

          {/* Divider */}
          <div className="my-3 h-px bg-gradient-to-r from-white/10 to-transparent" />

          {/* Details */}
          <div className="space-y-2 text-xs text-gray-300 flex-1">
            {/* Date */}
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-purple-400 flex-shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
            )}

            {/* Participants */}
            <div className="flex items-center gap-2">
              <Users size={14} className="text-purple-400 flex-shrink-0" />
              <span>{participantCount} participants</span>
            </div>

            {/* Event Type */}
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-purple-400 flex-shrink-0" />
              <span className="capitalize">{eventType}</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="mt-4 w-full py-2 px-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg text-purple-300 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20">
            View Event
          </button>
        </div>
      </div>
    </motion.div>
  );
}
