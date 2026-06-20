"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://inception-games.an.r.appspot.com/api/v1/cms/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Wrong credentials. Please check your email and password.");
        return;
      }

      const data = await response.json();

      if (data && (data.token || response.ok)) {
        router.push("/kaziPortal/dashboard");
      } else {
        toast.error("Wrong credentials. Please check your email and password.");
      }
    } catch (error) {
      toast.error("Wrong credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `linear-gradient(#ddd 1px, transparent 1px),
          linear-gradient(90deg, #ddd 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    >
      <div className="w-full max-w-md bg-white border border-black/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold  text-center mb-2 !text-gray-900">
          Login
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg 
             bg-gradient-to-r from-purple-500 to-pink-500 
             hover:from-purple-600 hover:to-pink-600 
             transition-all duration-300 
             text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={4000} hideProgressBar closeOnClick pauseOnHover draggable pauseOnFocusLoss />
    </div>
  );
}
