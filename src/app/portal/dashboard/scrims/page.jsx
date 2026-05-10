import { Crosshair, Clock, Shield } from "lucide-react";

export default function ScrimsPage() {
  const scrims = [
    {
      team: "Team Alpha",
      time: "Tonight, 20:00 EST",
      mode: "5v5 Competitive",
      status: "Confirmed",
    },
    {
      team: "Beta Squad",
      time: "Tomorrow, 18:00 EST",
      mode: "Best of 3",
      status: "Pending",
    },
    {
      team: "Gamma Gaming",
      time: "May 6, 21:00 EST",
      mode: "Practice Draft",
      status: "Looking for Opponent",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-white border border-black/10 rounded-2xl p-8 shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold !text-gray-900 mb-2">
            Scrims
          </h1>
          <p className="text-gray-500">
            Schedule and manage your scrim matches in one place.
          </p>
        </div>

        <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          Create Scrim
        </button>
      </header>

      {/* Scrim Cards */}
      <div className="grid gap-4">
        {scrims.map((scrim, idx) => (
          <div
            key={idx}
            className="bg-white border border-black/10 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left Content */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Shield className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold !text-gray-900">
                  {scrim.team}
                </h3>

                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {scrim.time}
                  </span>

                  <span className="flex items-center gap-1">
                    <Crosshair className="w-4 h-4" />
                    {scrim.mode}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  scrim.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : scrim.status === "Pending"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {scrim.status}
              </span>

              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}