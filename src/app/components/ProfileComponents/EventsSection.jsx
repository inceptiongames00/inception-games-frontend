"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import UpgradePlanModal from "./UpgradePlanModal";
import ActivateSubscriptionModal from "./ActivateSubscriptionModal";
import {
  Trophy,
  Swords,
  Briefcase,
  Search,
  Monitor,
  Users,
  User,
  Flag,
  ExternalLink,
  Loader2,
  RefreshCw,
  Lock,
  Zap,
  Smartphone,
  Gamepad2,
} from "lucide-react";
import Image from "next/image";
import { API } from "@/lib/api";

// Fallback API configuration if API.TOURNAMENT_GET_ALL is undefine
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://inception-games.an.r.appspot.com/api/v1";
const TOURNAMENT_API_URL =
  API.TOURNAMENT_GET_ALL || `${API_BASE_URL}/cms/tournaments/all`;
const SCRIMS_API_URL = API.SCRIMS_GET_ALL || `${API_BASE_URL}/scrims`;

// Games data (for mapping game names to images)
const games = [
  {
    id: "apex",
    name: "Apex Legends",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148305/apex_btoyw6.png",
  },
  {
    id: "cod-bo7",
    name: "Call of Duty: Black Ops 7",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148320/codm_jsuidq.png",
  },
  {
    id: "cod-warzone",
    name: "Call of Duty: Warzone",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148320/codm_jsuidq.png",
  },
  {
    id: "chess",
    name: "Chess",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148314/chess_vpyepf.png",
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148322/csgo_osyrgj.png",
  },
  {
    id: "crossfire",
    name: "Crossfire",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148311/cf_mbdfng.jpg",
  },
  {
    id: "dota2",
    name: "Dota 2",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148325/dota2_bnitad.png",
  },
  {
    id: "fc26-pc",
    name: "FC26 - PC",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148346/fifapc_ekgtge.png",
  },
  {
    id: "fc26-consoles",
    name: "FC26 - Consoles",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148337/fcconsole_ze4njl.png",
  },
  {
    id: "fc26-mobile",
    name: "FC26 - Mobile",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148340/fcmobile_fwbjpw.png",
  },
  {
    id: "efootball-pc",
    name: "eFootball - PC",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148334/efootballpc_ykrrpz.png",
  },
  {
    id: "efootball-consoles",
    name: "eFootball - Consoles",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148328/efootballconsole_gwo20c.png",
  },
  {
    id: "efootball-mobile",
    name: "eFootball - Mobile",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148331/efootballmobile_dt6pct.png",
  },
  {
    id: "fatal-fury",
    name: "Fatal Fury: City of the Wolves",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148343/ff_kgnye5.jpg",
  },
  {
    id: "freefire",
    name: "Free Fire",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148349/freefire_yvwde4.png",
  },
  {
    id: "hok",
    name: "Honor of Kings",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148352/hk_ggqjvd.jpg",
  },
  {
    id: "lol",
    name: "League of Legends",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148355/lol_iox7ut.png",
  },
  {
    id: "mlbb",
    name: "Mobile Legends: Bang Bang",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148360/mlbb_o2upi2.png",
  },
  {
    id: "overwatch2",
    name: "Overwatch 2",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148363/overwatch_sz5p67.png",
  },
  {
    id: "pubg",
    name: "PUBG / PUBG: Battlegrounds",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148367/pubg_ss1pcn.png",
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148367/pubg_ss1pcn.png",
  },
  {
    id: "r6x",
    name: "Rainbow Six Siege X",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148653/r6_lssnv3.jpg",
  },
  {
    id: "sf6",
    name: "Street Fighter 6",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148295/sf6_vf3lca.png",
  },
  {
    id: "tft",
    name: "Teamfight Tactics",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148299/tt_qlofbx.jpg",
  },
  {
    id: "valorant",
    name: "VALORANT",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148302/valorant_nr0uf9.png",
  },
  {
    id: "valorant-mobile",
    name: "VALORANT Mobile",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148302/valorant_nr0uf9.png",
  },
  {
    id: "coc",
    name: "Clash of Clans",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148317/coc_yosnc6.png",
  },
  {
    id: "tekken8",
    name: "Tekken 8",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148297/tekken_dn33wd.jpg",
  },
  {
    id: "mk11",
    name: "Mortal Kombat 11",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148357/mk11_ecv0mw.png",
  },
  {
    id: "brawlstars",
    name: "Brawl Stars",
    image:
      "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148308/brawlstars_ffxvrc.png",
  },
];

// Helper to get game image from title or game name
function getGameImage(eventTitle, gameName) {
  // Try to find a matching game from the games list
  const searchTerm = (gameName || eventTitle || "").toLowerCase();
  const matchedGame = games.find(
    (g) =>
      searchTerm.includes(g.name.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.split(" ")[0]),
  );
  return (
    matchedGame?.image ||
    "https://res.cloudinary.com/jvpygp4b/image/upload/v1783148367/pubg_ss1pcn.png"
  ); // Default fallback
}

// Helper to determine event type from title
function getEventType(title, organizer) {
  const lowerTitle = (title || "").toLowerCase();
  const lowerOrg = (organizer || "").toLowerCase();

  if (
    lowerTitle.includes("brand") ||
    lowerTitle.includes("deal") ||
    lowerTitle.includes("sponsor")
  ) {
    return "Brand Deal";
  }
  if (lowerTitle.includes("scrim")) {
    return "Scrims";
  }
  return "Tournament";
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr);
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
  return `${days[date.getDay()]} ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function getStatusColor(status) {
  const lowerStatus = (status || "").toLowerCase();
  if (lowerStatus === "upcoming")
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (lowerStatus === "ongoing")
    return "text-blue-400 bg-blue-500/10 border-blue-500/30";
  if (lowerStatus === "completed" || lowerStatus === "cancelled")
    return "text-red-400 bg-red-500/10 border-red-500/30";
  return "text-gray-400 bg-gray-500/10 border-gray-500/30";
}

function getStatusText(status) {
  const lowerStatus = (status || "").toLowerCase();
  if (lowerStatus === "upcoming") return "Registration Open";
  if (lowerStatus === "ongoing") return "In Progress";
  if (lowerStatus === "completed") return "Event Ended";
  if (lowerStatus === "cancelled") return "Cancelled";
  return status || "Unknown";
}

// Platform Icon Component
function PlatformDisplay({ platform }) {
  const normalizedPlatform = platform?.toLowerCase().trim();

  // Determine icon and label based on platform
  let Icon, label, brandColor;

  switch (normalizedPlatform) {
    case "pc":
    case "pc only":
    case "pc only ":
      Icon = Monitor;
      label = "PC";
      brandColor = "text-blue-400";
      break;
    case "mobile":
    case "mobile only":
    case "mobile only ":
      Icon = Smartphone;
      label = "Mobile";
      brandColor = "text-pink-400";
      break;
    case "console":
    case "console only":
    case "console only ":
      Icon = Gamepad2;
      label = "Console";
      brandColor = "text-yellow-400";
      break;
    case "cross-platform":
    case "all platforms":
    case "cross platform":
      Icon = Monitor;
      label = "Cross Platform";
      brandColor = "text-purple-400";
      break;
    default:
      Icon = Monitor;
      label = "All Platforms";
      brandColor = "text-gray-400";
  }

  return (
    <div className="flex items-center gap-1.5">
      <Icon size={16} className={`${brandColor}`} strokeWidth={2.5} />
      <span className={`${brandColor} text-xs`}>{label}</span>
    </div>
  );
}

// Coming Soon Card Component - Memoize
const ComingSoonCard = React.memo(function ComingSoonCard({
  category,
  icon: IconComponent,
}) {
  const categoryColors = {
    Tournament: {
      bg: "from-orange-600/20 to-red-600/20",
      border: "border-orange-500/30",
      icon: "text-orange-400",
      accent: "bg-orange-500/10 border-orange-500/30",
      text: "text-orange-300",
    },
    "Brand Deal": {
      bg: "from-pink-600/20 to-purple-600/20",
      border: "border-pink-500/30",
      icon: "text-pink-400",
      accent: "bg-pink-500/10 border-pink-500/30",
      text: "text-pink-300",
    },
    "Free Tournament": {
      bg: "from-emerald-600/20 to-green-600/20",
      border: "border-emerald-500/30",
      icon: "text-emerald-400",
      accent: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-300",
    },
  };

  const colors = categoryColors[category] || categoryColors.Tournament;

  return (
    <motion.div
      className={`relative bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl overflow-hidden p-6 h-full min-h-[420px] flex flex-col items-center justify-center text-center group hover:border-opacity-50 transition-all duration-300`}
      whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.2)" }}
      layout
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${colors.bg} rounded-full opacity-20 blur-3xl`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${colors.bg} rounded-full opacity-20 blur-3xl`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-2xl ${colors.accent} flex items-center justify-center border`}
        >
          <IconComponent className={`w-8 h-8 ${colors.icon}`} />
        </div>

        {/* Category Name */}
        <h3 className="text-2xl font-bold text-white">{category} Events</h3>

        {/* Lock/Coming Soon Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.accent} border`}
        >
          <Lock className={`w-4 h-4 ${colors.icon}`} />
          <span className={colors.text}>Registration Coming Soon</span>
        </div>

        {/* Coming Soon Date */}
        <div className="space-y-2 pt-2">
          <p className="text-gray-300 text-sm font-medium">
            Opens June 20th, 2026
          </p>
          <p className="text-gray-500 text-xs">
            {/* {daysUntil > 0 ? `In ${daysUntil} days` : "Available now!"} */}
          </p>
        </div>

        {/* Pulse Animation Indicator */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400">
            <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
            <span>More opportunities coming</span>
          </div>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>
    </motion.div>
  );
});
ComingSoonCard.displayName = "ComingSoonCard";

// Event Card Component - Memoized
const EventCard = React.memo(function EventCard({
  event,
  onClick,
  user,
  userRegistrations,
  onUpgradePlanClick,
  onActivateClick,
}) {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user has already registered for this event
  const isAlreadyRegistered = React.useMemo(() => {
    if (!userRegistrations) return false;

    if (event.eventType === "Scrims" && userRegistrations.scrim_registrations) {
      return userRegistrations.scrim_registrations.some(
        (reg) => reg.scrim_id === event.id,
      );
    }

    if (
      event.eventType === "Tournament" &&
      userRegistrations.tournament_registrations
    ) {
      // Handle both string and number comparisons for tournament_id
      return userRegistrations.tournament_registrations.some(
        (reg) => String(reg.tournament_id) === String(event.id),
      );
    }

    return false;
  }, [event, userRegistrations]);

  const handleCardClick = (event, action) => {
    setIsLoading(true);
    // The onClick function will handle navigation
    // Loading state will persist even after the function returns
    onClick(event, action);
  };

  const eventType =
    event.eventType || getEventType(event.title, event.organizer);
  // Use banner_image from API if available, otherwise fall back to game image
  const gameImage =
    event.banner_image ||
    event.game?.image ||
    getGameImage(event.title, event.game_name);
  const gameName = event.game?.name || event.game_name || "Gaming Event";

  // Calculate slots percentage if available
  const slotsPercentage =
    event.totalSlots > 0 ? (event.filledSlots / event.totalSlots) * 100 : 50;

  // Check if user is eligible (primaryGame matches event's game_name)
  const userPrimaryGame = user?.primaryGame || user?.primary_game;
  const eventGameName = event.game_name || event.game?.name;
  const isEligible =
    userPrimaryGame &&
    eventGameName &&
    userPrimaryGame.toLowerCase().trim() === eventGameName.toLowerCase().trim();

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-900/40 via-[#111115] to-black/60 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all duration-300 group"
      whileHover={{ y: -6 }}
      layout
    >
      {/* Banner - Game Image with decorative elements */}
      <div
        className="relative h-56 overflow-hidden bg-gradient-to-br from-purple-900/20 to-black"
        // onClick={() => onClick(event)}
      >
        <Image
          src={gameImage}
          alt={gameName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-black/40 to-transparent" />

        {/* Date Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-yellow-400/30">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold uppercase">
              {event.start_date
                ? formatDate(event.start_date).toUpperCase()
                : "TBD"}
            </span>
          </div>
        </div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <span
            className={`px-4 py-1.5 text-xs font-bold rounded-full border capitalize inline-block ${getStatusColor(event.status)}`}
          >
            {event.status || "Upcoming"}
          </span>
        </div>

        {/* Event Type Label - Bottom Left */}
        <div className="absolute bottom-4 left-4">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            {eventType}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Game Icon + Organizer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border border-white/[0.1]">
              <Image
                src={gameImage}
                alt={gameName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-sm font-semibold max-w-[120px] truncate">
              {gameName.length > 15
                ? gameName.split(":")[0].split(" ").slice(0, 2).join(" ")
                : gameName}
            </span>
          </div>
          {event.organizer && (
            <span className="px-3 py-1 text-xs font-bold text-purple-300 bg-purple-500/20 rounded-full border border-purple-500/30 uppercase">
              {event.organizer}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-white font-bold text-xl line-clamp-2 leading-tight">
            {event.title}
          </h3>
        </div>

        {/* Date & Status Text */}
        <div className="flex items-center gap-3 text-sm">
          <p className="text-green-400 font-semibold">
            {getStatusText(event.status)}
          </p>
          <p className="font-semibold">
            Starts From:{" "}
            <span className="text-red-400 font-semibold">
              {formatDate(event.start_date)}
            </span>
          </p>
        </div>

        {/* Meta Info - Location, Platform, Team Type */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Flag size={13} className="text-gray-500" />
            <span>{event.venue || event.location || "Online"}</span>
          </div>
          <PlatformDisplay platform={event.platform} />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            {(event.teamType || "").toLowerCase() === "solo" ? (
              <User size={13} className="text-gray-500" />
            ) : (
              <Users size={13} className="text-gray-500" />
            )}
            <span>{event.teamType || "Team"}</span>
          </div>
          {/* Tournament Category Badge - Mini/Large */}
          {event.event_category && (
            <span
              className={`px-3 py-1 text-xs rounded-full bg-white/[0.03] border border-white/[0.06] ${
                event.event_category === "Large Tournament"
                  ? "text-sky-400"
                  : "text-green-400"
              }`}
            >
              {event.event_category === "Large Tournament" ? "Large" : "Mini"}
            </span>
          )}
        </div>

        {/* Prize Pool - if exists */}
        {event.prizePool > 0 && (
          <div className="flex items-center gap-2 text-sm py-2 px-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <span className="text-white font-semibold">
              Prize Pool {Math.floor(event.prizePool)} {event.currency || "BDT"}
            </span>
          </div>
        )}

        {/* Description - if exists */}
        {event.description && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Join Event Button */}
        <motion.button
          onClick={() => {
            // Check if tournament is locked
            if (event.is_lock) {
              // Check user's subscription status
              const activeSubscription = user?.subscriptions?.[0];
              const subscriptionStatus =
                activeSubscription?.status?.toLowerCase();

              // If subscription is pending, open ActivateSubscriptionModal
              if (subscriptionStatus === "pending") {
                Swal.fire({
                  icon: "info",
                  title: "Activate Your Plan",
                  html: "Unavailable: Your subscription is currently pending approval or inactive. Access will be available once your subscription is activated.",
                  confirmButtonText: "Activate",
                  confirmButtonColor: "#9333ea",
                  background: "#1a1a2e",
                  color: "#fff",
                  allowOutsideClick: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    onActivateClick();
                  }
                });
                return;
              }

              // If waiting for approval, just close (Got It button)
              if (subscriptionStatus === "waiting for approval") {
                Swal.fire({
                  icon: "info",
                  title: "Waiting For Approval",
                  html: "Unavailable: Your subscription is currently pending approval or inactive. Access will be available once your subscription is activated.",
                  confirmButtonText: "Got It",
                  confirmButtonColor: "#9333ea",
                  background: "#1a1a2e",
                  color: "#fff",
                  allowOutsideClick: true,
                });
                return;
              }

              // Otherwise show the upgrade plan dialog
              Swal.fire({
                icon: "warning",
                title: "Upgrade Your Plan",
                html:
                  event.applicability_reason ||
                  "You need to upgrade your plan to join this tournament.",
                confirmButtonText: "Upgrade Plan",
                confirmButtonColor: "#ec4899",
                background: "#1a1a2e",
                color: "#fff",
                allowOutsideClick: true,
                didOpen: (modal) => {
                  const confirmButton = modal.querySelector(".swal2-confirm");
                  if (confirmButton) {
                    confirmButton.style.backgroundColor = "#ec4899";
                  }
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  onUpgradePlanClick(true);
                }
              });
              return;
            }

            // Determine button action based on conditions
            let action = "view";

            if (isAlreadyRegistered) {
              // User is already registered for this tournament - show VIEW DETAILS only
              action = "view";
            } else if (isEligible) {
              // User not registered, eligible - show JOIN EVENT
              action = "join";
            } else if (!isEligible) {
              // User not eligible
              action = "not-applicable";
            }

            handleCardClick(event, action);
          }}
          disabled={isLoading}
          className={`w-full mt-2 py-3 font-bold text-sm rounded-xl transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 ${
            isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          } ${
            !isEligible && !isAlreadyRegistered
              ? "bg-gradient-to-r from-rose-500 to-red-500 text-white cursor-not-allowed"
              : isAlreadyRegistered
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white opacity-90"
                : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white"
          }`}
          whileHover={
            isEligible && !isAlreadyRegistered && !isLoading
              ? { scale: 1.01 }
              : {}
          }
          whileTap={
            isEligible && !isAlreadyRegistered && !isLoading
              ? { scale: 0.98 }
              : {}
          }
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Loading...</span>
            </>
          ) : !isEligible && !isAlreadyRegistered ? (
            "You are not Applicable"
          ) : isAlreadyRegistered ? (
            "View Details"
          ) : isEligible ? (
            "Join Event"
          ) : (
            "View Details"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
});
EventCard.displayName = "EventCard";

// Main Events Section Component
export default function EventsSection({
  user,
  initialFilter = "Tournament",
  routePrefix = "/profile",
  onSubscriptionSuccess,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [apiPlans, setApiPlans] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  // Initialize activeFilter from initialFilter prop, URL sync happens in useEffect
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const [searchQuery, setSearchQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState(null); // null means no filter applied
  const [showFreeTourn, setShowFreeTourn] = useState(false); // Toggle to show Free Tournament card
  const [showSizeFilterDropdown, setShowSizeFilterDropdown] = useState(false); // Control dropdown visibility

  // Handle client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Update activeFilter whenever URL searchParams change
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveFilter(tabParam);
      // Reset size filter when switching tabs away from Tournament
      if (tabParam !== "Tournament") {
        setSizeFilter(null);
      }
      // Scroll to Events section after a small delay to allow state update
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [searchParams]);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cms/subscription/plans`);
        const data = await response.json();

        if (data.plans && Array.isArray(data.plans)) {
          setApiPlans(data.plans);
        }
      } catch (error) {
        console.error(
          "[EventsSection] Error fetching subscription plans:",
          error,
        );
      }
    };

    fetchPlans();
  }, []);

  // Listen for custom event to switch tabs
  useEffect(() => {
    const handleTabSwitch = (event) => {
      setActiveFilter(event.detail.tab);
      // Reset size filter when switching tabs away from Tournament
      if (event.detail.tab !== "Tournament") {
        setSizeFilter(null);
      }
      // Scroll to Events section after a small delay
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    };

    window.addEventListener("switchProfileTab", handleTabSwitch);
    return () => {
      window.removeEventListener("switchProfileTab", handleTabSwitch);
    };
  }, []);

  // Update active filter if initialFilter prop changes
  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  // Auto-switch to Tournament tab when size filter is selected
  useEffect(() => {
    if (sizeFilter !== null && activeFilter !== "Tournament") {
      setActiveFilter("Tournament");
    }
  }, [sizeFilter]);

  // Fetch events based on active filter (Scrims, Tournaments, or both for "all")
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let allEvents = [];

      // Fetch Scrims if "all" or "Scrims" is selected
      // TEMPORARILY DISABLED - Scrims feature coming soon
      /*
      if (activeFilter === "all" || activeFilter === "Scrims") {
        try {
          const scrimsRes = await fetch(SCRIMS_API_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const scrimsData = await scrimsRes.json();

          if (scrimsRes.ok) {
            const scrimsArray = scrimsData.scrims || scrimsData.data || [];
            
            // Transform API scrims to our card format
            const transformedScrims = scrimsArray.map((scrim) => {
              return {
                id: scrim.id,
                title: scrim.title,
                eventType: "Scrims",
                game: {
                  name: scrim.game || scrim.title?.split(" ")[0] || "Gaming",
                  image: getGameImage(scrim.title, scrim.game),
                },
                game_name: scrim.game,
                status: scrim.status,
                start_date: scrim.start_at,
                event_date: scrim.start_at,
                end_date: scrim.end_at,
                location: scrim.region,
                venue: scrim.region,
                platform: scrim.platform || "All Platforms",
                teamType: scrim.game_mode || "Open",
                prizePool: parseFloat(scrim.prize_pool) || 0,
                prize_pool: parseFloat(scrim.prize_pool) || 0,
                currency: scrim.currency || "BDT",
                entryType: scrim.entry_type,
                entryFee: parseFloat(scrim.entry_fee) || 0,
                teamSize: scrim.team_size,
                totalSlots: scrim.max_teams || 0,
                total_slots: scrim.max_teams || 0,
                filledSlots: scrim.filled_teams || 0,
                filled_slots: scrim.filled_teams || 0,
                registrationStart: scrim.reg_start_at,
                registration_start: scrim.reg_start_at,
                registrationEnd: scrim.reg_end_at,
                registration_end: scrim.reg_end_at,
                tournamentStart: scrim.start_at,
                tournamentEnd: scrim.end_at,
                rules: scrim.rules,
                slots: scrim.slots || [],
                host: scrim.hosted_by || "Inception Games",
                organizer: scrim.hosted_by || "Inception Games",
                banner_image: scrim.banner_image,
              };
            });
            
            allEvents.push(...transformedScrims);
            
            // Cache the scrims list for detail page to use
            sessionStorage.setItem("scrims_cache", JSON.stringify(scrimsArray));
            sessionStorage.setItem("scrims_cache_timestamp", Date.now().toString());
          }
        } catch (err) {
          console.error("[EventsSection] Failed to fetch scrims:", err);
        }
      }
      */

      // Fetch Tournaments if "all" or "Tournament" is selected
      if (activeFilter === "all" || activeFilter === "Tournament") {
        try {
          // Use the new authenticated endpoint with userId
          const userId = user?.id || user?.userId || "SNS-5556"; // Use correct user id from context
          const newTournamentURL = `https://inception-games.an.r.appspot.com/api/v1/auth/tournaments/list`;

          const tournamentsRes = await fetch(newTournamentURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
            }),
          });
          const tournamentsData = await tournamentsRes.json();

          if (tournamentsRes.ok) {
            const tournamentsArray =
              tournamentsData.tournaments || tournamentsData.data || [];

            // Transform API tournaments to our card format
            const transformedTournaments = tournamentsArray.map(
              (tournament) => {
                return {
                  id: tournament.id,
                  title: tournament.title,
                  eventType: "Tournament",
                  game: {
                    name:
                      tournament.game ||
                      tournament.title?.split(" ")[0] ||
                      "Gaming",
                    image: getGameImage(tournament.title, tournament.game),
                  },
                  game_name: tournament.game,
                  status: tournament.status,
                  start_date: tournament.reg_start_at || tournament.start_date,
                  event_date: tournament.reg_end_at || tournament.start_date,
                  end_date: tournament.end_at || tournament.end_date,
                  location: tournament.region || tournament.location,
                  venue: tournament.region || tournament.location,
                  platform: tournament.platform || "All Platforms",
                  teamType:
                    tournament.game_mode || tournament.team_type || "Team",
                  prizePool: parseFloat(tournament.prize_pool) || 0,
                  prize_pool: parseFloat(tournament.prize_pool) || 0,
                  currency: tournament.currency || "BDT",
                  entryType: tournament.entry_type,
                  entryFee: parseFloat(tournament.entry_fee) || 0,
                  teamSize: tournament.team_size,
                  totalSlots:
                    tournament.max_teams || tournament.total_slots || 0,
                  total_slots:
                    tournament.max_teams || tournament.total_slots || 0,
                  filledSlots:
                    tournament.filled_teams || tournament.filled_slots || 0,
                  filled_slots:
                    tournament.filled_teams || tournament.filled_slots || 0,
                  registrationStart:
                    tournament.reg_start_at || tournament.registration_start,
                  registration_start:
                    tournament.reg_start_at || tournament.registration_start,
                  registrationEnd:
                    tournament.reg_end_at || tournament.registration_end,
                  registration_end:
                    tournament.reg_end_at || tournament.registration_end,
                  tournamentStart: tournament.start_at || tournament.start_date,
                  tournamentEnd: tournament.end_at || tournament.end_date,
                  rules: tournament.rules,
                  slots: tournament.slots || [],
                  host:
                    tournament.hosted_by ||
                    tournament.organizer ||
                    "Inception Games",
                  organizer:
                    tournament.hosted_by ||
                    tournament.organizer ||
                    "Inception Games",
                  banner_image: tournament.banner_image,
                  is_lock: tournament.is_lock || false,
                  applicability_reason: tournament.applicability_reason || "",
                  event_category: tournament.event_category || "Tournament",
                };
              },
            );

            allEvents.push(...transformedTournaments);

            // Cache the tournaments list for detail page to use
            sessionStorage.setItem(
              "tournaments_cache",
              JSON.stringify(tournamentsArray),
            );
            sessionStorage.setItem(
              "tournaments_cache_timestamp",
              Date.now().toString(),
            );
          }
        } catch (err) {
          console.error("[EventsSection] Failed to fetch tournaments:", err);
        }
      }
      setEvents(allEvents);
    } catch (err) {
      console.error("[EventsSection] Failed to fetch events:", err);
      setError("Failed to load scrims. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, activeFilter]);

  // Calculate filter counts - Tournaments and Brand Deals show as "coming soon" so count is not displayed from API
  const scrimmageEvents = React.useMemo(() => {
    return events.filter((e) => e.eventType === "Scrims");
  }, [events]);

  const tournamentEvents = React.useMemo(() => {
    return events.filter((e) =>
      ["mini tournament", "large tournament"].includes(
        (e.event_category || "").toLowerCase(),
      ),
    );
  }, [events]);

  const freeTournamentCount = events.filter(
    (event) => event.event_category === "Free Event",
  );

  const filterCounts = React.useMemo(() => {
    return {
      all: events.length + 1, // Add 1 for Brand Deals (coming soon)
      Tournament: tournamentEvents.length,
      "Free Tournament": freeTournamentCount.length,
      Scrims: scrimmageEvents.length,
      "Brand Deal": 0, // Coming soon category
    };
  }, [
    events.length,
    scrimmageEvents.length,
    freeTournamentCount,
    tournamentEvents.length,
  ]);

  const FILTER_TABS = React.useMemo(
    () => [
      { id: "all", label: "All", count: filterCounts.all },
      // {
      //   id: "Scrims",
      //   label: "Scrims",
      //   count: filterCounts.Scrims,
      //   icon: Swords,
      // },
      {
        id: "Tournament",
        label: "Tournaments",
        count: filterCounts.Tournament,
        icon: Trophy,
      },
      {
        id: "Brand Deal",
        label: "Brand Deals",
        count: filterCounts["Brand Deal"],
        icon: Briefcase,
      },
      {
        id: "Free Event",
        label: "Free Tournaments",
        count: filterCounts["Free Tournament"],
        icon: Briefcase,
      },
    ],
    [filterCounts],
  );

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      // Hide all cards when Free Tournament is selected
      if (showFreeTourn) {
        return false;
      }

      // Search filter
      const matchesSearch =
        (event.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.game?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (event.organizer || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Event category filter
      let matchesFilter = true;

      const eventCategory = (event.event_category || "").toLowerCase();

      if (activeFilter === "Free Event") {
        matchesFilter = eventCategory === "free event";
      } else if (activeFilter === "Tournament") {
        matchesFilter =
          eventCategory === "mini tournament" ||
          eventCategory === "large tournament";
      } else if (activeFilter === "Brand Deal") {
        matchesFilter = false;
      }

      // Tournament size filter
      let matchesSize = true;

      if (sizeFilter !== "all") {
        if (sizeFilter === "mini") {
          matchesSize = eventCategory.includes("mini");
        } else if (sizeFilter === "large") {
          matchesSize = eventCategory.includes("large");
        }
      }

      return matchesFilter && matchesSearch && matchesSize;
    });
  }, [events, activeFilter, searchQuery, sizeFilter, showFreeTourn]);

  // Memoize which coming soon cards to show
  const showComingSoonCards = React.useMemo(
    () => ({
      Tournament: false, // Don't show coming soon for tournaments since we're fetching them
      "Brand Deal": activeFilter === "all" || activeFilter === "Brand Deal",
      "Free Event": activeFilter === "Free Event", //showFreeTourn === true, // Only show when explicitly selected
    }),
    [activeFilter, showFreeTourn],
  );

  const handleEventClick = (event, action = "view") => {
    // Cache the event data for instant load on detail page
    // Store the transformed version for immediate display
    const eventCacheKey = `event_${event.id}`;
    sessionStorage.setItem(eventCacheKey, JSON.stringify(event));

    // Navigate to event detail page with actual event ID and action parameter
    // action can be: 'view', 'join', or 'not-applicable'
    router.push(`${routePrefix}/events/${event.id}?action=${action}`);
  };

  const handleSubscriptionActivated = async () => {
    // Refetch user data after successful activation
    try {
      const userId = user?.id || user?.userId || "SNS-5556";
      const response = await fetch(
        "https://inception-games.an.r.appspot.com/api/v1/auth/user/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Update user profile with new subscription status
        if (data.user) {
          // Call parent's refetch or update mechanism
          // For now, just close the modal and refetch events
          setIsActivateModalOpen(false);
          // Re-fetch events to update button states
          fetchEvents();
        }
      }
    } catch (error) {
      console.error("Error refetching user profile:", error);
      setIsActivateModalOpen(false);
      fetchEvents();
    }
  };

  // Don't render until client is mounted to prevent hydration mismatch
  if (!hasMounted) {
    return null;
  }

  return (
    <motion.div
      ref={sectionRef}
      className="space-y-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 bg-[#111115] p-1 rounded-xl border border-white/[0.06] min-w-max">
            {FILTER_TABS.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    // Reset size filter when clicking on "all" or "Brand Deal" tabs
                    if (tab.id !== "Tournament") {
                      setSizeFilter(null);
                      setShowFreeTourn(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {IconComponent && <IconComponent size={14} />}
                  {tab.label}
                  <span
                    className={`text-xs ${activeFilter === tab.id ? "text-purple-200" : "text-gray-500"}`}
                  >
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Filter Button */}
        {/* <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowSizeFilterDropdown(!showSizeFilterDropdown)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                sizeFilter || showFreeTourn
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-[#111115] border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              {showFreeTourn
                ? "Free Tournament"
                : sizeFilter === "mini"
                  ? "Mini Tournament"
                  : sizeFilter === "large"
                    ? "Large Tournament"
                    : "Filter By"}
            </button>
            //Dropdown
            {showSizeFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111115] border border-white/[0.06] rounded-lg shadow-lg z-10">
                {[
                  { value: "mini", label: "Mini Tournament" },
                  { value: "large", label: "Large Tournament" },
                  // { value: "free", label: "Free Tournament" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSizeFilter(option.value);
                      // Reset Free Tournament filter when selecting Mini or Large
                      setShowFreeTourn(false);
                      // Auto-switch to Tournament tab
                      setActiveFilter("Tournament");

                      setShowSizeFilterDropdown(false); // Close dropdown after selection
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center gap-2 ${
                      option.value === "free"
                        ? showFreeTourn
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                        : sizeFilter === option.value
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {option.value === "free" && showFreeTourn ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : option.value !== "free" &&
                      sizeFilter === option.value ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                    {option.label}
                  </button>
                ))}
                {(sizeFilter || showFreeTourn) && (
                  <button
                    onClick={() => {
                      setSizeFilter(null);
                      setShowFreeTourn(false);
                      setShowSizeFilterDropdown(false); // Close dropdown after reset
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/[0.05] border-t border-white/[0.06]"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        </div> */}

        {/* <div className="flex items-center gap-1 bg-[#111115] p-1 rounded-xl border border-white/[0.06]">
          {FILTER_TABS.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {IconComponent && <IconComponent size={14} />}
                {tab.label}
                <span className={`text-xs ${activeFilter === tab.id ? 'text-purple-200' : 'text-gray-500'}`}>
                  ({tab.count})
                </span>
              </button>
            )
          })}
        </div> */}

        {/* Search + Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111115] border border-white/[0.06] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2.5 bg-[#111115] border border-white/[0.06] rounded-xl text-gray-400 hover:text-white hover:border-white/[0.12] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-purple-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <ExternalLink size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Failed to load events
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          layout={false}
        >
          <AnimatePresence mode="wait">
            {/* Coming Soon Cards - Tournaments */}
            {showComingSoonCards.Tournament && (
              <motion.div
                key="tournament-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ComingSoonCard category="Tournament" icon={Trophy} />
              </motion.div>
            )}

            {/* Scrims from API */}
            {filteredEvents.map((event) => (
              <motion.div
                key={`${event.eventType}-${event.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <EventCard
                  event={event}
                  onClick={handleEventClick}
                  user={user}
                  userRegistrations={user}
                  onUpgradePlanClick={() => setIsUpgradePlanModalOpen(true)}
                  onActivateClick={() => setIsActivateModalOpen(true)}
                />
              </motion.div>
            ))}

            {/* Coming Soon Cards - Brand Deals */}
            {showComingSoonCards["Brand Deal"] && (
              <motion.div
                key="brand-deal-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ComingSoonCard category="Brand Deal" icon={Briefcase} />
              </motion.div>
            )}

            {/* Coming Soon Cards - Free Tournament */}
            {showComingSoonCards["Free Tournament"] && (
              <motion.div
                key="free-tournament-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ComingSoonCard category="Free Tournament" icon={Trophy} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State for Scrims with no data */}
          {activeFilter === "Scrims" &&
            filteredEvents.length === 0 &&
            !loading && (
              <motion.div
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Swords size={28} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Scrims Available
                </h3>
                <p className="text-gray-400">
                  Check back soon for new scrim opportunities
                </p>
              </motion.div>
            )}
        </motion.div>
      )}

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradePlanModalOpen}
        onClose={() => setIsUpgradePlanModalOpen(false)}
        plans={apiPlans}
        activePlanName={user?.plan_name || null}
        onSubscriptionSuccess={onSubscriptionSuccess}
        onOpenActivateModal={() => {
          setIsUpgradePlanModalOpen(false);
          setIsActivateModalOpen(true);
        }}
      />

      {/* Activate Subscription Modal */}
      <ActivateSubscriptionModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        subscription={user?.subscriptions?.[0]}
        userId={user?.id || user?.userId}
        onSuccess={handleSubscriptionActivated}
      />
    </motion.div>
  );
}
