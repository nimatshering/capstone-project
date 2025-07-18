import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/custom/Navbar";
import { Toaster } from "sonner";
import { Footer } from "@/components/custom/Footer";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <NavBar />
          <div className="container mx-auto px-4 py-20 my-10 h-screen">
            {children}
          </div>
        </UserProvider>
        <Toaster
          toastOptions={{
            style: {
              background: "green",
              color: "white",
            },
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
