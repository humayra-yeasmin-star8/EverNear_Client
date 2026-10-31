"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/90 text-slate-300 border-t border-emerald-500/20 pt-12 pb-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-10">
          
          {/* Column 1: EverNear Market */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              EVERNEAR MARKET
            </h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><Link href="/terms" className="hover:text-amber-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/guidelines" className="hover:text-amber-300 transition-colors">Event Guidelines</Link></li>
              <li><Link href="/api" className="hover:text-amber-300 transition-colors">Platform API</Link></li>
              <li><Link href="/organizers" className="hover:text-amber-300 transition-colors">Become an Organizer</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 2: Help & Support */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              HELP
            </h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><Link href="/help" className="hover:text-amber-300 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact Support</Link></li>
              <li><Link href="/faq" className="hover:text-amber-300 transition-colors">FAQs</Link></li>
              <li><Link href="/safety" className="hover:text-amber-300 transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Community */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              OUR COMMUNITY
            </h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><Link href="/volunteers" className="hover:text-amber-300 transition-colors">Volunteers</Link></li>
              <li><Link href="/blog" className="hover:text-amber-300 transition-colors">Stories & Blog</Link></li>
              <li><Link href="/meetups" className="hover:text-amber-300 transition-colors">Local Meetups</Link></li>
              <li><Link href="/partners" className="hover:text-amber-300 transition-colors">NGO Partners</Link></li>
            </ul>
          </div>

          {/* Column 4: Meet EverNear */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              MEET EVERNEAR
            </h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><Link href="/about" className="hover:text-amber-300 transition-colors">About EverNear</Link></li>
              <li><Link href="/careers" className="hover:text-amber-300 transition-colors">Careers</Link></li>
              <li><Link href="/impact" className="hover:text-amber-300 transition-colors">Impact Report</Link></li>
              <li><Link href="/sitemap" className="hover:text-amber-300 transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          {/* Column 5 & 6: Logo & Impact Counter */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-300 shadow">
                <Image
                  src="/logo.jpg"
                  alt="EverNear Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                EVER<span className="text-amber-300">NEAR</span>
              </span>
            </Link>

            <div className="flex items-center gap-6 mt-2 text-left lg:text-right">
              <div>
                <div className="text-xl font-bold text-emerald-400">1,420+</div>
                <div className="text-xs text-slate-400">Events Hosted</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <div className="text-xl font-bold text-amber-300">25,800+</div>
                <div className="text-xs text-slate-400 font-normal">Lives Impacted</div>
              </div>
            </div>
          </div>

        </div>

        {/* Divider Bar */}
        <div className="w-full h-px bg-slate-800/80 my-4" />

        {/* Bottom Bar: Copyright & Social SVGs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-400">
          
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-medium text-slate-300">
              <Link href="/events" className="hover:text-amber-300 transition-colors">All Events</Link>
              <span>•</span>
              <Link href="/locations/dhaka" className="hover:text-amber-300 transition-colors">Dhaka Drives</Link>
              <span>•</span>
              <Link href="/winter-relief" className="hover:text-amber-300 transition-colors">Winter Relief</Link>
              <span>•</span>
              <Link href="/sitemap" className="hover:text-amber-300 transition-colors">Sitemap</Link>
            </div>
            
            <p className="text-slate-500">
              © {new Date().getFullYear()} EverNear Community Platform. Built with <Heart className="w-3.5 h-3.5 text-emerald-500 inline mx-0.5 fill-emerald-500" /> for local social services.
            </p>
          </div>

          {/* Social Icons via Inline SVG (No Lucide Errors) */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="#" className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-300 hover:text-amber-300 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-300 hover:text-amber-300 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="#" className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-300 hover:text-amber-300 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-300 hover:text-amber-300 transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}