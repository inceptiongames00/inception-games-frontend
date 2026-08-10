"use client";

export default function EShop() {
  const products = [
    {
      category: "KEYBOARD",
      title: "Elite Mechanical Keyboard",
      description: "Precision engineering for the competitive edge.",
      buttonText: "Buy",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783578421/the-best-mechanical-keyboards-for-2026_mx8v.1200_g2gojo.png",
    },
    {
      category: "MOUSE",
      title: "Precision Wireless Mouse",
      description: "Ultra-lightweight, zero-latency performance.",
      buttonText: "Buy",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783578420/the-best-wireless-gaming-mice-for-2026_zfnb_dfibbh.jpg",
    },
    {
      category: "DISPLAY",
      title: "Ultra-Wide Curved Monitor",
      description: "Immersive visuals with 240Hz refresh rate.",
      buttonText: "Buy",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783578422/innocn-49q1s-hero_hxgkun.png",
    },
    {
      category: "BUNDLE",
      title: "Pro Gaming Bundle",
      description: "The ultimate setup for professional play.",
      buttonText: "Shop the Bundle",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783578420/AaFxEQhuDaoZ5roSScyVXP-998-80_w6ub86.jpg",
    },
  ];

  return (
    <section id="explore-merchandise" className="py-20 px-4 sm:px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            EXPLORE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              MERCHANDISE
            </span>
          </h2>
          {/* Underline accent */}
          <div className="flex justify-center gap-2 mt-4 mb-6">
            <div className="w-70 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          </div>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Level up your setup with exclusive Neon Pulse merchandise and
            high-performance
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="relative mx-auto max-w-7xl rounded-lg overflow-hidden">
          {/* Background with gradient and backdrop blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm" />
          
          {/* Content */}
          <div className="relative z-10 px-6 sm:px-12 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
            {/* Coming Soon Badge */}
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
              <span className="text-sm font-bold text-white uppercase tracking-widest">Coming Soon</span>
            </div>
            
            {/* Main Text */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Gear Shop Coming Soon
              </span>
            </h3>
            
            <p className="text-zinc-400 text-base sm:text-lg max-w-md mb-8">
             Get ready for premium gaming gear, apparel, accessories, and exclusive collections.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes eshop-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-eshop-scroll {
          animation: eshop-scroll 50s linear infinite;
        }

        .animate-eshop-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
