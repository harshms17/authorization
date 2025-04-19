import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Authorization Web-App",
  description:
    "A simple web app for authorizating users and admins on the basis of their regions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <div className="fixed top-0 w-screen">
          <Navbar />
        </div>
        <main className="pt-6">{children}</main>
      </body>
    </html>
  );
}
