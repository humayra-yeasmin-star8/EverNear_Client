import React from "react";
import Image from "next/image";

interface Participant {
  name: string;
  role: string;
  reflection: string;
  image?: string;
}

export default function ParticipantCard({ participant }: { participant: Participant }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-300">
          <Image
            src={participant.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
            alt={participant.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{participant.name}</h4>
          <span className="text-[10px] text-emerald-400 uppercase font-semibold">
            {participant.role}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-300 italic leading-relaxed">
        &quot;{participant.reflection}&quot;
      </p>
    </div>
  );
}