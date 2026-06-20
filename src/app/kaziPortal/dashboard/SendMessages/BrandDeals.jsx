"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function GameOnly() {
  const [gameName, setGameName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const payload = {
        game_name: gameName,
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
      setGameName("");
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
      <h2 className="text-xl font-bold !text-black mb-4">Brand Deals</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Game Name */}
        <div>
        
          <label className="block !text-black mb-2 font-medium">
            Game Name
          </label>

          <select
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black bg-white"
            required
          >
            <option value="">Select Game</option>

            <option value="CS2">CS2</option>
            <option value="Valorant">Valorant</option>
            <option value="PUBG Mobile">PUBG Mobile</option>
            <option value="Call of Duty Warzone">Call of Duty Warzone</option>
            <option value="Call of Duty Black Ops 7 PC">
              Call of Duty Black Ops 7 PC
            </option>
            <option value="Dota 2">Dota 2</option>
            <option value="League of Legends">League of Legends</option>
            <option value="EA Sports FC">EA Sports FC</option>
            <option value="eFootball">eFootball</option>
            <option value="Street Fighter 6">Street Fighter 6</option>
            <option value="Chess">Chess</option>
            <option value="Rocket League">Rocket League</option>
            <option value="Free Fire">Free Fire</option>
            <option value="Honor of Kings">Honor of Kings</option>
            <option value="Mobile Legends Bang Bang">
              Mobile Legends Bang Bang
            </option>
            <option value="League of Legends Mobile">
              League of Legends Mobile
            </option>
            <option value="Valorant Mobile">Valorant Mobile</option>
            <option value="eFootball Mobile">eFootball Mobile</option>
            <option value="Delta Force">Delta Force</option>
            <option value="Clash of Clans">Clash of Clans</option>
            <option value="Clash Royale">Clash Royale</option>
            <option value="Call of Duty Mobile">Call of Duty Mobile</option>
            <option value="Overwatch 2">Overwatch 2</option>
          </select>
          
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
