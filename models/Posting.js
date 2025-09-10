const { Schema, models, model } = require("mongoose");

const PostingSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    client: { type: String },
    postingCategory: [{ type: String }],
    tags: [{ type: String }],
    livePreview: { type: String },
    status: { type: String },
  },
  {
    timestamps: true, // this will automatically manage createdAt and updatedAt
  }
);

// Export the Posting model
export const Posting =
  models.Posting || model("Posting", PostingSchema, "postings");
