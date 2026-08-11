import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Sri Chaitanya School | Learn. Grow. Excel.',
    template: '%s | Sri Chaitanya School',
  },
  description: 'Sri Chaitanya School - Empowering young minds for a brighter future. Academic excellence, discipline, innovation, and character development.',
  keywords: ['Sri Chaitanya School', 'school', 'education', 'admissions', 'academic excellence', 'India school'],
  openGraph: {
    title: 'Sri Chaitanya School | Learn. Grow. Excel.',
    description: 'Empowering young minds for a brighter future. Academic excellence, discipline, innovation, and character development.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
