import { Schema, model } from "mongoose";

import type {
  Artist,
  ArtistSocial,
} from "../types/artist.types.js";

const ArtistSocialSchema = new Schema<ArtistSocial>(
  {
    instagram: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const ArtistSchema = new Schema<Artist>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    artStyle: {
      type: String,
      required: true,
      trim: true,
    },

    medium: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    palette: {
      type: [String],
      required: true,
      default: [],
    },

    social: {
      type: ArtistSocialSchema,
      required: false,
    },

    portraitUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ArtistModel = model<Artist>(
  "Artist",
  ArtistSchema
);

export default ArtistModel;