import React from "react";
import Image from "next/image";

export default function EventGallery({ gallery }: { gallery: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {gallery.map((img, idx) => (
        <div
          key={idx}
          className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-300 transition-all duration-300"
        >
          <Image src={img} alt={`Gallery photo ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform" />
        </div>
      ))}
    </div>
  );
}