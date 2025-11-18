// // src/controllers/article.controller.js
// import slugify from "slugify";
// import ArticleModel from "../models/article.model.js";
// import TopicModel from "../models/topic.model.js";
// import DepartmentModel from "../models/department.model.js";
// import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
// import { buildPreview } from "../utils/contentLimiter.js";

// const parseJsonField = (input, fallback = []) => {
//   if (!input) return fallback;
//   if (Array.isArray(input)) return input;

//   try {
//     const parsed = JSON.parse(input);
//     if (Array.isArray(parsed)) return parsed;
//   } catch {
//     if (typeof input === "string") {
//       return input.split(",").map((item) => item.trim()).filter(Boolean);
//     }
//   }
//   return fallback;
// };

// export const createArticle = async (req, res) => {
//   const {
//     title,
//     projectCode,
//     abstract,
//     bodySections,
//     previewPageLimit,
//     topicId,
//     departmentId,
//     tags,
//     allowDownload,
//     priceLocal,
//     priceInternational,
//     totalPages
//   } = req.body;

//   const topic = await TopicModel.findById(topicId);
//   const department = await DepartmentModel.findById(departmentId);

//   if (!topic || !department) {
//     return res.status(404).json({ success: false, message: "Topic or department not found." });
//   }

//   const sections = parseJsonField(bodySections);
//   if (!sections.length) {
//     return res.status(400).json({ success: false, message: "At least one body section is required." });
//   }

//   const parsedTags = parseJsonField(tags);

//   const slugBase = slugify(`${title}-${projectCode}`, { lower: true, strict: true });
//   let slug = slugBase;
//   let counter = 1;
//   while (await ArticleModel.findOne({ slug })) {
//     slug = `${slugBase}-${counter++}`;
//   }

//   let coverImage;
//   let coverPublicId;
//   let pdfUrl;
//   let pdfPublicId;

//   if (req.files?.coverImage?.length) {
//     const file = req.files.coverImage[0];
//     const upload = await uploadBufferToCloudinary(file.buffer, {
//       folder: "research/articles/covers",
//       resourceType: "image"
//     });
//     coverImage = upload.secure_url;
//     coverPublicId = upload.public_id;
//   }

//   if (req.files?.pdfDocument?.length) {
//     const file = req.files.pdfDocument[0];
//     const upload = await uploadBufferToCloudinary(file.buffer, {
//       folder: "research/articles/pdfs",
//       resourceType: "raw"
//     });
//     pdfUrl = upload.secure_url;
//     pdfPublicId = upload.public_id;
//   }

//   const article = await ArticleModel.create({
//     title,
//     slug,
//     projectCode,
//     abstract,
//     bodySections: sections,
//     previewPageLimit: Number(previewPageLimit) || 2,
//     department: departmentId,
//     topic: topicId,
//     tags: parsedTags,
//     author: req.user.id,
//     coverImage,
//     coverPublicId,
//     pdfUrl,
//     pdfPublicId,
//     allowDownload: Boolean(allowDownload),
//     priceLocal: Number(priceLocal) || 0,
//     priceInternational: Number(priceInternational) || 0,
//     totalPages: Number(totalPages) || sections.length
//   });

//   res.status(201).json({
//     success: true,
//     message: "Article submitted for review.",
//     data: article
//   });
// };

// export const listArticles = async (req, res) => {
//   const { departmentId, topicId, status, keyword, page = 1, limit = 10 } = req.query;

//   const filter = {};
//   if (departmentId) filter.department = departmentId;
//   if (topicId) filter.topic = topicId;
//   if (status) filter.status = status;
//   if (keyword) filter.$text = { $search: keyword };

//   const numericPage = Math.max(Number(page), 1);
//   const numericLimit = Math.max(Number(limit), 1);

//   const [articles, total] = await Promise.all([
//     ArticleModel.find(filter)
//       .populate("department", "name")
//       .populate("topic", "title code")
//       .populate("author", "name username")
//       .select("title slug projectCode abstract previewPageLimit coverImage viewCount downloadCount priceLocal priceInternational status createdAt")
//       .sort({ createdAt: -1 })
//       .skip((numericPage - 1) * numericLimit)
//       .limit(numericLimit),
//     ArticleModel.countDocuments(filter)
//   ]);

//   res.json({
//     success: true,
//     data: articles,
//     pagination: {
//       total,
//       page: numericPage,
//       pages: Math.ceil(total / numericLimit)
//     }
//   });
// };

// export const getArticlePreview = async (req, res) => {
//   const article = await ArticleModel.findById(req.params.articleId)
//     .populate("department", "name")
//     .populate("topic", "title code")
//     .populate("author", "name username");

//   if (!article) {
//     return res.status(404).json({ success: false, message: "Article not found." });
//   }

//   article.viewCount += 1;
//   await article.save();

//   res.json({
//     success: true,
//     data: {
//       id: article._id,
//       title: article.title,
//       projectCode: article.projectCode,
//       abstract: article.abstract,
//       previewSections: buildPreview(article.bodySections, article.previewPageLimit),
//       department: article.department,
//       topic: article.topic,
//       author: article.author,
//       coverImage: article.coverImage,
//       totalPages: article.totalPages,
//       priceLocal: article.priceLocal,
//       priceInternational: article.priceInternational,
//       status: article.status,
//       viewCount: article.viewCount,
//       downloadCount: article.downloadCount
//     }
//   });
// };

// export const adminListArticles = async (req, res) => {
//   const filter = req.query.status ? { status: req.query.status } : {};
//   const articles = await ArticleModel.find(filter)
//     .populate("department", "name")
//     .populate("topic", "title")
//     .populate("author", "name email username")
//     .sort({ createdAt: -1 });

//   res.json({ success: true, data: articles });
// };

// export const updateArticleStatus = async (req, res) => {
//   const { status } = req.body;

//   const article = await ArticleModel.findByIdAndUpdate(
//     req.params.articleId,
//     { status },
//     { new: true }
//   );

//   res.json({
//     success: true,
//     message: "Article status updated.",
//     data: article
//   });
// };

// export const recordDownload = async (req, res) => {
//   const article = await ArticleModel.findById(req.params.articleId);
//   if (!article) {
//     return res.status(404).json({ success: false, message: "Article not found." });
//   }

//   if (!article.allowDownload && req.user.role === "STUDENT") {
//     return res.status(403).json({ success: false, message: "Download restricted for this article." });
//   }

//   article.downloadCount += 1;
//   await article.save();

//   res.json({
//     success: true,
//     message: "Download recorded.",
//     data: { pdfUrl: article.pdfUrl }
//   });
// };








import slugify from "slugify";
import ArticleModel from "../models/article.model.js";
import TopicModel from "../models/topic.model.js";
import DepartmentModel from "../models/department.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { buildPreview } from "../utils/contentLimiter.js";

const parseJsonField = (input, fallback = []) => {
  if (!input) return fallback;
  if (Array.isArray(input)) return input;

  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    if (typeof input === "string") {
      return input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return fallback;
};

export const createArticle = async (req, res) => {
  try {
    const {
      title,
      projectCode,
      abstract,
      bodySections,
      previewPageLimit,
      topicId,
      departmentId,
      tags,
      allowDownload,
      priceLocal,
      priceInternational,
      totalPages,
    } = req.body;

    const topic = await TopicModel.findById(topicId);
    const department = await DepartmentModel.findById(departmentId);

    if (!topic || !department) {
      return res
        .status(404)
        .json({ success: false, message: "Topic or department not found." });
    }

    const sections = parseJsonField(bodySections);
    if (!sections.length) {
      return res
        .status(400)
        .json({ success: false, message: "At least one body section is required." });
    }

    const parsedTags = parseJsonField(tags);

    const slugBase = slugify(`${title}-${projectCode}`, {
      lower: true,
      strict: true,
    });
    let slug = slugBase;
    let counter = 1;
    while (await ArticleModel.findOne({ slug })) {
      slug = `${slugBase}-${counter++}`;
    }

    let coverImage;
    let coverPublicId;
    let pdfUrl;
    let pdfPublicId;

    if (req.files?.coverImage?.length) {
      const file = req.files.coverImage[0];
      const upload = await uploadBufferToCloudinary(file.buffer, {
        folder: "research/articles/covers",
        resourceType: "image",
      });
      coverImage = upload.secure_url;
      coverPublicId = upload.public_id;
    }

    if (req.files?.pdfDocument?.length) {
      const file = req.files.pdfDocument[0];
      const upload = await uploadBufferToCloudinary(file.buffer, {
        folder: "research/articles/pdfs",
        resourceType: "raw",
      });
      pdfUrl = upload.secure_url;
      pdfPublicId = upload.public_id;
    }

    const article = await ArticleModel.create({
      title,
      slug,
      projectCode,
      abstract,
      bodySections: sections,
      previewPageLimit: Number(previewPageLimit) || 2,
      department: departmentId,
      topic: topicId,
      tags: parsedTags,
      author: req.user.id,
      coverImage,
      coverPublicId,
      pdfUrl,
      pdfPublicId,
      allowDownload: allowDownload === "true",
      priceLocal: Number(priceLocal) || 0,
      priceInternational: Number(priceInternational) || 0,
      totalPages: Number(totalPages) || sections.length,
    });

    res.status(201).json({
      success: true,
      message: "Article submitted for review.",
      data: article,
    });
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listArticles = async (req, res) => {
  const { departmentId, topicId, status, keyword, page = 1, limit = 10 } =
    req.query;

  const filter = {};
  if (departmentId) filter.department = departmentId;
  if (topicId) filter.topic = topicId;
  if (status) filter.status = status;
  if (keyword) filter.$text = { $search: keyword };

  const numericPage = Math.max(Number(page), 1);
  const numericLimit = Math.max(Number(limit), 1);

  const [articles, total] = await Promise.all([
    ArticleModel.find(filter)
      .populate("department", "name")
      .populate("topic", "title code")
      .populate("author", "name username")
      .select(
        "title slug projectCode abstract previewPageLimit coverImage viewCount downloadCount priceLocal priceInternational status createdAt"
      )
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),
    ArticleModel.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: articles,
    pagination: {
      total,
      page: numericPage,
      pages: Math.ceil(total / numericLimit),
    },
  });
};

export const getArticlePreview = async (req, res) => {
  const article = await ArticleModel.findById(req.params.articleId)
    .populate("department", "name")
    .populate("topic", "title code")
    .populate("author", "name username");

  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found." });
  }

  article.viewCount += 1;
  await article.save();

  res.json({
    success: true,
    data: {
      id: article._id,
      title: article.title,
      projectCode: article.projectCode,
      abstract: article.abstract,
      previewSections: buildPreview(
        article.bodySections,
        article.previewPageLimit
      ),
      department: article.department,
      topic: article.topic,
      author: article.author,
      coverImage: article.coverImage,
      totalPages: article.totalPages,
      priceLocal: article.priceLocal,
      priceInternational: article.priceInternational,
      status: article.status,
      viewCount: article.viewCount,
      downloadCount: article.downloadCount,
    },
  });
};

export const adminListArticles = async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const articles = await ArticleModel.find(filter)
    .populate("department", "name")
    .populate("topic", "title")
    .populate("author", "name email username")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: articles });
};

export const updateArticleStatus = async (req, res) => {
  const { status } = req.body;

  const article = await ArticleModel.findByIdAndUpdate(
    req.params.articleId,
    { status },
    { new: true }
  );

  res.json({
    success: true,
    message: "Article status updated.",
    data: article,
  });
};

export const recordDownload = async (req, res) => {
  const article = await ArticleModel.findById(req.params.articleId);
  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found." });
  }

  if (!article.allowDownload && req.user.role === "STUDENT") {
    return res.status(403).json({
      success: false,
      message: "Download restricted for this article.",
    });
  }

  article.downloadCount += 1;
  await article.save();

  res.json({
    success: true,
    message: "Download recorded.",
    data: { pdfUrl: article.pdfUrl },
  });
};
