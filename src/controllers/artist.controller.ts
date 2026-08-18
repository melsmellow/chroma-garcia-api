import type { Request, Response } from "express";

import ArtistModel from "../models/Artist.js";
import ArtworkModel from "../models/Artwork.js";
import { uploadImage } from "../utils/uploadImage.js";

// GET /api/artists
export const getArtists = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              slug: {
                $regex: search,
                $options: "i",
              },
            },
            {
              artStyle: {
                $regex: search,
                $options: "i",
              },
            },
            {
              medium: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const [artists, total] = await Promise.all([
      ArtistModel.find(filter)
        .sort({
          name: 1,
        })
        .skip(skip)
        .limit(limit),

      ArtistModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      artists,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get artists error:", error);

    res.status(500).json({
      message: "Failed to fetch artists.",
    });
  }
};

// GET /api/artists/:slug
export const getArtistBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const artist = await ArtistModel.findOne({
      slug: req.params.slug,
    });

    if (!artist) {
      res.status(404).json({
        message: "Artist not found.",
      });

      return;
    }

    res.status(200).json({
      artist,
    });
  } catch (error) {
    console.error("Get artist error:", error);

    res.status(500).json({
      message: "Failed to fetch artist.",
    });
  }
};

// POST /api/admin/artists
export const createArtist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log(req);
  try {
    const {
      slug,
      name,
      artStyle,
      medium,
      bio,
      palette,
      instagram,
      facebook,
      website,
    } = req.body;

    const existingArtist = await ArtistModel.findOne({
      slug,
    });

    if (existingArtist) {
      res.status(409).json({
        message: "An artist with this slug already exists.",
      });

      return;
    }

    let portraitUrl: string | undefined;

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file, {
          folder: "chroma-garcia/artists",
        });

        portraitUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Cloudinary artist upload error:", error);

        res.status(502).json({
          message: "Failed to upload artist portrait.",
        });

        return;
      }
    }

    const artist = await ArtistModel.create({
      slug,
      name,
      artStyle,
      medium,
      bio,
      palette: JSON.parse(palette),
      social: {
        instagram,
        facebook,
        website,
      },
      portraitUrl,
    });

    res.status(201).json({
      message: "Artist created successfully.",
      artist,
    });
  } catch (error) {
    console.error("Create artist error:", error);

    res.status(500).json({
      message: "Failed to create artist.",
    });
  }
};
// PATCH /api/admin/artists/:id
export const updateArtist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      slug,
      name,
      artStyle,
      medium,
      bio,
      palette,
      instagram,
      facebook,
      website,
    } = req.body;

    const existingArtist = await ArtistModel.findById(req.params.id);

    if (!existingArtist) {
      res.status(404).json({
        message: "Artist not found.",
      });

      return;
    }

    // Check if another artist is already using this slug
    if (slug && slug !== existingArtist.slug) {
      const artistWithSameSlug = await ArtistModel.findOne({
        slug,
        _id: {
          $ne: req.params.id,
        },
      });

      if (artistWithSameSlug) {
        res.status(409).json({
          message: "An artist with this slug already exists.",
        });

        return;
      }
    }

    // Keep the existing image by default
    let portraitUrl = existingArtist.portraitUrl;

    // Only upload when a NEW file was sent
    if (req.file) {
      try {
        console.log("Uploading new portrait image for artist...");
        const uploadResult = await uploadImage(req.file, {
          folder: "chroma-garcia/artists",
        });

        portraitUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Cloudinary artist upload error:", error);

        res.status(502).json({
          message: "Failed to upload artist portrait.",
        });

        return;
      }
    }

    const artist = await ArtistModel.findByIdAndUpdate(
      req.params.id,
      {
        slug,
        name,
        artStyle,
        medium,
        bio,
        palette: JSON.parse(palette),
        social: {
          instagram,
          facebook,
          website,
        },
        portraitUrl,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "Artist updated successfully.",
      artist,
    });
  } catch (error) {
    console.error("Update artist error:", error);

    res.status(500).json({
      message: "Failed to update artist.",
    });
  }
};

// DELETE /api/admin/artists/:id
export const deleteArtist = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const artist = await ArtistModel.findByIdAndDelete(req.params.id);

    if (!artist) {
      res.status(404).json({
        message: "Artist not found.",
      });

      return;
    }

    // Cascade delete all artworks belonging to this artist
    const { deletedCount } = await ArtworkModel.deleteMany({
      artist: artist._id,
    });

    res.status(200).json({
      message: "Artist deleted successfully.",
      deletedArtworks: deletedCount,
    });
  } catch (error) {
    console.error("Delete artist error:", error);

    res.status(500).json({
      message: "Failed to delete artist.",
    });
  }
};
