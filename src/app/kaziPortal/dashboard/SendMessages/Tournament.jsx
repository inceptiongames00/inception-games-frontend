"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Tournament() {
  const [tournamentId, setTournamentId] = useState("");
  const [gameName, setGameName] = useState("");
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const handleRoomDetailsChange = (id, password) => {
    const generatedMessage = `Your Room ID is ${id} , Your Password is ${password}`;

    setMessage(generatedMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const payload = {
        tournament_id: tournamentId,
        message: message,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/message/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setResponseData(data);

      Swal.fire({
        title: "Message Sent Successfully!",
        icon: "success",
        draggable: true,
        confirmButtonColor: "#000",
      });

      // reset form after success
      setTournamentId("");
      setGameName("");
      setRoomId("");
      setRoomPassword("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold !text-black mb-4">
        Game and Tournament
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tournament ID */}
        <div>
          <label className="block mb-2 font-medium !text-black">
            Tournament ID
          </label>
          <input
            type="text"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            placeholder="Enter tournament ID"
            className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Room ID */}
        <div>
          <label className="block mb-2 font-medium !text-black">Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => {
              const value = e.target.value;
              setRoomId(value);
              handleRoomDetailsChange(value, roomPassword);
            }}
            placeholder="Enter room ID"
            className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Room Password */}
        <div>
          <label className="block mb-2 font-medium !text-black">
            Room Password
          </label>
          <input
            type="text"
            value={roomPassword}
            onChange={(e) => {
              const value = e.target.value;
              setRoomPassword(value);
              handleRoomDetailsChange(roomId, value);
            }}
            placeholder="Enter room password"
            className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block !text-black mb-2 font-medium">Message</label>
          <textarea
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification message..."
            className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 font-medium text-sm">{error}</div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black !text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 !text-black h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 text-white h-5" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
