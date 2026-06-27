"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MessageSquare } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Gaming Tournament",
    image:
      "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782306822/roman_pic_mine_kq3ilm.jpg",
    date: "Oct 24, 7:00 PM",
    type: "upcoming",
    badge: "UPCOMING",
  },
  {
    id: 2,
    title: "University Meetup",
    image:
      "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782306822/roman_pic_mine_kq3ilm.jpg",
    date: "Oct 26, 6:30 PM",
    type: "upcoming",
    badge: "STARTING SOON",
  },
  {
    id: 3,
    title: "Online Community Feedback",
    image:
      "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782306822/roman_pic_mine_kq3ilm.jpg",
    date: "Oct 28, 9:00 PM",
    type: "upcoming",
  },
  {
    id: 4,
    title: "Winter Scrims 2023",
    image:
      "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782306822/roman_pic_mine_kq3ilm.jpg",
    date: "December 15, 2023",
    type: "past",
    badge: "COMPLETED",
  },
  {
    id: 5,
    title: "Summer LAN Party",
    image:
      "https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782306822/roman_pic_mine_kq3ilm.jpg",
    date: "August 12, 2023",
    type: "past",
    badge: "COMPLETED",
  },
];

const tabs = ["All", "Upcoming Events", "Past Events"];

export default function UpcomingComEvents() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredEvents =
    activeTab === "All"
      ? events
      : events.filter((event) =>
          activeTab === "Upcoming Events"
            ? event.type === "upcoming"
            : event.type === "past",
        );

  return (
    <section className="relative overflow-hidden bg-[#060814] py-8">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-fuchsia-700/10 blur-[170px]" />
      <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-700/10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-white md:text-4xl">
            Upcoming Community Events
          </h2>

          <p className="mt-4 text-gray-400">
            Don't miss out on the action. Join our upcoming tournaments and
            community nights.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex justify-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-xs uppercase tracking-[0.25em] transition ${
                activeTab === tab
                  ? "text-fuchsia-400"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-[0_0_20px_rgba(236,72,153,0.45)]" />
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl border border-white/10 bg-[#0D1021] p-4 transition-all duration-300 hover:-translate-y-2 hover:border-fuchsia-500/30 hover:shadow-[0_0_35px_rgba(217,70,239,.15)]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {event.badge && (
                  <div
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider text-white ${
                      event.badge === "UPCOMING"
                        ? "bg-fuchsia-500"
                        : event.badge === "STARTING SOON"
                          ? "bg-cyan-500"
                          : "bg-neutral-700"
                    }`}
                  >
                    {event.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mt-5">
                <h3 className="text-xl font-semibold text-white">
                  {event.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={14} />
                  {event.date}
                </div>

                <button
                  className={`mt-6 w-full rounded-xl border py-3 text-sm font-medium transition ${
                    event.type === "past"
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
                  }`}
                >
                  {event.type === "past" ? "View Gallery" : "Join Event"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discord Button */}
        <div className="mt-20 flex justify-center">
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(236,72,153,0.45)] transition hover:opacity-90">
            Join Discord
            <MessageSquare size={18} />
          </button>
        </div>

        
      </div>
    </section>
  );
}
