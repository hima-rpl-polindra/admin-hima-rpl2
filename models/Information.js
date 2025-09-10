const { Schema, models, model } = require("mongoose");

const InformationSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    informationCategory: [{ type: String }],
    tags: [{ type: String }],
    status: { type: String },
  },
  {
    timestamps: true, // this will automatically manage createdAt and updatedAt (
  }
);

// Export the Information model
export const Information =
  models.Information || model("Information", InformationSchema, "informations");
