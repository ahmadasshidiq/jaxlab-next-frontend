"use client";

import { type ReactNode, useEffect, useState, createContext, useContext, useMemo } from "react";
import Sidebar from "@/components/Sidebar";

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within an AppShell");
  }
  return context;
}

const STORAGE_KEY = "sidebar_open";

export default function AppShell({ children }: { children: ReactNode }) {
  // ✅ default icon-only
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // ✅ load dari localStorage (biar gak reset saat pindah page / refresh)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setIsSidebarOpen(saved === "true");
    } catch {
      // ignore
    }
  }, []);

  // ✅ simpan setiap state berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isSidebarOpen));
    } catch {
      // ignore
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const setSidebarOpen = (open: boolean) => setIsSidebarOpen(open);

  const value = useMemo(
    () => ({ isSidebarOpen, toggleSidebar, setSidebarOpen }),
    [isSidebarOpen]
  );

  return (
    <SidebarContext.Provider value={value}>
      <div className="flex min-h-screen bg-jax-bg">
        <Sidebar />

        {/* konten ikut geser sesuai lebar sidebar */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pl-72" : "pl-20"}`}>
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
