"use client";

import { useEffect, useState } from "react";
import { Plus, X, Shield, Clock, Crosshair } from "lucide-react";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ScrimsPage() {
  const initialFormState = {
    title: "",
    game: "",
    hosted_by: "",
    entry_type: "",
    entry_fee: "",
    game_mode: "",
    platform: "",
    region: "",
    max_teams: "",
    team_size: "",
    rules: "",
    status: "",
    slot_date: "",
  };

  const [scrims, setScrims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState(initialFormState);

  const [slots, setSlots] = useState([
    {
      slot_time: "",
      label: "",
      max_teams: "",
    },
  ]);

  //-----------------------------------
  // Fetch Scrims
  //-----------------------------------
  const fetchScrims = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/scrims`);

      if (!response.ok) {
        throw new Error("Failed to fetch scrims");
      }

      const data = await response.json();

      const scrimArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.scrims)
            ? data.scrims
            : Array.isArray(data?.data?.scrims)
              ? data.data.scrims
              : [];

      setScrims(scrimArray);
    } catch (error) {
      // console.error(error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Failed to fetch scrims.",
      });

      setScrims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrims();
  }, []);

  //-----------------------------------
  // Handle Input Change
  //-----------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //-----------------------------------
  // Slot Handling
  //-----------------------------------
  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];

    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value,
    };

    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        slot_time: "",
        label: "",
        max_teams: "",
      },
    ]);
  };

  const removeSlot = (index) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
  };

  //-----------------------------------
  // Close Modal
  //-----------------------------------
  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormState);

    setSlots([
      {
        slot_time: "",
        label: "",
        max_teams: "",
      },
    ]);
  };

  //-----------------------------------
  // Create Scrim
  //-----------------------------------
  const handleCreateScrim = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);

      if (formData.entry_type === "Paid" && Number(formData.entry_fee) <= 0) {
        throw new Error("Entry fee must be greater than 0 for paid scrims");
      }

      const payload = {
        ...formData,
        entry_fee:
          formData.entry_type === "Paid" ? Number(formData.entry_fee) : 0,

        max_teams: Number(formData.max_teams),
        team_size: Number(formData.team_size),

        slots: JSON.stringify(
          slots.map((slot) => ({
            slot_time: slot.slot_time,
            label: slot.label,
            max_teams: Number(slot.max_teams),
          })),
        ),
      };

      // console.log("Payload:", payload);

      const response = await fetch(`${API_BASE_URL}/scrims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to create scrim");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Scrim created successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal();
      fetchScrims();
    } catch (error) {
      // console.error(error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message || "Please try again later.",
      });
    } finally {
      setCreating(false);
    }
  };

  //-----------------------------------
  // Styles
  //-----------------------------------
  const inputClass =
    "w-full border border-black/20 rounded-xl px-4 py-2.5 !text-black focus:outline-none focus:ring-2 focus:ring-purple-400";

  const labelClass = "block text-sm font-semibold !text-black mb-1";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-white border border-black/10 rounded-2xl p-8 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold !text-black">Scrims</h1>
          <p className="!text-black/70">Create and manage scrims</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Scrim
        </button>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
          <div className="absolute inset-0" onClick={closeModal}></div>

          <div className="min-h-screen flex justify-center items-start p-6 relative">
            <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl z-10 my-6 p-8">
              <button onClick={closeModal} className="absolute right-5 top-5">
                <X className="w-6 h-6 !text-black" />
              </button>

              <h2 className="text-3xl font-bold !text-black mb-8">
                Create Scrim
              </h2>

              <form onSubmit={handleCreateScrim} className="space-y-6">
                {/* Main Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Game</label>
                    <input
                      name="game"
                      value={formData.game}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Hosted By</label>
                    <input
                      name="hosted_by"
                      value={formData.hosted_by}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Entry Type</label>
                    <select
                      name="entry_type"
                      value={formData.entry_type}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select Entry Type</option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {formData.entry_type === "Paid" && (
                    <div>
                      <label className={labelClass}>Entry Fee</label>
                      <input
                        type="number"
                        name="entry_fee"
                        value={formData.entry_fee}
                        onChange={handleChange}
                        className={inputClass}
                        min={1}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Game Mode</label>
                    <input
                      name="game_mode"
                      value={formData.game_mode}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Platform</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select Platform</option>
                      <option value="Mobile">Mobile</option>
                      <option value="PC">PC</option>
                      <option value="Console">Console</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Region</label>
                    <input
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Max Teams</label>
                    <input
                      type="number"
                      name="max_teams"
                      value={formData.max_teams}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Team Size</label>
                    <input
                      type="number"
                      name="team_size"
                      value={formData.team_size}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Slot Date</label>
                    <input
                      type="date"
                      name="slot_date"
                      value={formData.slot_date}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <label className={labelClass}>Rules</label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                    required
                  />
                </div>

                {/* Slots */}
                <div>
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold !text-black">Slots</h3>

                    <button
                      type="button"
                      onClick={addSlot}
                      className="text-purple-600 font-semibold"
                    >
                      Add Slot
                    </button>
                  </div>

                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mb-4"
                    >
                      <input
                        type="time"
                        value={slot.slot_time}
                        onChange={(e) =>
                          handleSlotChange(index, "slot_time", e.target.value)
                        }
                        className={inputClass}
                        required
                      />

                      <input
                        type="text"
                        placeholder="Slot Label"
                        value={slot.label}
                        onChange={(e) =>
                          handleSlotChange(index, "label", e.target.value)
                        }
                        className={inputClass}
                        required
                      />

                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Max Teams"
                          value={slot.max_teams}
                          onChange={(e) =>
                            handleSlotChange(index, "max_teams", e.target.value)
                          }
                          className={inputClass}
                          required
                        />

                        {slots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="text-red-500"
                          >
                            <X />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                >
                  {creating ? "Creating..." : "Create Scrim"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 !text-black">Loading scrims...</div>
      )}

      {/* Scrim List */}
      <div className="grid gap-4">
        {!loading &&
          scrims.map((scrim, index) => (
            <div
              key={index}
              className="bg-white border border-black/10 rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold !text-black">
                    {scrim.title}
                  </h3>

                  <div className="flex gap-4 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-sm !text-black">
                      <Clock className="w-4 h-4" />
                      {scrim.slots?.[0]?.slot_date
                        ? new Date(scrim.slots[0].slot_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "No date"}
                    </span>

                    <span className="flex items-center gap-1 text-sm !text-black">
                      <Crosshair className="w-4 h-4" />
                      {scrim.game_mode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
