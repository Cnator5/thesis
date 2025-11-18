// lib/SummaryApi.js
const SummaryApi = {
  auth: {
    register: { url: "/api/auth/register", method: "POST" },
    verifyOtp: { url: "/api/auth/verify-otp", method: "POST" },
    resendOtp: { url: "/api/auth/resend-otp", method: "POST" },
    login: { url: "/api/auth/login", method: "POST" },
    logout: { url: "/api/auth/logout", method: "POST" },
    refreshToken: { url: "/api/auth/refresh-token", method: "POST" },
    forgotPassword: { url: "/api/auth/forgot-password", method: "POST" },
    resetPassword: { url: "/api/auth/reset-password", method: "POST" },
    me: { url: "/api/auth/me", method: "GET" }
  },
  users: {
    list: { url: "/api/users", method: "GET" },
    createAdmin: { url: "/api/users/create-admin", method: "POST" },
    updateProfile: { url: "/api/users/profile", method: "PUT" }
  },
  departments: {
    list: { url: "/api/departments", method: "GET" },
    create: { url: "/api/departments", method: "POST" },
    update: (id) => ({ url: `/api/departments/${id}`, method: "PUT" }),
    remove: (id) => ({ url: `/api/departments/${id}`, method: "DELETE" })
  },
  topics: {
    list: { url: "/api/topics", method: "GET" },
    create: { url: "/api/topics", method: "POST" },
    update: (id) => ({ url: `/api/topics/${id}`, method: "PUT" }),
    remove: (id) => ({ url: `/api/topics/${id}`, method: "DELETE" })
  },
  articles: {
    list: { url: "/api/articles", method: "GET" },
    create: { url: "/api/articles", method: "POST" },
    preview: (id) => ({ url: `/api/articles/${id}`, method: "GET" }),
    adminList: { url: "/api/articles/admin/list", method: "GET" },
    updateStatus: (id) => ({ url: `/api/articles/${id}/status`, method: "PUT" }),
    download: (id) => ({ url: `/api/articles/${id}/download`, method: "POST" })
  },
  courses: {
    list: { url: "/api/courses", method: "GET" },
    create: { url: "/api/courses", method: "POST" },
    update: (id) => ({ url: `/api/courses/${id}`, method: "PUT" }),
    updateStatus: (id) => ({ url: `/api/courses/${id}/status`, method: "PUT" }),
    details: (id) => ({ url: `/api/courses/${id}`, method: "GET" }),
    enroll: (id) => ({ url: `/api/courses/${id}/enrol`, method: "POST" })
  },
  books: {
    list: { url: "/api/books", method: "GET" },
    create: { url: "/api/books", method: "POST" },
    details: (id) => ({ url: `/api/books/${id}`, method: "GET" }),
    update: (id) => ({ url: `/api/books/${id}`, method: "PUT" }),
    remove: (id) => ({ url: `/api/books/${id}`, method: "DELETE" })
  },
  borrows: {
    mine: { url: "/api/borrows/me", method: "GET" },
    adminList: { url: "/api/borrows", method: "GET" },
    create: { url: "/api/borrows", method: "POST" },
    return: { url: "/api/borrows/return", method: "POST" }
  },
  dashboard: {
    student: { url: "/api/dashboard/student", method: "GET" },
    instructor: { url: "/api/dashboard/instructor", method: "GET" },
    admin: { url: "/api/dashboard/admin", method: "GET" }
  },
  search: {
    global: { url: "/api/search", method: "GET" }
  }
};

export default SummaryApi;