import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BF Blessy — Pioneer Platform | Hire Skilled Professionals',
  description: 'Africa\'s leading freelance job marketplace. Post jobs, hire Pioneers, and pay securely with milestone-based escrow. Development, Design, Writing, Marketing and more.',
  keywords: ['freelance', 'jobs', 'Africa', 'hire', 'pioneer', 'marketplace', 'remote work'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
