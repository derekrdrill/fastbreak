import './_styles/globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Header } from '@/app/_components';

export const metadata: Metadata = {
  title: 'Fastbreak - Sports Event Management',
  description: 'Create, view, and manage sports events with venue information',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Header />
        {children}
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
