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
      title: "গেম খেলা হতে পারে কারো পেশা",
      description:
        "গেম তৈরি ও বাজারজাত করে দেশের অর্থনীতিতেও বড় অবদান রাখতে পারে গেম নির্মাতা প্রতিষ্ঠান। পেশাদার গেমারদের জন্য প্ল্যাটফর্ম তৈরি ও গেম তৈরির কাজ করছেন কাজী হাসিব ও তাঁর দল। তাঁদের দুই প্রতিষ্ঠানের সম্পর্কে লিখেছেন আশিক উল বারাত",
      details:
        "গেম খেলা হতে পারে কারো পেশা। গেম তৈরি ও বাজারজাত করে দেশের অর্থনীতিতেও বড় অবদান রাখতে পারে গেম নির্মাতা প্রতিষ্ঠান। পেশাদার গেমারদের জন্য প্ল্যাটফর্ম তৈরি ও গেম তৈরির কাজ করছেন কাজী হাসিব ও তাঁর দল। তাঁদের দুই প্রতিষ্ঠানের সম্পর্কে লিখেছেন আশিক উল বারাত. Thanks Ashiq Ul BaRat  হাসিবের @Slice N Share স্লাইস এন শেয়ার সহপ্রতিষ্ঠাতা কাজী হাসিব অবসরে গেম খেলা কিশোর-তরুণদের মধ্যে অত্যন্ত জনপ্রিয়। তবে এখনো গেম তৈরিতে কাজ করছে খুব কম দেশি প্রতিষ্ঠান। গত ১৩ জুলাই ই-স্পোর্টসকে ক্রীড়া হিসেবে মর্যাদা দিয়েছে বাংলাদেশ সরকার। অথচ এখনো পেশাদার গেমার হতে চাইলে প্রয়োজনীয় প্ল্যাটফর্মের অভাব বোধ করেন প্রত্যেক গেমার, দেশ-বিদেশে টুর্নামেন্ট আয়োজন অথবা অংশগ্রহণে নানাবিধ সমস্যার মুখোমুখি হন। গেম নির্মাতা প্রতিষ্ঠানের সংখ্যাও দেশে একেবারেই হাতে গোনা। ভিডিও গেম বাজারের এই ঘাটতিগুলো পূরণের লক্ষ্যে কাজ করছেন একদল তরুণ গেম নির্মাতা ও সফটওয়্যার ইঞ্জিনিয়ারের তৈরি স্টার্টআপ ‘স্লাইস এন শেয়ার’ ও এর গেম নির্মাতা শাখা ইনসেপশন স্টুডিও। যেভাবে শুরু স্লাইস এন শেয়ার ও Inception  ইনসেপশন স্টুডিও—এ দুটি স্টার্টআপের সহপ্রতিষ্ঠাতা কাজী হাসিব এবং রামিসা রিফা। নর্থ সাউথ বিশ্ববিদ্যালয়ে অধ্যয়নের সময় তাঁদের পরিচয়।২০২২ সালের শেষ ভাগে যাত্রা শুরু করে স্লাইস এন শেয়ার। এখন স্লাইস এন শেয়ার টিমে রয়েছেন মোট ৯ সদস্য। টিম গঠনের শুরুটা সহজ ছিল না। হাসিব বলেন, ‘গত আড়াই বছরে আমরা অনেক ধরনের সমস্যার মুখোমুখি হয়েছি। হয়তো অভিজ্ঞতা কম ছিল বলেই হতোদ্যম হয়ে যাইনি, নিজেদের প্রমাণ করার স্পৃহা কাজ করেছে। এখন শুরু করলে হয়তো সে রকম সাহস পেতাম না। যত বাধা আসুক, আমাদের টিম কখনো কাজ বন্ধ করে দেয়নি। দলের একজনকে হতাশা গ্রাস করলে অন্যরা তাকে টেনে তুলেছে। আমাদের টিমের অদম্য স্পৃহা নিয়ে আমি গর্ব করি। ই-স্পোর্টস প্ল্যাটফর্ম গেম খেলা হতে পারে কারো ক্যারিয়ার, রোজগারের প্রধান অবলম্বন—এটা এখনো সমাজে একেবারেই প্রতিষ্ঠিত নয়। ‘প্রফেশনাল গেমার’ পদটি যাতে ফাঁকা বুলি পর্যন্ত আটকে না থাকে, সেই লক্ষ্যে কাজ শুরু করেছেন হাসিব। ই-স্পোর্টসে ক্যারিয়ার গড়ে লাখ টাকা আয় করছেন বিদেশি খেলোয়াড়রা, বাংলাদেশের গেমাররা যাতে মাসে অন্তত ২০ হাজার টাকা আয় করতে পারেন, সে জন্য তৈরি হয়েছে স্লাইস এন শেয়ার। প্রতিষ্ঠানটির সঙ্গে পার্টনারশিপ করেছে শেয়ারট্রিপ, বেশ কয়েকটি ই-স্পোর্টস টুর্নামেন্ট আয়োজন করেছে তারা। এফসি২৪ গেমটি নিয়ে আয়োজিত ক্যাম্পাস ই-স্পোর্টস স্ক্রিমসে মোট ২৫ হাজার টাকা মূল্যের পুরস্কার বিতরণ করা হয়েছে। স্টার্টআপটি এরই মধ্যে Accelerating Bangladesh - অ্যাকসেলারেটিং বাংলাদেশ স্টার্টআপ প্রোগ্রাম’-এর অংশ হিসেবে যুক্ত হয়েছে। পাশাপাশি পেয়েছে ওয়ার্ল্ড ব্যাংকের ট্রেনিং সাপোর্ট। ফলে ফান্ড রেইজিং ও নেটওয়ার্কিংয়ে আটকাতে হয়নি এই প্রতিষ্ঠানের। শিগগিরই বড় টুর্নামেন্ট আয়োজনের পরিকল্পনা করছে তারা। Thanks to একজন শাহরিয়ার  Monjur Shahriar Mohammad Shahriar Sir for your mentor and Support ❤ ঢাকায় জম্বি অ্যাটাক ই-স্পোর্টস প্ল্যাটফর্ম তৈরির পাশাপাশি গেম তৈরিতেও কাজ করছেন হাসিব ও তাঁর দল। গেমিং স্টুডিওর নাম দেওয়া হয়েছে ইনসেপশন স্টুডিও। ঢাকার এলাকার ওপর ভিত্তি করে তৈরি গেম ওয়ার্ল্ডের পটভূমিতে তৈরি করা হয়েছে ফার্স্ট পারসন জম্বি শ্যুটার গেম ‘জেড ইনসেপশন’। এটি বিনামূল্যে ইনসেপশন স্টুডিওর ওয়েবসাইট Inception Studio website থেকে ডাইনলোড করে পিসিতে খেলা যাবে। মানিক মিয়া এভিনিউ, নর্থ সাউথ বিশ্ববিদ্যালয়ের আশপাশের এলাকা ও চিরচেনা ঢাকার অন্যান্য এলাকার মডেল ইউনিটি ইঞ্জিনে বসিয়ে গেমটি তৈরি করা হয়েছে। হাসিব বলেন, ‘ছোটবেলায় অনেক গেমার জিটিএ ভাইস সিটি খেলেছে, এর মাধ্যমে যুক্তরাষ্ট্রের মায়ামির অনেকটাই চেনা হয়ে গেছে। বাংলাদেশের মূল শহরগুলো কাজে লাগিয়ে গেম তৈরি করা হলে বিশ্ববাসী আমাদের দেশকেও চিনবে। এ ভাবনা থেকেই একসময় জন্ম নেয় ‘Z Inception’। বিশ্বের অনেক শহরের কর্তৃপক্ষ চায় সেটি গেমের পটভূমি হিসেবে ব্যবহূত হোক। এতে বিশ্ব দরবারে শহরের পরিচিতি বাড়ে, পর্যটকরা ভিড় জমায়। গেমের কল্যাণে এ সুফল ঢাকাও পাবে, আশা করছেন হাসিব ও তাঁর দল। ইনসেপশন স্টুডিওর সাইটে আপাতত গেমটির পরীক্ষামূলক সংস্করণ প্রকাশ করা হয়েছে, ২০২৬ সালের মধ্যে জনপ্রিয় গেমিং প্ল্যাটফর্ম ‘স্টিম’-এ গেমটি পূর্ণাঙ্গ প্রকাশের প্রস্তুতি চলছে। ভবিষ্যৎ আগামী তিন বছরে দেশে কমপক্ষে ১০ হাজার পেশাদার গেমার এবং আন্তর্জাতিক মানের বেশ কয়েকটি গেম তৈরি করতে চায় স্লাইস এন শেয়ার এবং ইনসেপশন স্টুডিও। আগামী বছর (২০২৬) থেকে দেশের বাইরেও কাজ শুরুর পরিকল্পনা রয়েছে তাদের। এ বিষয়ে হাসিব বলেন, ‘বিশ্বে গেমিং ইন্ডাস্ট্রির বাজার প্রায় ট্রিলিয়ন ডলার ছাড়িয়েছে। যদি এর ১ শতাংশও বাংলাদেশে আনা যায়, তাহলেও দেশের অর্থনীতির চাকায় বড় পরিবর্তন আসবে। এর অংশ হতে চাই আমরা, সেটাই আপাতত ভবিষ্যতের চ্যালেঞ্জ।’",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157039/bignews_jmxxbf.jpg",
      category: "UPDATES",
      categoryColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
      readMoreLink:
        "http://facebook.com/slicenshareFB/posts/pfbid02UKgh3GBxwnuJH7VxPbNtQEUkHfSd8naroqFMUeyZ4U3F7bh3fVLvydJvGxnfZCK6l?mibextid=wwXIfr&rdid=PlkdRZwQddmDpaYt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fp%2F16yMhZvtR9%2F%3Fmibextid%3DwwXIfr#",
    },
    {
      title:
        "Digital Entrepreneurship and Innovation Ecosystem Development (DEIED)",
      description:
        "Digital Entrepreneurship and Innovation Ecosystem Development (DEIED) Project Office has organized a Dialogue Session to introduce the Startup and Scaleup Program (Accelerating Bangladesh) and the University Innovation Hub Program to senior public-sector leadership. ",
      image:
        "https://res.cloudinary.com/jvpygp4b/image/upload/v1783157043/news3_freort.jpg",
      category: "ESPORTS",
      categoryColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
      readMoreLink: "",
    },
    {
      title: "Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025",
      description:
        "Dedicating to my Core Teammates & gamers ❤️. Tournament sign up going on at our website. Don't forget to sign up. Slice N Share at Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025.",
      details:
        "Congratulations to our early startup days ex intern Imtiaz. We love to see your Growth over the years. It gives us good hope that you will shine more . Best Wishes. 🔥❤️ He shared that he has honored to receive the Bronze Award at the Airtel Buzz Presents YUNet Bangladesh Gaming & Esports Summit 2025 Powered by XQUBE Studio for game MotoShooter. This recognition from the @IGDA Bangladesh means a lot, especially being evaluated alongside many strong projects based on design, execution, and technical quality.",
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
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
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
