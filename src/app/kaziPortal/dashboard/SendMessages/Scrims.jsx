"use client";

import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Scrims() {
  const [organizerScrimId, setOrganizerScrimId] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [message, setMessage] = useState("");
  const [gameName, setGameName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const [scrims, setScrims] = useState([]);
  const [loadingScrims, setLoadingScrims] = useState(true);
  const [selectedScrimId, setSelectedScrimId] = useState("");

  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const fetchScrims = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/scrims`,
        );

        const data = await response.json();

        setScrims(data.scrims || []);
      } catch (error) {
        console.error("Failed to fetch scrims:", error);
      } finally {
        setLoadingScrims(false);
      }
    };

    fetchScrims();
  }, []);

  const handleRoomDetailsChange = (roomId, password) => {
    const generatedMessage = `
Your Room ID is ${roomId},
Your Password is ${password}
`;
    setMessage(generatedMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseData(null);

    try {
      const payload = {
        scrim_id: organizerScrimId,
        slot_date: slotDate,
        slot_time: slotTime,
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
      setOrganizerScrimId("");
      setRoomId("");
      setRoomPassword("");
      setMessage("");
      setSlotDate("");
      setSlotTime("");
      // setGameName("");
    } catch (err) {
      // console.error(err);
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold !text-black mb-4">Scrim</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organizer Scrim ID */}
        {/*  <div>
            <label className="block mb-2 font-medium !text-black">
              Organizer Scrim ID
            </label>

            <input
              type="text"
              value={organizerScrimId}
              onChange={(e) => setOrganizerScrimId(e.target.value)}
              placeholder="Enter organizer scrim ID"
              className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
             
            />
          </div>
          */}

          {/* Game Name */}
          <div>
            <label className="block !text-black mb-2 font-medium">
              Game Name
            </label>

            <select
              value={selectedScrimId}
              onChange={(e) => {
                const scrimId = Number(e.target.value);

                setSelectedScrimId(scrimId);

                const selectedScrim = scrims.find(
                  (scrim) => scrim.id === scrimId,
                );

                if (!selectedScrim) return;

                setGameName(selectedScrim.game);

                const uniqueDates = [
                  ...new Set(
                    selectedScrim.slots.map(
                      (slot) => slot.slot_date.split("T")[0],
                    ),
                  ),
                ];

                setAvailableDates(uniqueDates);

                setSlotDate("");
                setSlotTime("");

                setAvailableTimes([]);
              }}
              className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black bg-white"
              required
            >
              <option value="">Select Game</option>

              {scrims.map((scrim) => (
                <option key={scrim.id} value={scrim.id}>
                  {scrim.game}
                </option>
              ))}
            </select>
          </div>

          {/* slot time and date  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slot Date */}
            <div>
              <label className="block mb-2 font-medium !text-black">
                Slot Date
              </label>

              <select
                value={slotDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;

                  setSlotDate(selectedDate);

                  const selectedScrim = scrims.find(
                    (scrim) => scrim.game === gameName,
                  );

                  if (!selectedScrim) return;

                  const times = selectedScrim.slots
                    .filter(
                      (slot) => slot.slot_date.split("T")[0] === selectedDate,
                    )
                    .map((slot) => slot.slot_time);

                  setAvailableTimes(times);

                  setSlotTime("");
                }}
                className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Date</option>

                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {/* Slot Time */}
            <div>
              <label className="block mb-2 font-medium !text-black">
                Slot Time
              </label>

              <select
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full !text-black border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Time</option>

                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* room and password  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room ID */}
            <div>
              <label className="block mb-2 font-medium !text-black">
                Room ID
              </label>
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
    </>
  );
}
