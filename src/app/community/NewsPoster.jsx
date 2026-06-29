"use client";

import { useState } from "react";
import Image from "next/image";

export default function NewsPoster() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-zinc-950 flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="relative w-full max-w-4xl bg-zinc-900/50 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 backdrop-blur-sm">

        {/* Left — Character image panel */}
        <div className="relative w-full md:w-[45%] min-h-[250px] sm:min-h-[300px] md:min-h-[480px] flex-shrink-0 bg-zinc-900">
          {/* Corner accent */}
          <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl z-10" />

          {/* Image */}
          <Image
            src="https://res.cloudinary.com/dpwjt3jxx/image/upload/v1782524556/71RgJZeOr-L._AC_UF894_1000_QL80__koq6v3.jpg"
            alt="Operative"
            fill
            className="object-cover object-center opacity-90"
            style={{ filter: "grayscale(15%) contrast(1.05)" }}
          />

          {/* Bottom HUD labels */}
          <div className="absolute bottom-4 left-4 z-10 space-y-0.5">
            <p className="text-[10px] sm:text-[11px] tracking-widest text-purple-300 font-mono uppercase">
              Signal: Stable
            </p>
            <p className="text-[9px] sm:text-[10px] tracking-wider text-white/30 font-mono uppercase">
              User_ID: NP_9923_Alpha
            </p>
          </div>

          {/* Subtle gradient overlay to blend into right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900/50 pointer-events-none" />
        </div>

        {/* Right — Content panel */}
        <div className="flex flex-col justify-center px-6 sm:px-8 py-8 sm:py-10 md:py-12 flex-1">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-pink-400 text-base leading-none">✉</span>
            <span className="text-xs tracking-widest font-semibold text-pink-300 uppercase">
              Stay in the Loop
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3 tracking-tight">
            Level Up Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 block">
              News
            </span>
          </h2>

          {/* Body */}
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-7 max-w-xs">
            Get exclusive tournament invites, developer insights, and community
            highlights delivered straight to your inbox.
          </p>

          {/* Email input */}
          {!submitted ? (
            <>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-3 focus-within:border-purple-500/50 transition-colors">
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
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase py-3 sm:py-3.5 rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
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
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-5 py-4 text-center">
              <p className="text-purple-300 text-sm font-semibold tracking-wider">
                You're in. Welcome to the loop.
              </p>
            </div>
          )}

          {/* Privacy note */}
          <p className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs mt-4">
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
