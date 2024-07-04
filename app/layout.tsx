import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Formzones',
  description:
    'Formzones lets website owners receive form submissions directly in Discord. Skip managing servers and get instant notifications, making it easier to stay connected and responsive to your audience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
