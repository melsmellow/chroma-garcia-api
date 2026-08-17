import type { Request, Response } from "express";
import ArtistModel from "../models/Artist.js";
import ArtworkModel from "../models/Artwork.js";

export const getDashboardStats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [artists, artworks] = await Promise.all([
      ArtistModel.countDocuments(),
      ArtworkModel.countDocuments(),
    ]);

    res.status(200).json({
      stats: {
        artists,
        artworks,
        events: 0,
        outreach: 0,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics.",
    });
  }
};
