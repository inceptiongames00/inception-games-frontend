'use client'

import { useRouter, usePathname } from 'next/navigation'

export function useProfileNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigateToTab = (tab) => {
    if (pathname?.startsWith('/profile')) {
      window.dispatchEvent(
        new CustomEvent('switchProfileTab', { detail: { tab } })
      )
    } else {
      // We're on a different page, navigate to profile with tab in URL
      router.push(`/profile?tab=${tab}`)
    }
  }

  return { navigateToTab }
}
