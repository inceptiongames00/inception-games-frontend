"use client";

export default function EShop() {
  const products = [
    {
      category: "KEYBOARD",
      title: "Elite Mechanical Keyboard",
      description: "Precision engineering for the competitive edge.",
      buttonText: "Buy",
      image: "/News/showcase.jpg",
    },
    {
      category: "MOUSE",
      title: "Precision Wireless Mouse",
      description: "Ultra-lightweight, zero-latency performance.",
      buttonText: "Buy",
      image: "/News/news3.jpg",
    },
    {
      category: "DISPLAY",
      title: "Ultra-Wide Curved Monitor",
      description: "Immersive visuals with 240Hz refresh rate.",
      buttonText: "Buy",
      image: "/News/news4.jpg",
    },
    {
      category: "BUNDLE",
      title: "Pro Gaming Bundle",
      description: "The ultimate setup for professional play.",
      buttonText: "Shop the Bundle",
      image: "/News/summit.jpg",
    },
  ];

  return (
    <section className="py-0 px-4 sm:px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
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
          {/* Coming Soon Badge */}
          <div className="flex justify-center mt-5 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm font-semibold text-yellow-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
              Merchandise Store Coming Soon
            </span>
          </div>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            We're preparing premium gaming merchandise and exclusive
            collectibles. Stay tuned for the official launch.
          </p>
        </div>

        {/* Carousel Container */}
        {false && (
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>

            {/* Auto-scrolling container */}
            <div className="flex animate-eshop-scroll gap-4 sm:gap-6">
              {/* First set of products */}
              {products.map((product, index) => (
                <div
                  key={`product-1-${index}`}
                  className="flex-shrink-0 w-64 sm:w-72 md:w-80 group cursor-pointer"
                >
                  {/* Card */}
                  <div className="rounded-3xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-2xl h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 hover:border-zinc-700/50">
                    {/* Image Section */}
                    <div
                      className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${product.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/30 text-pink-300 border border-pink-500/50 backdrop-blur-sm">
                        {product.category}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                          {product.title}
                        </h3>
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Buy Button */}
                      <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                        {product.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {products.map((product, index) => (
                <div
                  key={`product-2-${index}`}
                  className="flex-shrink-0 w-64 sm:w-72 md:w-80 group cursor-pointer"
                >
                  {/* Card */}
                  <div className="rounded-3xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-2xl h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 hover:border-zinc-700/50">
                    {/* Image Section */}
                    <div
                      className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: `url('${product.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/30 text-pink-300 border border-pink-500/50 backdrop-blur-sm">
                        {product.category}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                          {product.title}
                        </h3>
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Buy Button */}
                      <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                        {product.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* <style jsx>{`
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
      `}</style> */}
    </section>
  );
}
