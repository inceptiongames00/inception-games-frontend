"use client"
import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react'

export default function SocialShareButtons({ url, title }) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const handleShare = async (platform) => {
    if (platform === 'native') {
      // Use Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: url,
          })
        } catch (err) {
          console.error('Error sharing:', err)
        }
      }
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => handleShare('native')}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}
