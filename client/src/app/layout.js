// app/layout.js
import "./globals.css";
import AppProviders from "../components/providers/AppProviders.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";

export const metadata = {
  metadataBase: new URL("https://www.yourdomain.com"),
  title: {
    default: "Excellent Research · Knowledge Collaboration Hub",
    template: "%s | Excellent Research",
  },
  description:
    "Excellent Research platform – discover departments, curate topics, publish articles, manage courses, and orchestrate library operations.",
  keywords: [
    "Excellent Research",
    "thesis writing Cameroon",
    "academic research support",
    "Cameroon dissertation services",
    "data analysis for theses",
    "research collaboration platform",
  ],
  applicationName: "Excellent Research Platform",
  authors: [{ name: "Excellent Research", url: "https://www.yourdomain.com" }],
  category: "education",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.yourdomain.com",
    title: "Excellent Research · Knowledge Collaboration Hub",
    description:
      "Discover departments, curate topics, publish articles, manage courses, and orchestrate library operations with Excellent Research.",
    siteName: "Excellent Research",
    locale: "en_US",
    images: [
      {
        url: "https://www.yourdomain.com/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Excellent Research platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Excellent Research · Knowledge Collaboration Hub",
    description:
      "All-in-one academic research and knowledge management platform for Cameroonian scholars and institutions.",
    images: ["https://www.yourdomain.com/og-default.jpg"],
  },
  other: {
    "linkedin:profile": "https://www.linkedin.com/company/yourcompany",
    "facebook:page": "https://www.facebook.com/yourpage",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}