"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import ReadMoreModal from "./Modals/ReadMoreModal";

export default function LatestNews() {
  const router = useRouter();
  const [selectedNews, setSelectedNews] = useState(null);

  const newsList = [
    {
      title:
        "৫০০ বিলিয়ন ডলারের বৈশ্বিক গেমিং ইন্ডাস্ট্রিতে বাংলাদেশের Inception Games",
      description:
        "বাংলাদেশের গেমিং ইন্ডাস্ট্রি এখন আর শুধু সম্ভাবনার গল্প নয় এটি ধীরে ধীরে বৈশ্বিক বাজারে নিজেদের অবস্থান তৈরি করছে। আর সেই যাত্রার অন্যতম পথপ্রদর্শক Inception Games আলোচনায় উঠে এসেছে — Inception Games-এর শুরুর গল্প ও যাত্রা বাংলাদেশে গেমিং ইন্ডাস্ট্রির বর্তমান অবস্থা বৈশ্বিক বাজারে বাংলাদেশি গেম স্টুডিওর সম্ভাবনা গেম ডেভেলপমেন্টে ক্যারিয়ার গড়ার সুযোগ উদ্যোক্তা হিসেবে চ্যালেঞ্জ, শিক্ষা ও ভবিষ্যৎ পরিকল্পনা কীভাবে বাংলাদেশ ৫০০ বিলিয়ন ডলারের গেমিং অর্থনীতিতে বড় ভূমিকা রাখতে পারে গেমিং শুধু বিনোদন নয়; এটি প্রযুক্তি, সৃজনশীলতা, কর্মসংস্থান এবং বৈদেশিক আয়ের একটি শক্তিশালী খাত। সঠিক দক্ষতা ও উদ্ভাবনের মাধ্যমে বাংলাদেশও এই ইন্ডাস্ট্রিতে বিশ্বমঞ্চে নিজেদের পরিচিতি আরও শক্তিশালী করতে পারে। পুরো পর্বটি দেখুন এবং জানুন, কীভাবে Inception Games বাংলাদেশের গেমিং ইকোসিস্টেমকে সামনে এগিয়ে নিয়ে যাচ্ছে। Co-powered by নাগরিক প্রতিদিন and Startup Association of Bangladesh (SAB)",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1785129436/News_-3_j3fuxq.jpg",
      category: "Gaming",
      categoryColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
      readMoreLink: "",
    },
    {
      title:
        "National Demo Day Certification of Accelerating Bangladesh backed by World Bank , Hi-Tech Park (DEIED) Bangladesh",
      description:
        "At National Demo Day, Inception Games had the opportunity to pitch in front of leading investors. Since last year, our team has been fully bootstrapping and the progress so far has been strong and sustainable. In the coming week, we are launching several products for the Bangladesh market, with plans to expand into the South Asian region (10+ countries) over the next few months. Even without formal marketing, gamers from multiple countries are already supporting the vision of Inception Games through the esports ecosystem. I shared the vision of eSports with Mr Rehan Asif Asad , adviser to the ministry of posts, telecommunications and information technology. Thanks to Project Director of DEIED  , Monjur Mohammad Shahriar Sir, Bangladesh Hi-Tech Park Authority. & his whole Team. The presence of Startup Leader from different Govt entities boosted the whole Program. Thanks to Mr. Nurul H. , MD & CEO of Startup Bangladesh Limited for giving the valuable speech to every startups. Thanks to Mr. Murtuza Zulkar Nain Noman , Project Director of iDEA Project. ICT Division Bangladesh. It was pleasure to meet with Mr. Siddhartho Goshwami from IDEA Project as well. Thanks to Mr. Rahat Ahmed. We had started our journey after covid from NSU Startups Next. Got many advices when we knew nothing about Startup Thanks to Ayman Sadiq  for amazing advice from Panel on the National Demo Days. It was pleasure to meet with Md Mohsinur Rahman , BRAC Bank PLC Thanks to all the Bankers, investors, founders from different Startups. Our mission is clear: to build a global brand that empowers underprivileged yet highly talented gamers creating real income opportunities where none previously existed. Global remittance will be impacted in National Economic Growth.",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1785129799/National_Demo_Day_rgetlx.jpg",
      category: "ESPORTS",
      categoryColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
      readMoreLink: "",
    },
    {
      title: "Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025",
      description:
        "Dedicating to my Core Teammates & gamers . Tournament sign up going on at our website. Don’t forget to sign up at Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025 Stay tuned -  the showdown is coming!",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157047/news4_u9saum.jpg",
      category: "COMMUNITY",
      categoryColor:
        "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      readMoreLink: "",
    },
  ];

  const handleShare = (platform, news) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = news.title;
    const description = news.description;
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title + " - " + description)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title + " - " + description)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(title + " - " + description + " " + shareUrl)}`;
        break;
      default:
        return;
    }

    if (typeof window !== "undefined") {
      window.open(shareLink, "share-dialog", "width=800,height=600");
    }
  };

  return (
    <section
      id="news"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#0a0a14" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            LATEST{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              NEWS
            </span>
          </h2>

          {/* Underline accent */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-50 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* News Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsList.map((news, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              {/* Card Container */}
              <div className="rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
                {/* Image Section */}
                <div
                  className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 bg-cover bg-top"
                  style={{
                    backgroundImage: `url('${news.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${news.categoryColor} backdrop-blur-sm`}
                  >
                    {news.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3">
                      {news.description}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 pt-4 border-t border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedNews(news)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 group/link"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => handleShare("facebook", news)}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1877F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebookF className="text-white text-sm md:text-base" />
                      </button>
                      <button
                        onClick={() => handleShare("twitter", news)}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1DA1F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter className="text-white text-sm md:text-base" />
                      </button>
                      <button
                        onClick={() => handleShare("linkedin", news)}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Share on LinkedIn"
                      >
                        <FaLinkedin className="text-white text-sm md:text-base" />
                      </button>
                      <button
                        onClick={() => handleShare("whatsapp", news)}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#25D366] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp className="text-white text-sm md:text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            onClick={() => router.push("/community#news")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer"
          >
            View All
          </motion.button>
        </motion.div>

        {/* News Detail Modal */}
        <AnimatePresence>
          {selectedNews && (
            <ReadMoreModal
              selectedNews={selectedNews}
              setSelectedNews={setSelectedNews}
              handleShare={handleShare}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
