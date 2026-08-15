import { Model, Schema, model, models } from "mongoose";
import type { Artist } from "../types/artist.types.js";


export interface IArtist extends Artist {
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
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
    },
    palette: {
      type: [String],
      default: [],
    },
    social: {
      instagram: String,
      facebook: String,
      website: String,
    },
    portraitUrl: String,
  },
  {
    timestamps: true,
  }
);

const Artist: Model<IArtist> =
  models.Artist || model<IArtist>("Artist", ArtistSchema);

export default Artist;