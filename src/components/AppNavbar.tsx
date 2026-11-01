"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { User } from "@/types/event";

export default function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Navbar
      user={user}
      onLogin={() => {
        // Demo login
        setUser({
          id: "user_101",
          displayName: "Sarah Jenkins",
          email: "sarah@example.com",
        });
      }}
      onLogout={() => setUser(null)}
    />
  );
}