import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InterlinkSessionBridge from '@/components/auth/InterlinkSessionBridge';

export const metadata: Metadata = {
  title: 'BF Blessy — Linker Marketplace',
  description: 'Find skilled Linkers, post projects, review proposals, and hire with InterLink ID.',
  keywords: ['freelance', 'jobs', 'Africa', 'Linkers', 'marketplace', 'InterLink ID'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <InterlinkSessionBridge />
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
