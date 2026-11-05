import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../features/Admin/components/AdminNavbar";
import { AdminSocketProvider } from "../context/AdminSocketContext";
import { ShieldCheck } from "lucide-react";

export default function AdminLayout() {
  return (
    <AdminSocketProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-gold/30 selection:text-gold">
        <AdminNavbar />

        {/* Space for fixed top navbar */}
        <div className="flex-1 pt-16">
          <Outlet />
        </div>

        {/* Luxury Backoffice Footer */}
        <footer className="bg-ink text-cream border-t border-gold/20 py-10 text-center text-xs">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-cream/70">
              <ShieldCheck size={16} className="text-gold" />
              <span className="font-serif text-sm tracking-wide">
                Le Bistro <span className="text-gold italic font-normal">Backoffice Executive Suite</span>
              </span>
            </div>
            <p className="text-cream/40 uppercase tracking-widest text-[10px]">
              Smart Restaurant Management System © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </AdminSocketProvider>
  );
}
