"use client";

const games = [
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145859/brand-1_pdv3n5.webp",
    alt: "Dota 2",
    color: "#E2231A",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145855/brand-10_bkvtk4.webp",
    alt: "Street Fighter",
    color: "#FFD400",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145857/brand-11_pv0jzb.webp",
    alt: "Tekken",
    color: "#FF5A00",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145861/brand-2_k1erag.webp",
    alt: "Fortnite",
    color: "#00B7FF",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145862/brand-3_linwku.webp",
    alt: "Counter Strike 2",
    color: "#F59E0B",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145863/brand-4_msjc4u.webp",
    alt: "Free Fire",
    color: "#FF6B00",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145865/brand-5_icbfvs.webp",
    alt: "eFootball",
    color: "#005CFF",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145866/brand-7_esymyl.webp",
    alt: "Valorant",
    color: "#FF4655",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145854/brand-8_yjgbw0.webp",
    alt: "EA Sports",
    color: "#00A3FF",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145853/brand-9_uvpdi7.webp",
    alt: "League of Legends",
    color: "#C89B3C",
  },
  {
    src: "https://res.cloudinary.com/jvpygp4b/image/upload/v1783145858/brand-pubg_hjrplb.webp",
    alt: "PUBG Mobile",
    color: "#F2A900",
  },
];

export default function AllGamesLoop() {
  const loop = [...games, ...games];

  return (
    <section className="all-games-marquee">
      <div className="fade fade--left" />
      <div className="fade fade--right" />

      <div className="marquee-track">
        {loop.map((game, i) => (
          <div
            className="game-pill"
            key={i}
            style={{ "--hover-color": game.color }}
          >
            <img src={game.src} alt={game.alt} draggable={false} />
          </div>
        ))}
      </div>

      <style>{`
        .all-games-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, #0a0a14 0%, #0f0f1a 100%);
          padding: 18px 0;
        }

        .fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 10;
          pointer-events: none;
        }

        .fade--left {
          left: 0;
          background: linear-gradient(to right, #12082a, transparent);
        }

        .fade--right {
          right: 0;
          background: linear-gradient(to left, #12082a, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .game-pill {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 80px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(6px);
          transition: all 0.35s ease;
          cursor: pointer;
          padding: 14px 24px;
          position: relative;
          overflow: hidden;
        }

        /* hidden color layer initially */
        .game-pill::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--hover-color);
          opacity: 0;
          transition: opacity 0.35s ease;
          z-index: 0;
        }

        /* show color only on hover */
        .game-pill:hover::before {
          opacity: 0.18;
        }

        .game-pill:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: var(--hover-color);
          box-shadow: 0 0 25px var(--hover-color);
        }

        .game-pill img {
          position: relative;
          z-index: 2;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: brightness(0.75) grayscale(0.25);
          transition: all 0.35s ease;
          user-select: none;
        }

        .game-pill:hover img {
          filter: brightness(1) grayscale(0);
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
