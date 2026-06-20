"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function CreateUserPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const roles = ["super_admin", "admin", "moderator", "editor", "viewer"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill in all required fields.",
      });
    }

    setLoading(true);

    try {
      const payload = {
        actor_role: "super_admin",
        full_name: fullName,
        email,
        password,
        role,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || `Request failed with status ${res.status}`,
        );
      }

      Swal.fire({
        icon: "success",
        title: "User created",
        text: "The user was created successfully.",
      });

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("admin");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "An error occurred while creating the user.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white border border-black/10 rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold !text-gray-900">Create User</h1>
          <p className="text-gray-500 mt-1">
            Create a new portal user with role-based access.
          </p>
        </header>

        <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-md w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block  font-medium text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block  font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter you email"
                required
              />
            </div>

            <div>
              <label className="block  font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter a secure password"
                required
              />
            </div>

            <div>
              <label className="block  font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black !text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
