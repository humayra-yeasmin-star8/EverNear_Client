"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="absolute top-0 left-0 right-0 w-full bg-transparent px-9 py-9 grid grid-cols-3 items-center z-50">
      
      {/* 1. App Logo & Name (Left) */}
      <div className="flex items-center justify-start">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-lg group-hover:scale-105 transition-transform">
            <Image
              src="/logo.jpg"
              alt="EverNear Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-2xl font-black tracking-wider text-white drop-shadow-md">
            EVER<span className="text-amber-300">NEAR</span>
          </span>
        </Link>
      </div>

      {/* 2. Centered Navigation Links (Middle) */}
      <div className="flex items-center justify-center gap-8">
        <Link
          href="/"
          className="text-black hover:text-amber-300 font-semibold transition-colors text-sm uppercase tracking-wider drop-shadow-md"
        >
          Home
        </Link>
          <Link
          href="/all-events"
          className=" text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] hover:text-amber-300 font-semibold transition-colors text-sm uppercase tracking-wider"
        >
          ALL Events
        </Link>

        <Link
          href="/schedules"
          className="text-black hover:text-amber-300 font-semibold transition-colors text-sm uppercase tracking-wider drop-shadow-md"
        >
          Schedules
        </Link>

        <Link
          href="/about"
          className="text-black hover:text-amber-300 font-semibold transition-colors text-sm uppercase tracking-wider drop-shadow-md"
        >
          About
        </Link>
      
      </div>

      {/* 3. Auth Buttons / Profile (Right) */}
      <div className="flex items-center justify-end gap-3">
        {!user ? (
          <>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-amber-300/60 bg-black/30 text-white hover:bg-emerald-800/50 hover:text-amber-300 text-xs uppercase tracking-wider font-semibold backdrop-blur-sm",
              })}
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className={buttonVariants({
                className:
                  "bg-emerald-500 hover:bg-emerald-400 text-[#FACC15] drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] font-bold border border-amber-300/40 shadow-lg text-xs uppercase tracking-wider",
              })}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger>
                  <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-amber-300 rounded-full transition">
                    <Avatar className="w-11 h-11 border-2 border-amber-300 hover:border-emerald-400">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-emerald-800 text-amber-300 font-bold">
                        {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "EN"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-amber-300/30 text-amber-300 font-semibold text-xs">
                  {user.displayName || "User"}
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent className="w-56 bg-slate-900 border-emerald-500/40 text-slate-200 shadow-2xl">
                <DropdownMenuLabel className="text-amber-300 text-xs uppercase tracking-wider">
                  Signed in as
                  <span className="block text-white truncate text-sm font-normal mt-0.5">
                    {user.displayName || user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-emerald-800/40" />
                
                <DropdownMenuItem className="p-0">
                  <Link href="/create-event" className="w-full px-3 py-2 cursor-pointer hover:text-amber-300">
                    ➕ Create Event
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-0">
                  <Link href="/manage-events" className="w-full px-3 py-2 cursor-pointer hover:text-amber-300">
                    ⚙️ Manage Events
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-0">
                  <Link href="/joined-events" className="w-full px-3 py-2 cursor-pointer hover:text-amber-300">
                    🤝 Joined Events
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-emerald-800/40" />
                
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300 px-3 py-2"
                >
                  🚪 Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        )}
      </div>

    </nav>
  );
}