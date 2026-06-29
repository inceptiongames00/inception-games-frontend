import { MessageSquare } from "lucide-react";

export default function CommunityBanner() {
  return (
    <section className="relative overflow-hidden bg-[#070712] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[500px] w-[500px] rounded-full bg-[#00DBE914] blur-[170px]" />
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#FF00CC1F] blur-[180px]" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#00DBE914] blur-[180px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 md:px-0">
        <p className="mb-6 text-center text-[11px] uppercase tracking-[0.55em] text-gray-400">
          ESTABLISHED 2026
        </p>

        <h1 className="text-center text-5xl font-bold leading-tight md:text-7xl">
          Our Community
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-8 text-gray-400 md:text-lg">
          A legacy of high-octane competitive excellence and digital
          <br className="hidden md:block" />
          friendships. Join thousands of passionate gamers and creators
          <br className="hidden md:block" />
          shaping the future of play.
        </p>

        <div className="mt-12 flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center">
          <button className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-white/10 md:w-60">
            Explore Zones
          </button>

          <button className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-white/10 md:w-60">
            Community Works
          </button>

          <button className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-white/10 md:w-60">
            Latest News
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-8 py-4 font-semibold shadow-[0_0_30px_rgba(236,72,153,0.45)] transition hover:opacity-90 md:hidden">
            <MessageSquare className="h-5 w-5" />
            <span>Join Discord</span>
          </button>
        </div>

        <div className="mt-20 overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.04] via-purple-500/[0.05] to-white/[0.04] backdrop-blur-xl">
          <div className="grid w-full grid-cols-3 items-stretch">
            <div className="py-7 text-center">
              <h2 className="text-3xl font-bold">$1,500+</h2>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                Paid Out
              </p>
            </div>

            <div className="relative py-7 text-center before:absolute before:left-0 before:top-1/2 before:h-10 before:w-px before:-translate-y-1/2 before:bg-white/10 after:absolute after:right-0 after:top-1/2 after:h-10 after:w-px after:-translate-y-1/2 after:bg-white/10">
              <h2 className="text-3xl font-bold">5,000+</h2>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                Active Gamers
              </p>
            </div>

            <div className="py-7 text-center">
              <h2 className="text-3xl font-bold">$1,000+</h2>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                Prize Pools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
