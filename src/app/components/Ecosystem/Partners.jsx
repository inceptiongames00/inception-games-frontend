"use client";

import React from "react";
import Image from "next/image";

export const partnersData = {
  title: "Our Partners",
  subtitle: "Trusted collaborations that power our ecosystem",
  items: [
    {
      id: 1,
      name: "Ifarmer",
      photo: "/Ecosystem/Partners/ifarmer2.jpeg",
      type: "image",
      link: "https://www.ifarmer.asia",
      caption: {
        normalText: "31,000+ Active Users powering ",
        highlightText:
          '"ভাগ্যের ছক্কা" Ludo Arcade — in collaboration with iFarmer (Folon App).',
      },
    },
    {
      id: 2,
      name: "Mime",
      photo: "/Ecosystem/Partners/MIME.jpeg",
      link: "https://www.mimebd.com",
      caption: {
        normalText: "Mime is our official Internet Sponsor — ",
        highlightText:
          "powering seamless connectivity for every gamer in the ecosystem.",
      },
    },
    {
      id: 3,
      name: "Moar",
      photo: "/Ecosystem/Partners/MOAR.png",
      video: "/Ecosystem/Partners/MOAR.mp4",
      isVideo: false,
      link: "https://moarbd.com",
      imageStyle: {
        objectFit: "contain",
      },
      caption: {
        normalText: "Moar fuels the competitive spirit — ",
        highlightText:
          "They are our social media ads partner. We made game engine based ads for them.",
      },
    },
  ],
};

export function PartnerCard({ item, isFeatured = false }) {
  const [hovered, setHovered] = React.useState(false);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (item.isVideo && videoRef.current) {
      const video = videoRef.current;

      video.muted = true;
      video.defaultMuted = true;

      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.log("Autoplay blocked:", err);
        }
      };

      video.addEventListener("loadeddata", playVideo);

      playVideo();

      return () => {
        video.removeEventListener("loadeddata", playVideo);
      };
    }
  }, [item.isVideo]);

  const handleClick = () => {
    window.open(item.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: isFeatured ? "650px" : "420px",
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "all 0.4s ease",
        transform: hovered ? "translateY(-12px)" : "translateY(0)",
        cursor: "pointer",
        background: "#111",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          height: isFeatured ? "65%" : "80%",
          position: "relative",
          textDecoration: "none",
          display: "block",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {item.isVideo ? (
            <video
              key={item.video}
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              webkit-playsinline="true"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={item.video} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={item.photo}
              alt={item.name}
              fill
              unoptimized
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw"
              style={{
                objectFit: "cover",
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.4s ease",
              }}
            />
          )}
        </div>
      </a>

      <div
        style={{
          // height: isFeatured ? "35%" : "20%",
          padding: isFeatured ? "1rem" : "0.75rem",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
        }}
      >
        <p
          style={{
            color: "#fff",
            margin: 0,
            fontSize: isFeatured ? "0.95rem" : "0.85rem",
            lineHeight: 1.4,
          }}
        >
          {item.caption.normalText}

          <span
            style={{
              color: "#FFD700",
              display: "block",
              marginTop: "0.25rem",
              fontWeight: 600,
            }}
          >
            {item.caption.highlightText}
          </span>
        </p>
      </div>
    </div>
  );
}
