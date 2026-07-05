"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileHeroBanner from "../components/ProfileComponents/ProfileHeroBanner";
import EventsSection from "../components/ProfileComponents/EventsSection";
import MyScrims from "../components/ProfileComponents/MyScrims";
import EditProfileModal from "../components/ProfileComponents/EditProfileModal";
import { useAuth } from "../context/AuthContext";
import NotificationsPanel from "../components/ProfileComponents/NotificationsPanel";
import SubscriptionSection from "../components/ProfileComponents/SubscriptionSection";
import ProGearShop from "../components/ProfileComponents/ProGearShop";
import { getTokens } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [gamingProfile, setGamingProfile] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [apiUserProfile, setApiUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const tokens = getTokens();
        console.log('[ProfilePage] Tokens:', tokens);
        
        if (!tokens?.accessToken) {
          console.log('[ProfilePage] No access token found');
          setLoadingProfile(false);
          return;
        }

        // const userId = user?.id || '';
           const userId = 'SNS-1524';
        const apiUrl = `${API_BASE_URL}/auth/user-profile/${userId}`;
        console.log('[ProfilePage] User ID:', userId);
        console.log('[ProfilePage] Fetching from URL:', apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('[ProfilePage] Response Status:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log('[ProfilePage] Full API Response:', data);
          // API returns object directly with subscriptions array
          const profileData = data.data || data;
          console.log('[ProfilePage] Response Data:', profileData);
          console.log('[ProfilePage] Subscriptions:', profileData?.subscriptions);
          setApiUserProfile(profileData);
        } else {
          const errorData = await response.json();
          console.log('[ProfilePage] Error Response:', errorData);
        }
      } catch (error) {
        console.log('[ProfilePage] Error fetching user profile:', error);
        console.error('[ProfilePage] Error Details:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Load gaming profile from sessionStorage whenever user changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("sns_gaming_profile");
        if (stored) {
          setGamingProfile(JSON.parse(stored));
        } else {
          setGamingProfile(null);
        }
      } catch {
        setGamingProfile(null);
      }
    }
  }, [user]);

  useEffect(() => {
    // Only redirect if loading is complete and user is not authenticated
    if (loading === false && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-500 text-sm">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  // Use user data from API which includes gaming profile data
  // Merge API profile data with existing user data
  const mergedUser = {
    ...user,
    ...apiUserProfile,
    // Use API data first, fallback to gamingProfile sessionStorage if needed
    username:
      apiUserProfile?.username ||
      user?.username ||
      gamingProfile?.username ||
      user?.fullName ||
      user?.email?.split("@")[0] ||
      "Player",
    bio: apiUserProfile?.bio || user?.bio || gamingProfile?.bio || "",
    primaryGame: apiUserProfile?.primaryGame || apiUserProfile?.primary_game || user?.primaryGame || gamingProfile?.game || "",
    gameRole: apiUserProfile?.gameRole || apiUserProfile?.game_role || user?.gameRole || gamingProfile?.role || "",
    region: apiUserProfile?.region || user?.region || gamingProfile?.region || "",
    rank: apiUserProfile?.rank || user?.rank || gamingProfile?.rank || "",
    discord: apiUserProfile?.discord || user?.discord || gamingProfile?.discord || "",
    avatar: apiUserProfile?.avatar || apiUserProfile?.avatar_url || user?.avatar || "",
    banner: apiUserProfile?.banner || apiUserProfile?.banner_url || user?.banner || "",
    // Legacy fields for compatibility
    game: apiUserProfile?.primaryGame || apiUserProfile?.primary_game || user?.primaryGame || gamingProfile?.game || "",
    role: apiUserProfile?.gameRole || apiUserProfile?.game_role || user?.gameRole || gamingProfile?.role || "",
  };



  return (
    <div className="min-h-screen bg-[#060608] flex flex-col">
      <Header />

      <main className="flex-1 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
        {/* Subtle ambient glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] bg-purple-600/[0.04] rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] sm:w-[400px] lg:w-[500px] h-[350px] sm:h-[400px] lg:h-[500px] bg-pink-600/[0.04] rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]" />
        </div>

        <div className="relative w-full mx-auto max-w-[100%] sm:max-w-[640px] md:max-w-[768px] lg:max-w-5xl xl:max-w-7xl">
          {/* Hero Banner */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <ProfileHeroBanner
              user={mergedUser}
              onEditProfile={() => setEditProfileOpen(true)}
            />
          </div>

          {/* My Scrims + Notifications + Subscriptions Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-6 mb-8 md:mb-10">
            {/* Left Column: My Scrims & Gear Shop (wider on larger screens) */}
          <div className="md:col-span-2 lg:col-span-3 space-y-3 sm:space-y-5 md:space-y-5">
  <MyScrims email={mergedUser?.email} />
  
  {/* Hide on mobile, show on md screens and above */}
  <div className="hidden md:block">
    <ProGearShop />
  </div>
</div>

            {/* Right Column: Notifications & Subscriptions (sidebar on md+) */}
            <div className="md:col-span-1 space-y-4 sm:space-y-6 md:space-y-6">
              <NotificationsPanel />
              <SubscriptionSection userProfile={apiUserProfile} />
            </div>
          </div>

          {/* Events Section - Full Width */}
          <div className="space-y-6 md:space-y-8">
            <EventsSection user={mergedUser} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={mergedUser}
        gamingProfile={gamingProfile}
        onProfileUpdate={(updated) => {
          setGamingProfile(updated);
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "sns_gaming_profile",
              JSON.stringify(updated),
            );
          }
        }}
      />
    </div>
  );
}
