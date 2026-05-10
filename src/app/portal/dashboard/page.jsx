"use client";
import { useState } from "react";
import EsportsUsersTable from "./components/EsportsUsersTable";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(null);

  const stats = [
    {
      id: "esports-users",
      title: "Esports platform User",
      value: "1500",
      subtitle: "Active player",
    },
    {
      id: "total-tournaments",
      title: "Total Tournaments",
      value: "12",
      subtitle: "Participated events",
    },
    {
      id: "total-scrims",
      title: "Total Scrims",
      value: "8",
      subtitle: "Active scrim matches",
    },
    {
      id: "total-brands",
      title: "Total Brand Deals",
      value: "5",
      subtitle: "Current partnerships",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-white border border-black/10 rounded-2xl p-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold !text-gray-900 mb-2">
            Overview Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome to your portal. Here is a quick summary of your activities.
          </p>
        </div>
        {activeTab && (
          <button 
            onClick={() => setActiveTab(null)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            Clear Selection
          </button>
        )}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => setActiveTab(activeTab === stat.id ? null : stat.id)}
            className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 ${
              activeTab === stat.id 
                ? "border-purple-500 ring-4 ring-purple-500/10" 
                : "border-black/10"
            }`}
          >
            <h3 className="!text-gray-500 text-sm font-medium mb-2">
              {stat.title}
            </h3>

            <p className="text-4xl font-bold text-gray-900 mb-2">
              {stat.value}
            </p>

            <p className="text-sm text-purple-600 font-medium">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Dynamic Content Area */}
      {activeTab === "esports-users" && <EsportsUsersTable />}
      
      {activeTab && activeTab !== "esports-users" && (
        <div className="bg-white border border-black/10 rounded-2xl p-12 shadow-lg text-center mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data not available</h2>
          <p className="text-gray-500 max-w-md mx-auto">The table for this section is currently under development. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
