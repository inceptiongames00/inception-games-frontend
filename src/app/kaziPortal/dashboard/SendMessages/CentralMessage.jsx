"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function AllPlayersAcrossAllTournament() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
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
        send_to_all_users: true,
        subject: subject,
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
        throw new Error("Failed to send message");
      }

      setResponseData(data);

      Swal.fire({
        title: "Message Sent Successfully!",
        icon: "success",
        draggable: true,
        confirmButtonColor: "#000",
      });

      // reset form after success
      setSubject("");
      setMessage("");
    } catch (err) {
      // console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold !text-black mb-4">
      Central Message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* subject */}
        <div>
          <label className="block !text-black mb-2 font-medium">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject"
            className="w-full !text-black border rounded-xl px-2 py-2 outline-none focus:ring-2 focus:ring-black"
            required
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
