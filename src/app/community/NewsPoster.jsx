"use client";

import { useState } from "react";

export default function NewsPoster() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
      <div className="relative w-full max-w-4xl bg-[#16181f] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5">

        {/* Left — Character image panel */}
        <div className="relative w-full md:w-[45%] min-h-[280px] md:min-h-[420px] flex-shrink-0 bg-[#0c0d11]">
          {/* Corner accent */}
          <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#FF34CD] rounded-tl z-10" />

          {/* Replace src with your actual image path */}
          <img
            src="https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg"
            alt="Operative"
            className="w-full h-full object-cover object-center opacity-90"
            style={{ filter: "grayscale(15%) contrast(1.05)" }}
          />

          {/* Bottom HUD labels */}
          <div className="absolute bottom-4 left-4 z-10 space-y-0.5">
            <p className="text-[10px] tracking-[0.2em] text-[#FF34CD] font-mono uppercase">
              Signal: Stable
            </p>
            <p className="text-[9px] tracking-[0.15em] text-white/30 font-mono uppercase">
              User_ID: NP_9923_Alpha
            </p>
          </div>

          {/* Subtle gradient overlay to blend into right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#16181f] pointer-events-none" />
        </div>

        {/* Right — Content panel */}
        <div className="flex flex-col justify-center px-8 py-10 md:py-12 flex-1">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#FF34CD] text-base leading-none">✉</span>
            <span className="text-[10px] tracking-[0.2em] font-semibold text-[#FF34CD] uppercase font-mono">
              Stay in the Loop
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-white text-3xl md:text-[2rem] font-bold leading-tight mb-3 tracking-tight">
            Level Up Your<br />News
          </h2>

          {/* Body */}
          <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-xs">
            Get exclusive tournament invites, developer insights, and community
            highlights delivered straight to your inbox.
          </p>

          {/* Email input */}
          {!submitted ? (
            <>
              <div className="flex items-center gap-3 bg-[#1e2029] border border-white/10 rounded-lg px-4 py-3 mb-3 focus-within:border-[#e040fb]/50 transition-colors">
                <svg
                  className="w-4 h-4 text-white/30 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Enter your email"
                  className="bg-transparent text-white/70 text-sm placeholder-white/25 outline-none w-full"
                />
              </div>

              {/* CTA button */}
              <button
                onClick={handleSubscribe}
                className="w-full bg-[#FF34CD]  active:scale-[0.98] text-white text-xs font-bold tracking-[0.15em] uppercase py-3.5 rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
              >
                Subscribe Now
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </>
          ) : (
            <div className="bg-[#e040fb]/10 border border-[#e040fb]/30 rounded-lg px-5 py-4 text-center">
              <p className="text-[#e040fb] text-sm font-semibold tracking-wide">
                You're in. Welcome to the loop.
              </p>
            </div>
          )}

          {/* Privacy note */}
          <p className="flex items-center gap-1.5 text-white/25 text-[11px] mt-4">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}