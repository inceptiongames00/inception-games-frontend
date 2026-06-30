"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Swords,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Monitor,
  Users,
  User,
  Calendar,
  DollarSign,
  Clock,
  Flag,
  Bell,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Lock,
  Zap,
  Smartphone,
  Gamepad2,
} from "lucide-react";
import Image from "next/image";
import { API } from "@/lib/api";

// Games data (for mapping game names to images)
const games = [
  { id: "apex", name: "Apex Legends", image: "/games/apex.png" },
  {
    id: "cod-bo7",
    name: "Call of Duty: Black Ops 7",
    image: "/games/codm.png",
  },
  {
    id: "cod-warzone",
    name: "Call of Duty: Warzone",
    image: "/games/codm.png",
  },
  { id: "chess", name: "Chess", image: "/games/chess.png" },
  { id: "cs2", name: "Counter-Strike 2", image: "/games/csgo.png" },
  { id: "crossfire", name: "Crossfire", image: "/games/cf.jpeg" },
  { id: "dota2", name: "Dota 2", image: "/games/dota2.png" },
  { id: "fc26-pc", name: "FC26 - PC", image: "/games/fifapc.png" },
  {
    id: "fc26-consoles",
    name: "FC26 - Consoles",
    image: "/games/fcconsole.png",
  },
  { id: "fc26-mobile", name: "FC26 - Mobile", image: "/games/fcmobile.png" },
  {
    id: "efootball-pc",
    name: "eFootball - PC",
    image: "/games/efootballpc.png",
  },
  {
    id: "efootball-consoles",
    name: "eFootball - Consoles",
    image: "/games/efootballconsole.png",
  },
  {
    id: "efootball-mobile",
    name: "eFootball - Mobile",
    image: "/games/efootballmobile.png",
  },
  {
    id: "fatal-fury",
    name: "Fatal Fury: City of the Wolves",
    image: "/games/ff.jpeg",
  },
  { id: "freefire", name: "Free Fire", image: "/games/freefire.png" },
  { id: "hok", name: "Honor of Kings", image: "/games/hk.jpeg" },
  { id: "lol", name: "League of Legends", image: "/games/lol.png" },
  { id: "mlbb", name: "Mobile Legends: Bang Bang", image: "/games/mlbb.png" },
  { id: "overwatch2", name: "Overwatch 2", image: "/games/overwatch.png" },
  { id: "pubg", name: "PUBG / PUBG: Battlegrounds", image: "/games/pubg.png" },
  { id: "pubg-mobile", name: "PUBG Mobile", image: "/games/pubg.png" },
  { id: "r6x", name: "Rainbow Six Siege X", image: "/games/r6.jpeg" },
  { id: "sf6", name: "Street Fighter 6", image: "/games/sf6.png" },
  { id: "tft", name: "Teamfight Tactics", image: "/games/tt.jpeg" },
  { id: "valorant", name: "VALORANT", image: "/games/valorant.png" },
  {
    id: "valorant-mobile",
    name: "VALORANT Mobile",
    image: "/games/valorant.png",
  },
  { id: "coc", name: "Clash of Clans", image: "/games/coc.png" },
  { id: "tekken8", name: "Tekken 8", image: "/games/tekken.jpeg" },
  { id: "mk11", name: "Mortal Kombat 11", image: "/games/mk11.png" },
  { id: "brawlstars", name: "Brawl Stars", image: "/games/brawlstars.png" },
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
  return matchedGame?.image || "/games/pubg.png"; // Default fallback
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
      <Icon size={16} className={`${brandColor} font-bold`} strokeWidth={2.5} />
      <span className={`${brandColor} font-bold text-sm`}>{label}</span>
    </div>
  );
}

// Coming Soon Card Component
function ComingSoonCard({ category, icon: IconComponent }) {
  const isComingSoonDate = new Date("2025-05-01");
  const daysUntil = Math.ceil((isComingSoonDate - new Date()) / (1000 * 60 * 60 * 24));
  
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
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${colors.bg} rounded-full opacity-20 blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${colors.bg} rounded-full opacity-20 blur-3xl`} />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 rounded-2xl ${colors.accent} flex items-center justify-center border`}>
          <IconComponent className={`w-8 h-8 ${colors.icon}`} />
        </div>

        {/* Category Name */}
        <h3 className="text-2xl font-bold text-white">
          {category} Events
        </h3>

        {/* Lock/Coming Soon Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.accent} border`}>
          <Lock className={`w-4 h-4 ${colors.icon}`} />
          <span className={colors.text}>Registration Coming Soon</span>
        </div>

        {/* Coming Soon Date */}
        <div className="space-y-2 pt-2">
          <p className="text-gray-300 text-sm font-medium">Opens June 20th, 2026</p>
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
}

// Event Card Component
function EventCard({ event, onClick }) {
  const [expanded, setExpanded] = useState(false);
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

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-900/40 via-[#111115] to-black/60 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all duration-300 group"
      whileHover={{ y: -6 }}
      layout
    >
      {/* Banner - Game Image with decorative elements */}
      <div
        className="relative h-56 cursor-pointer overflow-hidden bg-gradient-to-br from-purple-900/20 to-black"
        onClick={() => onClick(event)}
      >
        <Image src={gameImage} alt={gameName} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-black/40 to-transparent" />

        {/* Date Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-yellow-400/30">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold uppercase">
              {event.start_date
                ? new Date(event.start_date)
                    .toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase()
                : "TBD"}
            </span>
          </div>
        </div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4">
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
          <h3
            className="text-white font-bold text-xl cursor-pointer hover:text-purple-400 transition-colors line-clamp-2 leading-tight"
            onClick={() => onClick(event)}
          >
            {event.title}
          </h3>
        </div>

        {/* Date & Status Text */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-red-400 font-semibold">
            {formatDate(event.start_date)}
          </span>
          <span className="text-green-400 font-semibold">
            {getStatusText(event.status)}
          </span>
        </div>

        {/* Meta Info - Location, Platform, Team Type */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Flag size={13} className="text-gray-500" />
            <span>{event.venue || event.location || "Online"}</span>
          </div>
          <PlatformDisplay platform={event.platform} />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            {(event.teamType || '').toLowerCase() === 'solo' ? (
              <User size={13} className="text-gray-500" />
            ) : (
              <Users size={13} className="text-gray-500" />
            )}
            <span>{event.teamType || "Team"}</span>
          </div>
        </div>

        {/* Prize Pool - if exists */}
        {event.prizePool > 0 && (
          <div className="flex items-center gap-2 text-sm py-2 px-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <DollarSign size={16} className="text-amber-400" />
            <span className="text-white font-semibold">
              {event.currency || "BDT"} {event.prizePool.toLocaleString()} Prize Pool
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
          onClick={() => onClick(event)}
          className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-sm rounded-xl transition-all duration-200 uppercase tracking-wider"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Join Event
        </motion.button>
      </div>
    </motion.div>
  );
}

// Main Events Section Component
export default function EventsSection({ user, initialFilter = "all", routePrefix = "/profile" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize activeFilter from URL params, fallback to initialFilter
  const [activeFilter, setActiveFilter] = useState(() => {
    const tabParam = searchParams?.get('tab');
    return tabParam || initialFilter;
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  // Update activeFilter whenever URL searchParams change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveFilter(tabParam);
      // Scroll to Events section after a small delay to allow state update
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams]);

  // Listen for custom event to switch tabs
  useEffect(() => {
    const handleTabSwitch = (event) => {
      setActiveFilter(event.detail.tab);
      // Scroll to Events section after a small delay
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    window.addEventListener('switchProfileTab', handleTabSwitch);
    return () => {
      window.removeEventListener('switchProfileTab', handleTabSwitch);
    };
  }, []);

  // Update active filter if initialFilter prop changes
  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  // Fetch scrims from the updated /scrims API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API.SCRIMS_GET_ALL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        // New API shape: { total, scrims: [...] }
        const scrimsData = data.scrims || data.data || [];

        // Transform API scrims to our card format
        const transformedEvents = scrimsData.map((scrim) => {
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
        setEvents(transformedEvents);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("[v0] Failed to fetch scrims:", err);
      setError("Failed to load scrims. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calculate filter counts - Tournaments and Brand Deals show as "coming soon" so count is not displayed from API
  const scrimmageEvents = events.filter((e) => e.eventType === "Scrims");
  
  const filterCounts = {
    all: events.length + 2, // Add 2 for the coming soon categories
    Tournament: 0, // Coming soon category
    Scrims: scrimmageEvents.length,
    "Brand Deal": 0, // Coming soon category
  };

  const FILTER_TABS = [
    { id: "all", label: "All", count: filterCounts.all },
    {
      id: "Tournament",
      label: "Tournaments",
      count: filterCounts.Tournament,
      icon: Trophy,
    },
    { id: "Scrims", label: "Scrims", count: filterCounts.Scrims, icon: Swords },
    {
      id: "Brand Deal",
      label: "Brand Deals",
      count: filterCounts["Brand Deal"],
      icon: Briefcase,
    },
  ];

  const filteredEvents = events.filter((event) => {
    // Only show Scrims from API
    const matchesFilter =
      activeFilter === "all" 
        ? event.eventType === "Scrims"
        : (event.eventType === activeFilter && event.eventType === "Scrims");
    const matchesSearch =
      (event.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.game?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (event.organizer || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Determine which coming soon cards to show
  const showComingSoonCards = {
    Tournament: activeFilter === "all" || activeFilter === "Tournament",
    "Brand Deal": activeFilter === "all" || activeFilter === "Brand Deal",
  };

  const handleEventClick = (event) => {
    // Navigate to event detail page with actual event ID
    router.push(`${routePrefix}/events/${event.id}`);
  };

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
          </div>
        </div>

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
            className="p-2.5 bg-[#111115] border border-white/[0.06] rounded-xl text-gray-400 hover:text-white hover:border-white/[0.12] transition-all disabled:opacity-50"
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
          layout
        >
          <AnimatePresence mode="popLayout">
            {/* Coming Soon Cards - Tournaments */}
            {showComingSoonCards.Tournament && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ComingSoonCard category="Tournament" icon={Trophy} />
              </motion.div>
            )}

            {/* Scrims from API */}
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard event={event} onClick={handleEventClick} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State for Scrims with no data */}
          {activeFilter === "Scrims" && filteredEvents.length === 0 && !loading && (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Swords size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Scrims Available</h3>
              <p className="text-gray-400">Check back soon for new scrim opportunities</p>
            </motion.div>
          )}


        </motion.div>
      )}
    </motion.div>
  );
}
