"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TournamentsSection from "./components/TournamentsSection";
import BrandDealsSection from "./components/BrandDealsSection";
import UnifiedAuthModal from "@/app/components/AuthModals/UnifiedAuthModal";

const tabs = [
  { id: "tournaments", label: "Tournaments" },
  { id: "brand-deals", label: "Brand Deals" },
];

export default function EsportsArena() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "tournaments",
  );

  const handleTabChange = (tabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);

    router.push(`/esports-arena?${params.toString()}`);
  };

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "tournaments");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-zinc-950 text-white pt-20 pb-12 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[170px]" />
          <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-pink-600/10 blur-[180px]" />
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[180px]" />
        </div>

        <div className="relative mx-auto flex min-h-[300px] max-w-7xl flex-col justify-center px-4 md:px-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-center text-xs uppercase tracking-widest text-zinc-400"
          >
            COMPETITIVE GAMING
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-4xl sm:text-5xl font-bold tracking-tight leading-tight md:text-6xl lg:text-7xl"
          >
            E-Sports{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Arena
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 max-w-3xl text-center text-base leading-8 text-zinc-300 md:text-lg"
          >
            Join competitive tournaments and brand collaborations. Compete, win,
            and establish yourself in the esports community.
          </motion.p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="relative bg-zinc-950 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-8 mb-12 flex-wrap"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative pb-3 text-xs uppercase tracking-widest transition cursor-pointer ${
                  activeTab === tab.id
                    ? "text-purple-300"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}

                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.45)]" />
                )}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          {activeTab === "tournaments" && (
            <TournamentsSection onLoginClick={() => setLoginModalOpen(true)} />
          )}
          {activeTab === "brand-deals" && <BrandDealsSection />}
        </div>
      </section>

      {/* Login Modal */}
      <UnifiedAuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
