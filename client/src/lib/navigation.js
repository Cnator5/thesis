// // lib/navigation.js
// import {
//   BookOpen,
//   BookmarkCheck,
//   Building,
//   FileText,
//   LayoutDashboard,
//   Library,
//   ListChecks,
//   Users
// } from "lucide-react";

// export const NAV_ITEMS = [
//   { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Articles", href: "/articles", icon: FileText },
//   { label: "Courses", href: "/courses", icon: BookOpen },
//   { label: "Library", href: "/library", icon: Library },
//   { label: "Borrows", href: "/borrows", icon: BookmarkCheck }
// ];

// export const ADMIN_NAV_ITEMS = [
//   { label: "Departments", href: "/departments", icon: Building, roles: ["ADMIN"] },
//   { label: "Topics", href: "/topics", icon: ListChecks, roles: ["ADMIN"] },
//   { label: "User Accounts", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
//   { label: "Borrow Admin", href: "/admin/borrows", icon: Library, roles: ["ADMIN"] }
// ];



import {
  BookOpen,
  BookmarkCheck,
  Building,
  FileText,
  LayoutDashboard,
  Library,
  ListChecks,
  Users
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Articles", href: "/dashboard/articles", icon: FileText },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Library", href: "/dashboard/library", icon: Library },
  { label: "Borrows", href: "/dashboard/borrows", icon: BookmarkCheck }
];

export const ADMIN_NAV_ITEMS = [
  { label: "Departments", href: "/dashboard/departments", icon: Building, roles: ["ADMIN"] },
  { label: "Topics", href: "/dashboard/topics", icon: ListChecks, roles: ["ADMIN"] },
  { label: "User Accounts", href: "/dashboard/admin/users", icon: Users, roles: ["ADMIN"] },
  { label: "Borrow Admin", href: "/dashboard/admin/borrows", icon: Library, roles: ["ADMIN"] }
];