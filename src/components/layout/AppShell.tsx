'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <div style={{ minHeight: '100vh' }}>{children}</div>
      {!isDashboard && <Footer />}
    </>
  );
}
