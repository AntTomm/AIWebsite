// layout.js
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Customer Support',
  description: "Anthony Tommaso's AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} gradient-background`}>
        {children}
      </body>
    </html>
  );
}
