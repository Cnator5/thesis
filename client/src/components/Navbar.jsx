"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import AuthModals from "./auth/AuthModals.jsx";
import Button from "./ui/Button.jsx";
import { useAuth } from "./providers/AuthProvider.jsx";
import { cn } from "../lib/utils";
import Image from "next/image";

export default function Navbar() {
  const { isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = [
    { label: "HOME", href: "/" },
    { label: "DEPARTMENTS", href: "/department" },
    { label: "ABOUT US", href: "/about" },
    { label: "WORK WITH US", href: "/work-with-us" },
    { label: "OUR SERVICES", href: "/services" },
    { label: "HIRE A WRITER", href: "/hire-a-writer" },
    { label: "PAYMENT", href: "/payment" },
    { label: "FAQ", href: "/faq" },
    { label: "CONTACT US", href: "/contact" },
  ];

  const goAuth = (key) => {
    const url = new URL(window.location.href);
    url.searchParams.set("auth", key);
    router.push(url.pathname + url.search);
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="z-40 w-full bg-white shadow-sm">
        {/* Top bar */}
        <div className=" flex w-full max-w-7xl items-center justify-between px-4 py-3 text-sm text-slate-600">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 min-w-0"
            aria-label="Research home"
          >
            {/* Logo container ensures consistent sizing without distortion */}
            <div className="relative h-8 w-36 md:h-10 md:w-44 shrink-0">
              <Image
                src="/images/award1-2.png"
                alt="Research logo"
                fill
                priority
                sizes="(max-width: 968px) 12rem, 16rem"
                className="object-contain"
              />
            </div>
            <span className="hidden md:inline text-xs text-slate-500 truncate">
              Excellence Project
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 md:flex">
            <span className="hidden lg:inline whitespace-nowrap">
              info@excellentresearch.pro · Tel: +237 651 62 45 73
            </span>
            <Search className="h-5 w-5 text-slate-600" />
            <Button
              className="h-9 bg-primary-200 text-white hover:bg-primary-100"
              onClick={() => router.push("/contact")}
            >
              ORDER NOW
            </Button>
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => goAuth("login")} className="h-9">
                  Sign in
                </Button>
                {/* <Button onClick={() => goAuth("register")} className="h-9">
                  Create account
                </Button> */}
              </>
            ) : (
              <>
                <Button variant="secondary" asChild className="h-9">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 text-rose-500"
                  onClick={async () => {
                    await signOut();
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden w-full bg-teal-600 md:block">
          <nav className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-2 py-2 text-sm font-semibold text-white sm:gap-4 sm:px-4 sm:py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded px-3 py-2 transition hover:bg-white/10 whitespace-nowrap",
                  pathname === item.href && "bg-primary-200 text-slate-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 md:hidden transition-opacity duration-300",
            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={!open}
        >
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={cn(
              "absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out",
              open ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3"
                aria-label="Research Home"
              >
                <div className="relative h-8 w-32">
                  <Image
                    src="/images/award1-2.png"
                    alt="Research logo"
                    fill
                    sizes="12rem"
                    className="object-contain"
                  />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Excellence Project
                </span>
              </Link>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex h-[calc(100%-64px)] flex-col overflow-y-auto px-5 py-6">
              <div className="grid gap-3">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700",
                      pathname === item.href && "bg-teal-600 text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6 space-y-4">
                <span className="block text-xs font-semibold uppercase text-slate-400">
                  Get in touch
                </span>
                <button
                  className="bg-primary-200 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-600"
                  onClick={() => {
                    setOpen(false);
                    router.push("/contact");
                  }}
                >
                  Order now
                </button>

                {!isAuthenticated ? (
                  <div className="grid gap-3">
                    <Button variant="ghost" onClick={() => goAuth("login")}>
                      Sign in
                    </Button>
                    <Button onClick={() => goAuth("register")}>Create account</Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Button variant="secondary" asChild>
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-rose-500"
                      onClick={async () => {
                        await signOut();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </div>
      </header>

      <AuthModals />
    </>
  );
}