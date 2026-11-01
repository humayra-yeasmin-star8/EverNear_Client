"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/event";
import { LogOut, User as UserIcon, LogIn } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button, buttonVariants } from "@/components/ui/button";


interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({
  user,
  onLogin,
  onLogout,
}: NavbarProps) {
  return (
   <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-9 py-6 bg-transparent">

      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

        {/* LEFT: LOGO */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
      src="/logo.jpg"
      alt="EverNear Logo"
      width={45}
      height={45}
      className="object-contain rounded-full"
    />
            <span className="text-xl md:text-2xl font-black tracking-wider text-white">
              EVER<span className="text-amber-300">NEAR</span>
            </span>
          </Link>
        </div>

        {/* CENTER: NAVIGATION LINKS */}
        <nav className="flex items-center justify-center gap-3 md:gap-7">

          <Link
            href="/"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Home
          </Link>

          <Link
            href="/all-events"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            All Events
          </Link>

          <Link
            href="/schedules"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Schedule
          </Link>

          <Link
            href="/about"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            About
          </Link>

        </nav>

        {/* RIGHT: AUTHENTICATION */}
        <div className="flex items-center justify-end gap-2">

          {!user ? (
            <>
              <Button
                onClick={onLogin}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-slate-950 text-xs font-bold"
              >
                Sign In
              </Button>

              <Link
                href="/register"
                className={buttonVariants({
                  size: "sm",
                 className:"border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-amber-600 text-xs font-bold"
                })}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <DropdownMenu>

              {/* PROFILE CIRCLE */}
              <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-amber-300 rounded-full">

                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 bg-emerald-800 flex items-center justify-center text-amber-300 font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform">

                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>
                      {user.displayName
                        ? user.displayName.substring(0, 1).toUpperCase()
                        : "U"}
                    </span>
                  )}

                </div>

              </DropdownMenuTrigger>

              {/* PROFILE DROPDOWN */}
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-900 text-slate-100 border border-emerald-500/40 shadow-xl"
              >

                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-amber-300 text-sm font-bold">
                      {user.displayName || "User"}
                    </span>

                    <span className="text-slate-400 text-xs font-normal">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-700" />

               <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-amber-300 rounded-full">
  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 bg-emerald-800 flex items-center justify-center text-amber-300 font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform">
    {user.photoURL ? (
      <Image
        src={user.photoURL}
        alt={user.displayName || "User"}
        fill
        className="object-cover"
      />
    ) : (
      <span>
        {user.displayName
          ? user.displayName.substring(0, 1).toUpperCase()
          : "U"}
      </span>
    )}
  </div>
</DropdownMenuTrigger>

                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          )}

        </div>

      </div>
    </header>
  );
}