import type { Types } from "mongoose";

export type ArtworkStatus =
  | "Available"
  | "Reserved"
  | "Sold"
  | "Not for Sale";

export interface Artwork {
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

  isFeatured?: boolean;

  likeCount: number;
}