const mongoose = require("mongoose");
const slugify = require("slugify");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: Object, required: true }, // Quill editor stores JSON delta
    featureImages: [{ type: String }], // Base64 images stored as strings
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate slug before saving
BlogSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
