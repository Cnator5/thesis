// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine Tailwind + clsx safely
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ==== ROLE HELPERS ====
export function isAdmin(user) {
  return user?.role?.toLowerCase?.() === "admin";
}

export function isResearcher(user) {
  return user?.role?.toLowerCase?.() === "researcher";
}

export function isStudent(user) {
  return user?.role?.toLowerCase?.() === "student";
}

// ==== DATE / TIME HELPERS ====
export function formatDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ==== ERROR NORMALIZATION ====
export function normalizeError(error) {
  if (!error) return "An unknown error occurred.";

  // If it's already a string, just return it
  if (typeof error === "string") return error;

  // Axios-like error with a response message
  if (error.response?.data?.message) return error.response.data.message;

  // Fetch-like error
  if (error.message) return error.message;

  try {
    return JSON.stringify(error);
  } catch {
    return "An unexpected error occurred.";
  }
}

// ==== GENERIC HELPERS ====
export function truncate(str, max = 100) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}


// ✅ Add this function:
export function formatCurrency(amount, currency = "USD") {
  if (typeof amount !== "number") return amount; // safeguard

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}