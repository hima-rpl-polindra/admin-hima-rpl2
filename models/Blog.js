const { Schema, models, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    blogCategory: [{ type: String }],
    tags: [{ type: String }],
    status: { type: String, default: "draft" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true, // this will automatically manage createdAt and updatedAt
  }
);

// Export the Blog model
export const Blog = models.Blog || model("Blog", BlogSchema, "blogs");
