"use client";

export default function TrustedBrands() {
  const brands = [
    {
      name: "Bangladesh Hi-Tech Park Authority",
      logo: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147392/bangladesh-hitech_chniu2.png",
    },
    {
      name: "IDEB",
      logo: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147398/ideb_exytob.png",
    },
    {
      name: "The World Bank",
      logo: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147390/world-bank_vpopdt.png",
    },
    {
      name: "ICT Division",
      logo: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147395/ict-division_scveaw.png",
    },
    {
      name: "Accelerating Bangladesh",
      logo: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783147387/accelerating-bangladesh_lp6znp.png",
    },
  ];

  return (
    <section className="py-16 overflow-hidden bg-gradient-to-b from-[#0a0a14] to-[#1a0a2e]">
      <div className="container mx-auto px-4 mb-8 text-center">
        {/* <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">SUPPORTED BY </h2> */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          CERTIFIED{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            BY
          </span>
        </h2>
        {/* Underline accent */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-50 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
        </div>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-r from-[#1a0a2e] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 bg-gradient-to-l from-[#1a0a2e] to-transparent z-10"></div>

        {/* Infinite scrolling container */}
        <div className="flex animate-infinite-scroll">
          {/* First set of logos */}
          {brands.map((brand, index) => (
            <div
              key={`brand-1-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
              style={{ width: "220px", height: "90px" }}
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 rounded-lg"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {brands.map((brand, index) => (
            <div
              key={`brand-2-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
              style={{ width: "220px", height: "90px" }}
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
