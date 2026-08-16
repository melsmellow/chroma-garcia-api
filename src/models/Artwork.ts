import { Schema, model } from "mongoose";

import type {
  Artwork,
  ArtworkStatus,
} from "../types/artwork.type.js";

const artworkStatuses: ArtworkStatus[] = [
  "Available",
  "Reserved",
  "Sold",
  "Not for Sale",
];

const ArtworkSchema = new Schema<Artwork>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
      index: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    medium: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      required: true,
      default: [],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    dimensions: {
      type: String,
      required: true,
      trim: true,
    },

    palette: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      required: true,
      enum: artworkStatuses,
      default: "Available",
    },

    price: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "PHP",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ArtworkModel = model<Artwork>(
  "Artwork",
  ArtworkSchema
);

export default ArtworkModel;