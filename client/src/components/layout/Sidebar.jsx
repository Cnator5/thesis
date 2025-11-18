// components/layout/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider.jsx";
import Button from "@/components/ui/Button.jsx";
import { cn, isAdmin } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [...NAV_ITEMS, ...(isAdmin(user) ? ADMIN_NAV_ITEMS : [])];

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-slate-100 bg-white/80 px-4 py-6 shadow-sm xl:flex">
      <div className="mb-10 flex items-center gap-3 px-2 text-indigo-600">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold">
          RG
        </span>
        <div>
          <p className="text-base font-semibold text-slate-900">Excellent Research</p>
          <p className="text-xs text-slate-500">Knowledge operations</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
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
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-indigo-50 hover:text-indigo-600",
                active && "bg-indigo-600 text-white shadow-sm hover:bg-indigo-600"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3 rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-xs text-slate-600">
        <p className="text-sm font-semibold text-slate-700">Signed in as</p>
        <p className="truncate text-sm text-slate-600">{user?.name}</p>
        <p className="truncate text-xs text-slate-500">{user?.email}</p>
      </div>

      <Button
        variant="ghost"
        className="mt-4 w-full justify-center text-sm text-rose-500"
        onClick={signOut}
      >
        <LogOut size={16} />
        Sign out
      </Button>
    </aside>
  );
}