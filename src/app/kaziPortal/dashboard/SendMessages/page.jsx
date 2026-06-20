"use client";

import { useState } from "react";
import AllPlayersAcrossAllTournament from "./CentralMessage";
import GameAndTournament from "./Tournament";
import TournamentOnly from "./Scrims";
import GameOnly from "./BrandDeals";

export default function SendMessagesPage() {
  const [selectedType, setSelectedType] = useState("allPlayers");

  const renderComponent = () => {
    switch (selectedType) {
      case "allPlayers":
        return <AllPlayersAcrossAllTournament />;
      case "gameAndTournament":
        return <GameAndTournament />;
      case "tournamentOnly":
        return <TournamentOnly />;
      case "gameOnly":
        return <GameOnly />;
      default:
        return <AllPlayersAcrossAllTournament />;
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold !text-black">Send Messages</h1>
          <p className="text-gray-500 mt-2">
            Send direct notifications to selected gamers.
          </p>
        </div>

        {/* Message Type Selector */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <label className="block mb-2 font-medium !text-black">
            Select Message Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          >
            <option value="allPlayers">Central Notification</option>
            <option value="gameAndTournament">Tournament</option>
            <option value="tournamentOnly">Scrims</option>
            <option value="gameOnly">Brand Deals</option>
          </select>
        </div>

        {/* Render Selected Component */}
        {renderComponent()}
      </div>
    </div>
  );
}
