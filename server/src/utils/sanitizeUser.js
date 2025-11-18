// src/utils/sanitizeUser.js
const sanitizeUser = (user) => {
  if (!user) return null;
  const data = user.toObject ? user.toObject() : user;
  return {
    id: data._id,
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    role: data.role,
    status: data.status,
    isVerified: data.isVerified,
    emailVerified: data.emailVerified,
    phoneVerified: data.phoneVerified,
    lastLoginAt: data.lastLoginAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

export default sanitizeUser;