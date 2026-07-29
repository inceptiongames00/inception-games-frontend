"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  CreditCard,
  Gamepad2,
  Ticket,
  X,
  Swords,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getGameImage } from "@/app/utils/gameData";

// Transform registration data to event format for page details
const transformRegistrationToEvent = (registration, type) => {
  return {
    id: registration.tournament_id || registration.scrim_id,
    title: registration.title,
    game: registration.game,
    game_name: registration.game,
    gameName: registration.game,
    gameImage: getGameImage(registration.title, registration.game),
    banner_image: registration.banner_image,
    status: registration.status,
    platform: registration.platform || "All Platforms",
    location: registration.region || "Global",
    teamType: registration.team_mode || registration.game_mode || "Team",
    team_size: registration.team_size || 1,
    teamSize: registration.team_size || 1,
    team_name: registration.team_name,
    event_category: registration.event_category,
    eventType: type === "scrims" ? "Scrims" : "Tournaments",
    description: registration.description,
    rules: registration.rules,
    prizePool: parseFloat(registration.prize_pool) || 0,
    prize_pool: parseFloat(registration.prize_pool) || 0,
    currency: registration.currency || "BDT",
    totalSlots: registration.max_slots || registration.max_teams || 64,
    filledSlots: registration.filled_slots || registration.filled_teams || 0,
    registration_start: registration.reg_start_at,
    registration_end: registration.reg_end_at,
    registrationStart: registration.reg_start_at,
    registrationEnd: registration.reg_end_at,
    tournamentStart: registration.tournament_start_at || registration.start_at,
    tournamentEnd: registration.tournament_end_at || registration.end_at,
    host: registration.hosted_by || "Inception Games",
    organizer: registration.hosted_by || "Inception Games",
    slots: registration.slots || [],
    format: registration.format,
  };
};

const statusStyles = {
  Confirmed: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  Pending: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  Rejected: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

const paymentStyles = {
  Paid: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
  Unpaid: { text: "text-red-400", bg: "bg-red-500/10" },
  Pending: { text: "text-amber-400", bg: "bg-amber-500/10" },
};

function formatDate(value) {
  if (!value) return "TBD";
  try {
    const date = new Date(value);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName} ${day} ${month} ${year}`;
  } catch {
    return value;
  }
}

function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":");
  if (h === undefined) return value;
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = ((hour + 11) % 12) + 1;
  return `${display}:${m ?? "00"} ${ampm}`;
}

function RegistrationCard({
  registration,
  type,
  index,
  onViewDetails,
  handleNavigation,
}) {
  const payStyle =
    paymentStyles[registration.payment_status] || paymentStyles.Pending;
  const statusStyle = statusStyles[registration.status] || statusStyles.Pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-gray-900/40 to-[#0c0c12] overflow-hidden group cursor-pointer hover:border-white/[0.12] transition h-full flex flex-col"
      onClick={() => onViewDetails(registration, type)}
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/30">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/50 to-transparent" />

        {/* Top row: game + status */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-black/50 backdrop-blur-sm border border-white/10">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            {registration.game || "Game"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.text} ${statusStyle.bg} ${statusStyle.border}`}
          >
            {registration.status}
          </span>
        </div>

        {/* Title */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <h3 className="text-base font-semibold text-white line-clamp-2 mb-2">
            {registration.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              {registration.team_name}
            </div>
            <span className="text-xs text-gray-400 inline-flex items-center gap-1">
              <Ticket className="w-3 h-3" />
              {registration.payment_reference || "—"}
            </span>

            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-center ${payStyle.text} ${payStyle.bg}`}
            >
              {registration.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {type === "scrims" && (
        // {/* Date & Time - Only for Scrims, displayed side by side */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex gap-2">
            {registration.slot_date && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300 flex-1">
                <Calendar className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="truncate">
                  {formatDate(registration.slot_date)}
                </span>
              </div>
            )}
            {registration.slot_time && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300 flex-1">
                <Clock className="w-3 h-3 text-pink-400 flex-shrink-0" />
                <span className="truncate">
                  {formatTime(registration.slot_time)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          const eventData = transformRegistrationToEvent(registration, type);
          handleNavigation(registration.tournament_id || registration.scrim_id, eventData);
        }}
        className="w-full py-2 font-bold text-sm rounded-xl uppercase tracking-wider bg-gradient-to-r from-green-600 to-green-500 text-white opacity-90 cursor-pointer"
      >
        View Details
      </button>
    </motion.div>
  );
}

export default function MyScrims({ userRegistrations }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tournaments");
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const handleNavigation = (id, eventData = null) => {
    if (eventData) {
      // Pass event data via sessionStorage using the same key as EventsSection
      sessionStorage.setItem(`event_${id}`, JSON.stringify(eventData));
    }
    router.push(`/profile/events/${id}?action=view`);
  };

  // Get unique registrations - remove duplicates by scrim_id and tournament_id
  const scrimRegistrations = userRegistrations?.scrim_registrations
    ? Array.from(
        new Map(
          userRegistrations.scrim_registrations.map((item) => [
            item.scrim_id,
            item,
          ]),
        ).values(),
      )
    : [];

  const tournamentRegistrations = userRegistrations?.tournament_registrations
    ? Array.from(
        new Map(
          userRegistrations.tournament_registrations.map((item) => [
            item.tournament_id,
            item,
          ]),
        ).values(),
      )
    : [];

  const displayRegistrations =
    activeTab === "scrims" ? scrimRegistrations : tournamentRegistrations;
  const isEmpty = displayRegistrations.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/30 via-transparent to-transparent" />

      <div className="p-3 xs:p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 xs:mb-5">
          <div className="flex items-center gap-2 xs:gap-3 min-w-0">
            <div className="w-9 xs:w-10 h-9 xs:h-10 rounded-lg xs:rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              {activeTab === "scrims" ? (
                <Swords className="w-4 xs:w-5 h-4 xs:h-5 text-purple-400" />
              ) : (
                <Trophy className="w-4 xs:w-5 h-4 xs:h-5 text-purple-400" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base xs:text-lg font-semibold text-white truncate">
                {activeTab === "scrims" ? "My Scrims" : "My Tournaments"}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {displayRegistrations.length > 0
                  ? `${displayRegistrations.length} registration${
                      displayRegistrations.length > 1 ? "s" : ""
                    }`
                  : `No ${activeTab} registered`}
              </p>
            </div>
          </div>

          {/* Tournament Quota Button - Responsive Design */}
          {userRegistrations?.event_quota_status && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 xs:px-4 xs:py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 hover:bg-purple-900/50 transition-all duration-300 text-xs xs:text-sm whitespace-nowrap">
                <span className="text-zinc-400">Mini Tournament:</span>
                <span className="font-bold text-purple-400">
                  {
                    userRegistrations.event_quota_status.mini_tournaments
                      .remaining
                  }
                </span>
              </button>

              <button className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 xs:px-4 xs:py-2 rounded-lg bg-pink-900/30 border border-pink-500/30 hover:bg-pink-900/50 transition-all duration-300 text-xs xs:text-sm whitespace-nowrap">
                <span className="text-zinc-400">Large Tournament:</span>
                <span className="font-bold text-pink-400">
                  {
                    userRegistrations.event_quota_status.large_tournaments
                      .remaining
                  }
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          {/* <button
            onClick={() => setActiveTab("scrims")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "scrims"
                ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                : "bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Swords className="w-4 h-4" />
            <span className="text-sm">My Scrims</span>
            <span className="text-xs bg-black/30 px-2 py-0.5 rounded">
              {scrimRegistrations.length}
            </span>
          </button> */}
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "tournaments"
                ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                : "bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm">My Tournaments</span>
          </button>
        </div>

        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Ticket className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-base font-medium text-white mb-1">
              {activeTab === "scrims" ? "No scrims yet" : "No tournaments yet"}
            </p>
            <p className="text-sm text-gray-500">
              {activeTab === "scrims"
                ? "Join scrims to see them here"
                : "Register for tournaments to see them here"}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!isEmpty && (
          <>
            {/* Mobile & Tablet: Horizontal scroll */}
            <div
              className="lg:hidden overflow-x-auto pb-2 -mx-3 xs:-mx-4 sm:-mx-5 px-3 xs:px-4 sm:px-5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(147, 51, 234, 0.3) transparent",
              }}
            >
              <div className="flex gap-3 xs:gap-4 flex-nowrap">
                {displayRegistrations.map((reg, i) => (
                  <div
                    key={reg.id}
                    className="flex-shrink-0 w-80 sm:w-96 h-auto"
                  >
                    <RegistrationCard
                      registration={reg}
                      type={activeTab}
                      index={i}
                      handleNavigation={handleNavigation}
                      onViewDetails={setSelectedRegistration}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4">
              {displayRegistrations.map((reg, i) => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  type={activeTab}
                  index={i}
                  handleNavigation={handleNavigation}
                  onViewDetails={setSelectedRegistration}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      <RegistrationDetailsModal
        registration={selectedRegistration?.registration}
        type={selectedRegistration?.type}
        onClose={() => setSelectedRegistration(null)}
      />
    </motion.section>
  );
}

function RegistrationDetailsModal({ registration, type, onClose }) {
  if (!registration) return null;

  const payStyle =
    paymentStyles[registration.payment_status] || paymentStyles.Pending;
  const statusStyle = statusStyles[registration.status] || statusStyles.Pending;
  const isScrims = type === "scrims";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-2xl max-w-lg w-full shadow-2xl shadow-black/50 overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/30">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

            <div className="absolute bottom-4 left-4 right-12">
              <h4 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                {registration.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-black/50 backdrop-blur-sm border border-white/10">
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                  {registration.game}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.text} ${statusStyle.bg} ${statusStyle.border}`}
                >
                  {registration.status}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 border border-white/[0.1] text-gray-400 hover:text-white transition backdrop-blur-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Date & Time - Scrims only */}
            {isScrims && (
              <div className="space-y-2">
                {registration.slot_date && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    {formatDate(registration.slot_date)}
                  </div>
                )}
                {registration.slot_time && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-gray-300 ml-3">
                    <Clock className="w-4 h-4 text-pink-400" />
                    {formatTime(registration.slot_time)}
                  </div>
                )}
              </div>
            )}

            {/* Team & Reference */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-purple-500/[0.08] to-transparent border border-purple-500/10">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                  Team
                </p>
                <p className="text-sm font-semibold text-white truncate">
                  {registration.team_name || "—"}
                </p>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-pink-500/[0.08] to-transparent border border-pink-500/10">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                  Reference
                </p>
                <p className="text-sm font-semibold text-white truncate">
                  {registration.payment_reference || "—"}
                </p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="inline-flex items-center gap-2 text-xs text-gray-400">
                <CreditCard className="w-4 h-4" />
                Entry Fee
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {Number(registration.entry_fee) > 0
                    ? `${registration.currency || "BDT"} ${registration.entry_fee}`
                    : "Free"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${payStyle.text} ${payStyle.bg}`}
                >
                  {registration.payment_status}
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-gray-400 mb-1">Category</p>
              <p className="text-sm font-semibold text-white">
                {registration.event_category}
              </p>
            </div>

            {/* Registration Date */}
            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-gray-400 mb-1">Registered</p>
              <p className="text-sm font-semibold text-white">
                {formatDate(registration.registered_at)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.08]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.08] transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
