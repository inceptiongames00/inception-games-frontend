"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { FaFacebookF, FaLinkedin } from "react-icons/fa"

export default function Footer() {
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      setSuccess(true)
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          message: "",
        })
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <footer className="py-16 md:py-20 bg-[#0a0a14] relative overflow-hidden border-t border-zinc-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Footer Links Section - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 max-w-7xl mx-auto">
            {/* Logo + Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start gap-4"
            >
              <Link href="/" aria-label="Inceptions Home" className="inline-flex">
                <img src="/Logo/Logo.png" alt="Inceptions Logo" className="w-20 h-auto" />
              </Link>

              <p className="text-gray-400 text-sm leading-relaxed text-left max-w-xs">
                Compete. Connect. Conquer. — Your home for premier esports tournaments and gaming excellence.
              </p>

              <div
                className="h-[2px] w-12 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ec4899, #8116f1)",
                }}
              />
            </motion.div>

            {/* Social Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-start"
            >
              <h3
                className="font-bold text-base sm:text-lg mb-4 tracking-wider uppercase"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #ec4899, #8116f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Follow Us
              </h3>
              <div className="space-y-3 w-full">
                <motion.a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  className="flex items-center justify-start space-x-3 text-white hover:text-pink-300 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-sm sm:text-base">LinkedIn</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.a>

                <motion.a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  className="flex items-center justify-start space-x-3 text-white hover:text-pink-300 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-sm sm:text-base">Facebook</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.a>

                <motion.a
                  href="https://discord.gg/2UXQRQHf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-start space-x-3 text-white hover:text-pink-300 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.369A19.791 19.791 0 0015.885 3c-.191.345-.404.8-.553 1.165a18.27 18.27 0 00-5.29 0A12.64 12.64 0 009.49 3a19.736 19.736 0 00-4.438 1.372C2.245 8.567 1.433 12.654 1.84 16.685a19.9 19.9 0 005.993 3.048c.48-.648.907-1.337 1.276-2.06a12.955 12.955 0 01-2.01-.963c.17-.124.337-.255.498-.39 3.877 1.823 8.09 1.823 11.92 0 .165.135.332.266.498.39a12.91 12.91 0 01-2.01.963c.37.723.797 1.412 1.276 2.06a19.86 19.86 0 005.993-3.048c.477-4.67-.814-8.72-3.957-12.316zM8.02 14.121c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.211 0 2.176 1.094 2.157 2.418 0 1.333-.955 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.211 0 2.176 1.094 2.157 2.418 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span className="text-sm sm:text-base">Discord</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Website Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-start"
            >
              <h3
                className="font-bold text-base sm:text-lg mb-4 tracking-wider uppercase"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #ec4899, #8116f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Quick Links
              </h3>
              <div className="space-y-3 w-full">
                <div className="relative">
                  <button
                    onClick={() => setEcosystemDropdownOpen(!ecosystemDropdownOpen)}
                    className="flex items-center justify-start gap-2 text-white hover:text-pink-300 transition-colors group w-full text-sm md:text-base"
                  >
                    <span>Ecosystem</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${ecosystemDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {ecosystemDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="mt-2 space-y-2 text-center md:text-left"
                      >
                        <Link
                          href="#ecosystem-partners"
                          onClick={() => {
                            setEcosystemDropdownOpen(false)
                            document.getElementById("ecosystem-partners")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="block text-white/80 text-sm hover:text-pink-300 transition-colors cursor-pointer pl-0"
                        >
                          Partners
                        </Link>
                        <Link
                          href="#ecosystem-games"
                          onClick={() => {
                            setEcosystemDropdownOpen(false)
                            document.getElementById("ecosystem-games")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="block text-white/80 text-sm hover:text-pink-300 transition-colors cursor-pointer pl-0"
                        >
                          Games
                        </Link>
                        <Link
                          href="#ecosystem-community"
                          onClick={() => {
                            setEcosystemDropdownOpen(false)
                            document.getElementById("ecosystem-community")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="block text-white/80 text-sm hover:text-pink-300 transition-colors cursor-pointer pl-0"
                        >
                          Community
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.a
                  href="#news"
                  className="block text-white hover:text-pink-300 transition-colors text-left text-sm"
                  whileHover={{ x: 5 }}
                >
                  News
                </motion.a>

                <motion.a
                  href="#contact"
                  className="block text-white hover:text-pink-300 transition-colors text-left text-sm"
                  whileHover={{ x: 5 }}
                >
                  Contact
                </motion.a>
              </div>
            </motion.div>

            {/* Contact Form Section - 4th Column (Right) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-start"
            >
              <h3
                className="font-bold text-base sm:text-lg mb-4 tracking-wider uppercase"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #ec4899, #8116f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Stay in Touch
              </h3>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 mb-3"
                  >
                    <p className="text-red-400 text-xs">{error}</p>
                  </motion.div>
                )}

                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all backdrop-blur-sm text-xs"
                    required
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all backdrop-blur-sm text-xs"
                    required
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Message"
                    className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all resize-none backdrop-blur-sm text-xs"
                    required
                    disabled={loading || success}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
                  whileHover={{
                    scale: loading || success ? 1 : 1.02,
                  }}
                  whileTap={{ scale: loading || success ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending</span>
                    </div>
                  ) : success ? (
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Sent!</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[#0a0a14] border-t border-zinc-800/50 py-6 px-4">
        <p className="text-gray-500 text-sm text-center">
          Copyright © 2026. All Rights Reserved by Inception Games.
        </p>
      </div>
    </>
  )
}
