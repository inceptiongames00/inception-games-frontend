"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  Crown,
  Hash,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Gamepad2,
  ChevronDown,
  Ticket,
  RefreshCw,
  Mail,
  X,
} from "lucide-react";
import { API } from "@/lib/api";

const statusStyles = {
  Confirmed: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
  },
  Pending: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Clock,
  },
  Rejected: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertCircle,
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
    return new Date(value).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function formatTime(value) {
  if (!value) return "";
  // value like "18:00:00"
  const [h, m] = value.split(":");
  if (h === undefined) return value;
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = ((hour + 11) % 12) + 1;
  return `${display}:${m ?? "00"} ${ampm}`;
}

function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.Pending;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.text} ${style.bg} ${style.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status || "Pending"}
    </span>
  );
}

function ScrimCard({ registration, index, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);

  const players = registration.players || [];
  const leader = players.find((p) => p.is_team_leader) || players[0];
  const teammates = players.filter((p) => !p.is_team_leader);
  const payStyle =
    paymentStyles[registration.payment_status] || paymentStyles.Pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden group cursor-pointer hover:border-white/[0.12] transition"
      onClick={() => onViewDetails(registration)}
    >
      {/* Banner */}
      <div className="relative h-36 sm:h-46 overflow-hidden">
        {registration.scrim_banner_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={registration.scrim_banner_image || "/placeholder.svg"}
            alt={registration.scrim_title || "Scrim banner"}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-pink-900/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/50 to-transparent" />

        {/* Top row: game + status */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-black/50 backdrop-blur-sm border border-white/10">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            {registration.scrim_game || "Game"}
          </span>
          <StatusBadge status={registration.status} />
        </div>

        {/* Title */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-base sm:text-lg font-semibold text-white text-balance leading-snug line-clamp-2">
            {registration.scrim_title || "Scrim Registration"}
          </h3>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            {formatDate(registration.slot_date)}
          </div>
           <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            {formatTime(registration.slot_time)}
          </div>
             {registration.scrim_region && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              {registration.scrim_region}
            </div>
          )}
            {registration.scrim_platform && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-gray-300">
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              {registration.scrim_platform}
            </div>
          )}
        </div>
      </div>

  
    </motion.div>
  );
}

function PlayerRow({ player, isLeader }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isLeader ? "bg-purple-500/15" : "bg-white/[0.04]"
        }`}
      >
        {isLeader ? (
          <Crown className="w-4 h-4 text-purple-400" />
        ) : (
          <span className="text-sm font-semibold text-gray-300">
            {(player.full_name || "?").charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate flex items-center gap-1.5">
          {player.full_name || "Player"}
          {isLeader && (
            <span className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold">
              Captain
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 truncate">{player.email}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-gray-400 inline-flex items-center gap-1">
          <Hash className="w-3 h-3" />
          {player.uid || "—"}
        </p>
      </div>
    </div>
  );
}

export default function MyScrims({ email }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScrim, setSelectedScrim] = useState(null);

  const fetchScrims = useCallback(async () => {
    if (!email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        API.PARTICIPANTS_BY_EMAIL.replace(":email", encodeURIComponent(email)),
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.registrations)) {
        setRegistrations(data.registrations);
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.error("[v0] Failed to fetch user scrims:", err);
      setError("Failed to load your scrims. Please try again.");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchScrims();
  }, [fetchScrims]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/30 via-transparent to-transparent" />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">My Scrims</h2>
              <p className="text-xs text-gray-500">
                {registrations.length > 0
                  ? `${registrations.length} registration${
                      registrations.length > 1 ? "s" : ""
                    }`
                  : "Your scrim registrations"}
              </p>
            </div>
          </div>
          <button
            onClick={fetchScrims}
            disabled={loading}
            className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50"
            aria-label="Refresh scrims"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse"
              >
                <div className="h-36 bg-white/[0.04]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 bg-white/[0.04] rounded" />
                  <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
                  <div className="h-10 bg-white/[0.04] rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-sm text-gray-400 mb-3">{error}</p>
            <button
              onClick={fetchScrims}
              className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && registrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Ticket className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-base font-medium text-white mb-1">
              No scrims yet
            </p>
            <p className="text-sm text-gray-500 max-w-xs inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {email
                ? "We couldn't find any registrations for your email."
                : "Sign in to view your scrim registrations."}
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && registrations.length > 0 && (
          <div className={`${registrations.length > 3 ? 'overflow-x-auto pb-2' : ''}`} style={registrations.length > 3 ? { scrollbarWidth: 'thin', scrollbarColor: 'rgba(147, 51, 234, 0.3) transparent' } : {}}>
            <style jsx>{`
              .scrims-scroll::-webkit-scrollbar {
                height: 6px;
              }
              .scrims-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .scrims-scroll::-webkit-scrollbar-thumb {
                background: rgba(147, 51, 234, 0.3);
                border-radius: 3px;
              }
              .scrims-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(147, 51, 234, 0.5);
              }
            `}</style>
            <div className={`flex gap-3 ${registrations.length <= 3 ? 'flex-wrap' : 'flex-nowrap'} scrims-scroll`}>
              {registrations.map((reg, i) => (
                <div key={reg.id} className={registrations.length > 3 ? 'flex-shrink-0 w-full lg:w-1/3' : 'flex-1 min-w-0'}>
                  <ScrimCard registration={reg} index={i} onViewDetails={setSelectedScrim} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scrim Details Modal */}
      <ScrimDetailsModal scrim={selectedScrim} onClose={() => setSelectedScrim(null)} />
    </motion.section>
  );
}

function ScrimDetailsModal({ scrim, onClose }) {
  if (!scrim) return null;

  const players = scrim.players || [];
  const leader = players.find((p) => p.is_team_leader) || players[0];
  const teammates = players.filter((p) => !p.is_team_leader);
  const payStyle = paymentStyles[scrim.payment_status] || paymentStyles.Pending;

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
          transition={{ type: 'spring', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-2xl max-w-lg w-full shadow-2xl shadow-black/50 overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Cover Photo with Title Overlay */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/30">
            {scrim.scrim_banner_image ? (
              <img
                src={scrim.scrim_banner_image}
                alt="Scrim banner"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-pink-900/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
            
            {/* Title and Status on Photo */}
            <div className="absolute bottom-4 left-4 right-12">
              <h4 className="text-2xl font-bold text-white mb-2 line-clamp-2">{scrim.scrim_title}</h4>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-black/50 backdrop-blur-sm border border-white/10">
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                  {scrim.scrim_game}
                </span>
                <StatusBadge status={scrim.status} />
              </div>
            </div>
            
            {/* Close button overlay */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 border border-white/[0.1] text-gray-400 hover:text-white transition backdrop-blur-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

            {/* Meta Information */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-purple-400" />
                {formatDate(scrim.slot_date)}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-gray-300 ml-3">
                <Clock className="w-4 h-4 text-pink-400" />
                {formatTime(scrim.slot_time)}
              </div>
              {scrim.scrim_region && (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-sm text-gray-300 ml-3">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  {scrim.scrim_region}
                </div>
              )}
            </div>

            {/* Team & Reference */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-purple-500/[0.08] to-transparent border border-purple-500/10">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Team</p>
                <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  {scrim.team_name || "—"}
                </p>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-pink-500/[0.08] to-transparent border border-pink-500/10">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Reference</p>
                <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  {scrim.payment_reference || "—"}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="inline-flex items-center gap-2 text-xs text-gray-400">
                <CreditCard className="w-4 h-4" />
                Entry Fee
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {Number(scrim.entry_fee) > 0 ? `BDT ${scrim.entry_fee}` : "Free"}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${payStyle.text} ${payStyle.bg}`}>
                  {scrim.payment_status || "Pending"}
                </span>
              </div>
            </div>

            {/* Roster */}
            {players.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Roster ({players.length})
                </h5>
                <div className="space-y-2">
                  {leader && <PlayerRow player={leader} isLeader />}
                  {teammates.map((p) => (
                    <PlayerRow key={p.id} player={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.08] flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.08] transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
