// components/layout/Topbar.jsx
"use client";

import Link from "next/link";
import { Menu, Sparkles, UserCircle2, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider.jsx";
import Button from "@/components/ui/Button.jsx";
import { cn, isAdmin } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/navigation";

export default function Topbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/70 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="xl:hidden" onClick={() => setOpen((prev) => !prev)}>
          <Menu size={18} />
        </Button>
        <div className="hidden items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 sm:flex">
          <Sparkles size={14} />
          Empowering research excellence
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
          >
            <UserCircle2 size={20} />
            <span className="hidden sm:inline-block">{user?.name}</span>
          </Link>
        </Button>
      </div>

      {open && <MobileNav onClose={() => setOpen(false)} onLogout={signOut} />}
    </header>
  );
}

function MobileNav({ onClose, onLogout }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const navItems = [...NAV_ITEMS, ...(isAdmin(user) ? ADMIN_NAV_ITEMS : [])];

  return (
    <div className="absolute left-0 top-full z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur xl:hidden">
      <nav className="flex flex-col p-4">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role)) {
            return null;
          }
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600",
                active && "bg-indigo-600 text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
        <Button
          variant="ghost"
          className="mt-2 justify-start text-sm text-rose-500"
          onClick={() => {
            onClose();
            onLogout();
          }}
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </nav>
    </div>
  );
}