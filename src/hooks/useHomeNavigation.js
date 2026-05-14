import { useRouter, usePathname } from 'next/navigation'

export function useHomeNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/index'

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navigateToSection = (sectionId) => {
    if (isHome) {
      // Already on home, just scroll
      setTimeout(() => scrollToSection(sectionId), 100)
    } else {
      // Navigate to home with section hash
      router.push(`/#${sectionId}`)
      
      // Scroll to section after navigation completes
      setTimeout(() => scrollToSection(sectionId), 300)
    }
  }

  return { navigateToSection, scrollToSection, isHome }
}
