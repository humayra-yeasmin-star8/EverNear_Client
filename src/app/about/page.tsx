import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar"


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFEBA8] via-[#FDE49A] to-[#F8CE6B] text-slate-100 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <Navbar/>
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto overflow-hidden rounded-full border-2 border-amber-400 shadow-xl">
            <Image src="/logo.jpg" alt="EverNear Logo" fill className="object-cover" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-amber-500 tracking-wider">
            WELCOME TO EVERNEAR
          </h1>
          <p className="text-slate-800 text-sm md:text-base uppercase tracking-widest font-semibold">
            Bringing People & Unforgettable Moments Together
          </p>
        </div>

        {/* Warm Letter */}
        <div className="bg-emerald-950 border border-b-black rounded-2xl p-8 md:p-12 shadow-2xl relative backdrop-blur-sm space-y-6 text-slate-300 leading-relaxed text-base md:text-lg">
          <p className="text-amber-200 font-medium text-xl">Dear Friend,</p>
          
          <p>
            Welcome to <strong className="text-amber-300">EverNear</strong>—a platform born out of a simple belief: every great story begins with a shared experience.
          </p>

          <p>
            Whether you are here to explore local gatherings, attend life-changing events, or simply connect with a vibrant community, our mission is to ensure that unforgettable moments are always within your reach—never far, always near.
          </p>

          <p>
            Every feature on this platform, from our curated event listings to personalized scheduling, was built to make discovering your next memory seamless and meaningful. We believe in creating spaces where connections flourish and memories linger long after the lights go down.
          </p>

          <p>
            Thank you for being a part of our journey. Explore, participate, and make every moment count.
          </p>

          <div className="pt-6 border-t border-slate-800 flex justify-between items-end">
            <div>
              <p className="text-sm text-slate-400">Warmest regards,</p>
              <p className="text-lg font-bold text-amber-300 font-serif italic">The EverNear Team</p>
            </div>
            <Link
              href="/all-events"
              className="px-6 py-3 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg transition shadow"
            >
              Explore Events
            </Link>
          </div>
        </div>
         
      </div>
     
    </main>
    
  );
}