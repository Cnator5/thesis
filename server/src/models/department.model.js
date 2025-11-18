// // src/models/department.model.js
// import mongoose from "mongoose";

// const departmentSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, unique: true, trim: true },
//     slug: { type: String, required: true, unique: true },
//     description: String,
//     bannerImage: String,
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
//   },
//   { timestamps: true }
// );

// const DepartmentModel = mongoose.model("Department", departmentSchema);
// export default DepartmentModel;



import mongoose from "mongoose";

const formatCodePrefix = (value) =>
  typeof value === "string" ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase() : value;

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    bannerImage: String,
    codePrefix: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 10,
      set: formatCodePrefix
    },
    topicCodeSequence: {
      type: Number,
      min: 0,
      default: 0
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const DepartmentModel = mongoose.model("Department", departmentSchema);
export default DepartmentModel;