import { Suspense } from 'react';

// Don't set static metadata here - let child routes define their own
// This allows event pages to set specific OpenGraph tags for social sharing

export default function ProfileLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </>
  );
}
