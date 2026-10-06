import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import AppShell from '@/components/layout/AppShell';
import { AuthProvider } from '@/context/AuthContext';

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
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
