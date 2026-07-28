"use client";

import { useEffect } from "react";
import Header from "../components/Header";
import CommunityBanner from "./communityBanner";
import UpcomingComEvents from "./upcomingComEvents";
import EShop from "../components/EShop";
import LatestNews from "./latestNews";
import NewsPoster from "./NewsPoster";

export default function CommunityLayout({ children }) {
  useEffect(() => {
    if (window.location.hash === "#news") {
      const element = document.getElementById("latest-news");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, []);

  return (
    <div>
      <Header />
      <CommunityBanner />
      <UpcomingComEvents />
      <EShop />
      <LatestNews />
      <NewsPoster />
      {children}
    </div>
  );
}
