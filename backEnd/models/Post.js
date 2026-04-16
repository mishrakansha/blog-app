import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    category: {
      type: String,
      enum: ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business", "Education", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 1 }, // in minutes
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: Comment Count ───────────────────────────────────────────────
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// ─── Pre-save: Generate Slug & Read Time ─────────────────────────────────
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
  }
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  if (this.isModified("content") && !this.excerpt) {
    this.excerpt = this.content.replace(/<[^>]+>/g, "").substring(0, 200) + "...";
  }
  next();
});

// ─── Index for Search ─────────────────────────────────────────────────────
postSchema.index({ title: "text", content: "text", tags: "text" });

const Post = mongoose.model("Post", postSchema);
export default Post;
