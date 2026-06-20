"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ScrimsTable() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const usersPerPage = 10;

  useEffect(() => {
    const fetchScrims = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/participants/scrims`,
        );
        const data = await res.json();
        const mapped = (data.registrations || []).map((item) => ({
          fullName: item.full_name,
          email: item.email,
          phone: item.phone,
          game: item.scrim_game,
        }));

        setRegistrations(mapped);
        setFilteredRegistrations(mapped);
      } catch (error) {
        console.error("Error fetching scrims registrations:", error);
      }
    };

    fetchScrims();
  }, []);

  const uniqueGames = [
    ...new Set(registrations.map((p) => p.game).filter(Boolean)),
  ];

  // const handleFilter = (game) => {
  //   setSelectedGame(game);
  //   setCurrentPage(1);

  //   if (!game) {
  //     setFilteredRegistrations(registrations);
  //   } else {
  //     setFilteredRegistrations(registrations.filter((p) => p.game === game));
  //   }
  // };

  const handleFilter = (game, search = searchTerm) => {
    setSelectedGame(game);
    setCurrentPage(1);

    let filtered = registrations;

    if (game) {
      filtered = filtered.filter((p) => p.game === game);
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          p.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredRegistrations(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);

    let filtered = registrations;

    if (selectedGame) {
      filtered = filtered.filter((p) => p.game === selectedGame);
    }

    if (value) {
      filtered = filtered.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(value.toLowerCase()) ||
          p.email?.toLowerCase().includes(value.toLowerCase()),
      );
    }

    setFilteredRegistrations(filtered);
  };
  const exportToExcel = () => {
    const exportData = filteredRegistrations.map((user, index) => ({
      "SL No": index + 1,
      "Full Name": user.fullName || "N/A",
      Email: user.email,
      Number: user.phone,
      Game: user.game || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Scrim Participants");

    XLSX.writeFile(workbook, "scrim_participants.xlsx");
  };

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredRegistrations.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredRegistrations.length / usersPerPage);

  return (
    <div className="!text-black max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div>
          <p className="text-xl font-bold text-black mt-1">
            Total Scrim Participants: ({registrations.length})
          </p>
        </div>

        {/* Filter & Export  & search*/}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          />

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

          <button
            onClick={exportToExcel}
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Table Wrapper (Responsive) */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">SL No</th>
              <th className="px-4 py-3 font-medium">Full Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Game</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={`${user.email}-${currentPage}-${index}`}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{indexOfFirst + index + 1}</td>
                <td className="px-4 py-3">{user.fullName || "N/A"}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">{user.game || "N/A"}</td>
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
