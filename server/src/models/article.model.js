// // src/models/article.model.js
// import mongoose from "mongoose";

// const sectionSchema = new mongoose.Schema(
//   {
//     heading: String,
//     content: String,
//     pageNumber: Number
//   },
//   { _id: false }
// );

// const articleSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     slug: { type: String, required: true, unique: true },
//     projectCode: { type: String, required: true },
//     abstract: { type: String, required: true },
//     bodySections: [sectionSchema],
//     previewPageLimit: { type: Number, default: 2 },

//     department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
//     topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
//     tags: [{ type: String, lowercase: true }],

//     author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     coverImage: String,
//     coverPublicId: String,
//     pdfUrl: String,
//     pdfPublicId: String,
//     allowDownload: { type: Boolean, default: false },

//     totalPages: Number,
//     priceLocal: { type: Number, default: 0 },
//     priceInternational: { type: Number, default: 0 },

//     viewCount: { type: Number, default: 0 },
//     downloadCount: { type: Number, default: 0 },

//     status: {
//       type: String,
//       enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
//       default: "PENDING"
//     }
//   },
//   { timestamps: true }
// );

// articleSchema.index({ title: "text", abstract: "text", tags: 1 });

// const ArticleModel = mongoose.model("Article", articleSchema);
// export default ArticleModel;



import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    heading: String,
    content: String,
    pageNumber: Number,
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    projectCode: { type: String, required: true },
    abstract: { type: String, required: true },
    bodySections: [sectionSchema],
    previewPageLimit: { type: Number, default: 2 },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    tags: {
      type: [String],
      lowercase: true,
      default: [],
    },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverImage: String,
    coverPublicId: String,
    pdfUrl: String,
    pdfPublicId: String,
    allowDownload: { type: Boolean, default: false },

    totalPages: Number,
    priceLocal: { type: Number, default: 0 },
    priceInternational: { type: Number, default: 0 },

    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// ✅ Correct text index — all string fields are supported
articleSchema.index({ title: "text", abstract: "text", tags: "text" });

// ✅ Avoid model overwrite on hot reloads
const ArticleModel =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

export default ArticleModel;
