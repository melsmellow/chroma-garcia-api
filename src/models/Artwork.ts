import { Document, Model, Schema, Types, model, models } from "mongoose";

export type ArtworkStatus =
  | "Available"
  | "Reserved"
  | "Sold"
  | "Not for Sale";

export interface IArtwork extends Document {
  slug: string;
  title: string;
  artist: Types.ObjectId;
  imageUrl: string;
  medium: string;
  category: string;
  tags: string[];
  description: string;
  year: number;
  dimensions: string;
  palette: string[];
  status: ArtworkStatus;
  price?: number;
  currency?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkSchema = new Schema<IArtwork>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
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
      enum: ["Available", "Reserved", "Sold", "Not for Sale"],
      default: "Available",
      index: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "PHP",
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Artwork: Model<IArtwork> =
  models.Artwork || model<IArtwork>("Artwork", ArtworkSchema);

export default Artwork;