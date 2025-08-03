import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ByOlisJo Brand Kit Lite',
  description: 'Generate a quick brand kit: palette, slogan, and logo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f2ea] text-[#1f1b16]">
        <div className="max-w-3xl mx-auto p-6">
          <header className="py-6">
            <h1 className="text-2xl md:text-3xl font-serif tracking-wide">
              <span className="mr-2">ByOlisJo</span>
              <span className="font-light">Brand Kit Lite</span>
            </h1>
            <p className="text-sm opacity-70 mt-1">Premium & minimal — beige & gold aesthetic</p>
          </header>
          {children}
          <footer className="py-10 text-xs opacity-70">
            © {new Date().getFullYear()} ByOlisJo. For testing purposes only.
          </footer>
        </div>
      </body>
    </html>
  );
}
