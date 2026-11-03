"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      setMessage(data.message ?? "Something went wrong. Please try again.");

      if (data.success) {
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Please check your connection and try again.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#FDF3D0] text-slate-950 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-amber-900/10 overflow-hidden grid md:grid-cols-2">
        {/* LEFT: warm illustration panel */}
        <section className="bg-gradient-to-br from-[#FFEBA8] via-[#FDE49A] to-[#F8CE6B] relative hidden md:flex items-center justify-center p-10 overflow-hidden">
          {/* decorative floating envelopes */}
          <Mail className="absolute top-10 left-8 h-8 w-8 text-amber-500/70 -rotate-12" />
          <Mail className="absolute top-24 right-10 h-6 w-6 text-amber-600/60 rotate-12" />
          <Mail className="absolute bottom-16 left-12 h-10 w-10 text-amber-500/50 rotate-6" />
          <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/25" />
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-white/20" />

          <div className="relative">
            {/* phone mockup */}
            <div className="relative w-52 h-96 bg-slate-900 rounded-[2rem] p-2 shadow-2xl shadow-amber-900/30 rotate-[-4deg]">
              <div className="w-full h-full bg-white rounded-[1.6rem] flex flex-col items-center pt-10 px-4 gap-4">
                <div className="w-16 h-1.5 rounded-full bg-slate-900/80 absolute top-3 left-1/2 -translate-x-1/2" />
                <div className="w-full h-2.5 rounded-full bg-amber-200" />
                <div className="w-4/5 h-2.5 rounded-full bg-amber-100" />
                <div className="w-full h-2.5 rounded-full bg-orange-100" />
              </div>
              {/* notification badge */}
              <div className="absolute -top-2 -right-2 h-9 w-9 rounded-full bg-amber-400 border-4 border-white grid place-items-center text-white text-xs font-black rotate-[8deg]">
                1
              </div>
            </div>

            {/* giant envelope popping out of the phone */}
            <div className="absolute inset-0 grid place-items-center">
              <Mail className="h-28 w-28 text-amber-400 drop-shadow-lg fill-amber-300 rotate-[-4deg]" strokeWidth={1.2} />
            </div>
          </div>

          <p className="absolute bottom-8 inset-x-0 text-center text-amber-900/70 text-xs font-bold uppercase tracking-[0.3em]">
            EverNear Weekly
          </p>
        </section>

        {/* RIGHT: subscribe form */}
        <section className="p-10 md:p-14 flex flex-col justify-center items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-medium text-slate-800">
            Subscribe to
          </h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 -mt-4">
            Our Newsletter
          </h1>

          <p className="text-sm md:text-base text-slate-600 font-semibold max-w-sm leading-relaxed">
            You will never miss our podcasts or latest videos. Our newsletter
            is once a week, every Tuesdays.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 mt-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email address"
              className="flex-1 w-full rounded-full bg-[#FDF3D0] border border-amber-300/60 px-6 py-3.5 text-sm text-slate-800 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-2 rounded-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 px-7 py-3.5 text-sm font-bold text-slate-950 transition shadow hover:shadow-md whitespace-nowrap"
            >
              {status === "loading" ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* feedback message */}
          {message && (
            <p
              role="status"
              className={`text-sm font-semibold max-w-md ${
                status === "success" ? "text-green-700" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-xs text-slate-400 font-medium -mt-3">
            we promise we won&apos;t spam you
          </p>
        </section>
      </div>
    </main>
  );
}
