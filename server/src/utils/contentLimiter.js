// src/utils/contentLimiter.js
export const buildPreview = (sections = [], maxPages = 2) => {
  if (!Array.isArray(sections) || !sections.length) return [];
  return sections.filter((section) => section.pageNumber <= maxPages);
};