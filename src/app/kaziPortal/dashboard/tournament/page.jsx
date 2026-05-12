import { Trophy, Calendar, Users } from "lucide-react";

export default function TournamentPage() {
  const tournaments = [
    { name: "Summer Championship 2026", date: "May 15-20, 2026", status: "Upcoming", participants: 64 },
    { name: "Pro League Qualifier", date: "June 5, 2026", status: "Registration Open", participants: 32 },
    { name: "Weekly Cup #45", date: "May 8, 2026", status: "Ongoing", participants: 128 },
  ];

  return (
    <div className="space-y-6">
      <header className="bg-white border border-black/10 rounded-2xl p-8 shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold !text-gray-900 mb-2">Tournaments</h1>
          <p className="text-gray-500">Manage and view all your tournaments in one place.</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          Create Tournament
        </button>
      </header>

      <div className="grid gap-4">
        {tournaments.map((tournament, idx) => (
          <div key={idx} className="bg-white border border-black/10 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold !text-gray-900">{tournament.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {tournament.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {tournament.participants} Teams</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                tournament.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                tournament.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {tournament.status}
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
