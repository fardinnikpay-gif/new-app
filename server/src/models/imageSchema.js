import mongoose from "mongoose";

// Shared by Category (single image) and Product (images[]).
// publicId is needed to delete or replace the file on Cloudinary later.
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: [true, "Image url is required"], trim: true },
    publicId: { type: String, required: [true, "Image publicId is required"], trim: true },
  },
  { _id: false }
);

export default imageSchema;