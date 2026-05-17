import { Suspense } from 'react';

export const metadata = {
  title: 'My Profile - Inception Games',
  description: 'View my esports profile on Inception Games',
  openGraph: {
    title: 'My Esports Profile',
    description: 'Check out my gaming profile on Inception Games',
    type: 'profile',
  },
};

export default function ProfileLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </>
  );
}
