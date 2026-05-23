"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Share2,
  Loader2,
  ArrowLeft,
  Trophy,
  Gamepad2,
  DollarSign,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import CombinedSignupJoinForm from "../../components/AuthModals/CombinedSignupJoinForm";
import { useAuth } from "@/hooks/useAuth";

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;
  
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://inception-games.an.r.appspot.com/api/v1/tournaments/${eventId}`
      );

      if (!response.ok) {
        console.error("Failed to fetch event details");
        return;
      }

      const data = await response.json();
      const eventData = data.data || data;
      setEvent(eventData);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trophy size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
            <p className="text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push("/events")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-semibold transition-all"
            >
              <ArrowLeft size={18} />
              Back to Events
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const eventImage =
    event.image ||
    event.game?.image ||
    "https://images.unsplash.com/photo-1538481143235-c8f91f34e613?w=1000&h=600&fit=crop";

  const gameName = event.game?.name || event.game_name || "Gaming Event";
  const participantCount = event.participants_count || event.participantCount || 0;
  const status = event.status || "Upcoming";

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-white font-bold line-clamp-1 flex-1 text-center px-4">
            {event.title}
          </h1>
          <button
            onClick={() => {
              navigator.share?.({
                title: event.title,
                text: `Check out ${event.title} on Inception Games!`,
                url: window.location.href,
              });
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-96 md:h-[500px] pt-24">
        <Image
          src={eventImage}
          alt={event.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1538481143235-c8f91f34e613?w=1000&h=600&fit=crop";
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black" />

        {/* Status Badge */}
        <div className="absolute top-24 right-6 px-4 py-2 rounded-full bg-purple-600/80 backdrop-blur-md border border-purple-400/50 font-semibold">
          {status}
        </div>

        {/* Game Logo */}
        {event.game?.image && (
          <div className="absolute bottom-6 left-6 w-16 h-16 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center">
            <Image
              src={event.game.image}
              alt={gameName}
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title & Basic Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-400 text-lg flex items-center gap-2 mb-6">
                <Gamepad2 size={20} />
                {gameName}
              </p>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Date */}
                {event.date && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Calendar size={16} />
                      Date
                    </div>
                    <p className="text-white font-semibold text-sm">{formatDate(event.date)}</p>
                  </div>
                )}

                {/* Participants */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Users size={16} />
                    Participants
                  </div>
                  <p className="text-white font-semibold text-sm">{participantCount}</p>
                </div>

                {/* Type */}
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Trophy size={16} />
                    Type
                  </div>
                  <p className="text-white font-semibold text-sm capitalize">{event.eventType}</p>
                </div>

                {/* Organizer */}
                {event.organizer && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Target size={16} />
                      Organizer
                    </div>
                    <p className="text-white font-semibold text-sm">{event.organizer}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {event.prize_pool && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <DollarSign size={20} className="text-purple-400" />
                      Prize Pool
                    </h3>
                    <p className="text-2xl font-bold text-purple-400">${event.prize_pool}</p>
                  </div>
                )}

                {event.entry_fee && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Target size={20} className="text-purple-400" />
                      Entry Fee
                    </h3>
                    <p className="text-2xl font-bold text-purple-400">${event.entry_fee}</p>
                  </div>
                )}
              </div>

              {/* Rules Section */}
              {event.rules && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Rules & Requirements</h2>
                  <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                    <ul className="space-y-2 text-gray-300">
                      {typeof event.rules === "string"
                        ? event.rules.split("\n").map((rule, idx) => (
                            rule.trim() && <li key={idx}>• {rule.trim()}</li>
                          ))
                        : event.rules}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 space-y-6">
              {/* Join Button */}
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
              >
                {isAuthenticated ? "Join Event" : "Sign Up & Join"}
              </button>

              {/* Event Info Card */}
              <div className="bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4">Event Info</h3>

                {event.location && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Location
                    </p>
                    <p className="text-white font-semibold">{event.location}</p>
                  </div>
                )}

                {event.start_time && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Start Time
                    </p>
                    <p className="text-white font-semibold">{event.start_time}</p>
                  </div>
                )}

                {event.platform && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Platform</p>
                    <p className="text-white font-semibold">{event.platform}</p>
                  </div>
                )}
              </div>

              {/* Share Card */}
              <button
                onClick={() => {
                  navigator.share?.({
                    title: event.title,
                    text: `Check out ${event.title} on Inception Games!`,
                    url: window.location.href,
                  });
                }}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Share2 size={18} />
                Share Event
              </button>

              {/* Back Button */}
              <button
                onClick={() => router.push("/events")}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 font-semibold transition-all"
              >
                ← Back to Events
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Join Event Form Modal */}
      <CombinedSignupJoinForm
        event={event}
        isOpen={showJoinForm}
        onClose={() => setShowJoinForm(false)}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
