import Link from "next/link";
import "./globals.css"; // Ensure styles are applied

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex space-x-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/profile">Profile</Link></li>
          </ul>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}