"use client";

import { useEffect, useState } from "react";

export default function EsportsUsersTable() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profiles`,
        );
        const data = await res.json();

        setProfiles(data.profiles);
        setFilteredProfiles(data.profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const uniqueGames = [
    ...new Set(
      profiles.map((p) => p.primary_game).filter(Boolean)
    ),
  ];

  const handleFilter = (game) => {
    setSelectedGame(game);
    setCurrentPage(1);

    if (!game) {
      setFilteredProfiles(profiles);
    } else {
      setFilteredProfiles(
        profiles.filter((p) => p.primary_game === game)
      );
    }
  };

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredProfiles.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProfiles.length / usersPerPage);

  return (
    <div className="!text-black max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl !text-black font-semibold">Total Players: ({profiles.length})</h2> 
        {/* Filter */}
        <select
          value={selectedGame}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">All Games</option>
          {uniqueGames.map((game, index) => (
            <option key={index} value={game}>
              {game}
            </option>
          ))}
        </select>
      </div>

      {/* Table Wrapper (Responsive) */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">SL No</th>
              <th className="px-4 py-3 font-medium">Full Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Game</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  {indexOfFirst + index + 1}
                </td>
                <td className="px-4 py-3">
                  {user.full_name || "N/A"}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  {user.primary_game || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}