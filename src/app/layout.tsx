import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EverNear - Event Platform",
  description: "Connect with community initiatives near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen flex flex-col justify-between`}>
        

        <AppNavbar />

        <div className="flex-grow">
          {children}
        </div>

       
        <Footer />
        
      </body>
    </html>
  );
}