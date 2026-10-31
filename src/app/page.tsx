"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
// Import your auth client (e.g., Firebase auth, NextAuth useSession, etc.)

export default function Home() {
  // Real user state initialized to null (loading state handled if needed)
  const [user, setUser] = useState<{
    displayName: string;
    email: string;
    photoURL?: string;
  } | null>(null);

  useEffect(() => {
    // TODO: Replace this with your actual auth listener
    // Example (Firebase): 
    // const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });
    // return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    // TODO: Call your auth sign-out function here
    // Example: await signOut(auth);
    setUser(null);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/bg.jpg"
        alt="EverNear Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-brightness-75 z-0" />

      {/* Layout Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar receives the real user state and logout handler */}
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
        />

        {/* Main Section */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center bg-slate-900/80 border border-emerald-500/40 p-8 rounded-2xl max-w-lg backdrop-blur-md shadow-2xl">
            <h1 className="text-3xl font-bold text-amber-300 mb-2">
              EverNear Community Hub
            </h1>
            <p className="text-slate-300 text-sm">
              Community-driven local social service events platform in Dhaka.
            </p>
          </div>
        </main>

      </div>
      <Footer />
    </div>
    
  );
}