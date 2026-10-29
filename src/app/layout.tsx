import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { StoreProvider } from '@/store/StoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Listing Search',
  description: 'Search and browse property listings aggregated from multiple MLS data feeds.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f1a2c',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <header className="border-b border-secondary-800 bg-background-inverse">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 text-18 font-bold text-text-inverse">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500" aria-hidden>
                <BuildingOffice2Icon className="h-5 w-5" />
              </span>
              Listing Search
            </Link>
            <nav aria-label="Primary" className="text-13 font-medium text-secondary-200">
              <Link href="/" className="hover:text-text-inverse">
                Search
              </Link>
            </nav>
          </div>
        </header>
        <StoreProvider>
          <main id="main" className="flex-1">
            {children}
          </main>
        </StoreProvider>
        <footer className="border-t border-divider bg-background-surface">
          <p className="mx-auto max-w-7xl px-4 py-6 text-12 text-text-muted sm:px-6 lg:px-8">
            Listing data aggregated from MLS feeds. Information deemed reliable but not guaranteed.
          </p>
        </footer>
      </body>
    </html>
  );
}
