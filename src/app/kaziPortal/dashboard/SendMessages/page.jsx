"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function SendMessagesPage() {
  const [emails, setEmails] = useState("");
  const [gameName, setGameName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [tournamentId, setTournamentId] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const payload = {
        // emails: emails
        //   .split(",")
        //   .map((email) => email.trim())
        //   .filter((email) => email !== ""),
        tournament_id: tournamentId,
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
        // text: `Sent to ${data.summary.total_recipients} recipients`,
        icon: "success",
        draggable: true,
        confirmButtonColor: "#000",
      });

      // reset form after success
      // setEmails("");
      setTournamentId("");
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
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold !text-black">Send Messages</h1>
          <p className="text-gray-500 mt-2">
            Send direct notifications to selected gamers.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Emails */}
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

            {/* Game Name */}
            <div>
              <label className="block !text-black mb-2 font-medium">
                Game Name
              </label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="eg.BGMI"
                className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block !text-black mb-2 font-medium">
                Message
              </label>
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

        {/* Success Result */}
        {/* {responseData && (
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <h2 className="!text-green-600 font-bold text-xl mb-4">
              Message Sent Successfully ✅
            </h2>

            <p className="!text-black">
              <strong className="!text-black">Total Recipients:</strong>{" "}
              {responseData.summary.total_recipients}
            </p>

            <p className="!text-black">
              <strong className="!text-black">Game Name:</strong>{" "}
              {responseData.summary.game_name}
            </p>

            <p className="mb-4 !text-black">
              <strong>Message Preview:</strong>{" "}
              {responseData.summary.message_preview}
            </p>

            <div className="space-y-3 !text-black">
              {responseData.sent_to.map((user) => (
                <div
                  key={user.message_id}
                  className="border rounded-xl p-4"
                >
                  <p>
                    <strong>Name:</strong>{" "}
                    {user.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {user.email}
                  </p>
                  <p>
                    <strong>User ID:</strong>{" "}
                    {user.id}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Sent at: {responseData.timestamp}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
