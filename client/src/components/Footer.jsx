'use client';

import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  { label: 'All Departments', href: '/departments' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Work with us', href: '/careers' },
  { label: 'Hire a writer', href: '/hire-a-writer' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
];

const contactItems = [
  {
    type: 'phone',
    label: '+237 651 62 45 73',
    href: 'tel:+237651624573',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 0 0 1.5-1.5v-2.878a1.5 1.5 0 0 0-1.164-1.464l-3.21-.802a1.5 1.5 0 0 0-1.572.596l-.722.964a11.48 11.48 0 0 1-5.005-5.005l.964-.722a1.5 1.5 0 0 0 .596-1.572l-.802-3.21A1.5 1.5 0 0 0 6.128 3.75H3.25a1.5 1.5 0 0 0-1.5 1.5v1.5Z"
        />
      </svg>
    ),
  },
  {
    type: 'email',
    label: 'info@excellentresearch.pro',
    href: 'mailto:info@excellentresearch.pro',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.032 1.89l-7.5 4.874a2.25 2.25 0 0 1-2.436 0L4.782 8.883a2.25 2.25 0 0 1-1.032-1.89V6.75"
        />
      </svg>
    ),
  },
  {
    type: 'address',
    label: 'Molyko, Southwest Region - Buea, Cameroon',
    href: 'https://maps.google.com/?q=Molyko,+Buea,+Cameroon',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 12-7.5 12s-7.5-4.858-7.5-12a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14 md:flex-row md:items-start md:justify-between md:px-8">
        <div className="max-w-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="">
              <Image
                src="/images/award1-2.png"
                alt="Research Guru logo"
                width={1020}
                height={1020}
                className=""
                priority
              />
            </div>
            {/* <div>
              <h2 className="text-xl font-semibold text-slate-900">Research</h2>
              <p className="text-sm font-medium uppercase tracking-wide text-amber-600">
                Academic Research Centre
              </p>
            </div> */}
          </div>
          <p className="text-base leading-relaxed text-slate-600">
            Research Excellent is a center for Academic Research services in Cameroon, dedicated to
            providing comprehensive support to students, NGOs, and professionals at every level. Discover how we can help you
            excel.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Learn more →
          </Link>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">Blog</h3>
          <p className="max-w-xs text-base leading-relaxed text-slate-600">
            Stay informed with strategies, templates, and insights that simplify research and
            writing excellence.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Visit the blog →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-base text-slate-600">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-emerald-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
            <ul className="mt-4 space-y-3 text-base text-slate-600">
              {contactItems.map((item) => (
                <li key={item.type}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 transition hover:text-emerald-600"
                  >
                    <span className="text-emerald-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-center text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>Copyright © {new Date().getFullYear()} All Rights Reserved</p>
          {/* <p>
            Research Guru — Powered by{' '}
            <Link href="https://netkipedia.com" className="font-medium text-emerald-600 hover:text-emerald-700">
              Netkipedia
            </Link>
          </p> */}
        </div>
      </div>
    </footer>
  );
}