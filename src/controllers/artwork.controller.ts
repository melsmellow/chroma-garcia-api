import type { Request, Response } from "express";

import ArtistModel from "../models/Artist.js";
import ArtworkModel from "../models/Artwork.js";
import type { Artwork } from "../types/artwork.type.js";
import { uploadImage } from "../utils/uploadImage.js";

// GET /api/artworks
export const getArtworks = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const artworks = await ArtworkModel.find()
      .populate("artist")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      artworks,
    });
  } catch (error) {
    console.error("Get artworks error:", error);

    res.status(500).json({
      message: "Failed to fetch artworks.",
    });
  }
};

// GET /api/artworks/:slug
export const getArtworkBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const artwork = await ArtworkModel.findOne({
      slug: req.params.slug,
    }).populate("artist");

    if (!artwork) {
      res.status(404).json({
        message: "Artwork not found.",
      });

      return;
    }

    res.status(200).json({
      artwork,
    });
  } catch (error) {
    console.error("Get artwork error:", error);

    res.status(500).json({
      message: "Failed to fetch artwork.",
    });
  }
};

// POST /api/admin/artworks
export const createArtwork = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      slug,
      title,
      artist,
      medium,
      category,
      tags,
      description,
      year,
      dimensions,
      palette,
      status,
      price,
      currency,
      isFeatured,
    } = req.body;

    if (!req.file) {
      res.status(400).json({
        message: "Artwork image is required.",
      });

      return;
    }

    const artistExists = await ArtistModel.exists({
      _id: artist,
    });

    if (!artistExists) {
      res.status(400).json({
        message: "Invalid artist.",
      });

      return;
    }

    const existingArtwork = await ArtworkModel.findOne({
      slug,
    });

    if (existingArtwork) {
      res.status(409).json({
        message: "An artwork with this slug already exists.",
      });

      return;
    }

    let imageUrl: string;

    try {
      const uploadResult = await uploadImage(req.file, {
        folder: "chroma-garcia/artworks",
      });

      imageUrl = uploadResult.secure_url;
    } catch (error) {
      console.error("Cloudinary artwork upload error:", error);

      res.status(502).json({
        message: "Failed to upload artwork image.",
      });

      return;
    }

    const artwork = await ArtworkModel.create({
      slug,
      title,
      artist,

      imageUrl,

      medium,
      category,

      tags: JSON.parse(tags),

      description,

      year: Number(year),
      dimensions,

      palette: JSON.parse(palette),

      status,

      price: price ? Number(price) : undefined,

      currency,

      isFeatured: isFeatured === "true",

      likeCount: 0,
    });

    await artwork.populate("artist");

    res.status(201).json({
      message: "Artwork created successfully.",
      artwork,
    });
  } catch (error) {
    console.error("Create artwork error:", error);

    res.status(500).json({
      message: "Failed to create artwork.",
    });
  }
};
// PATCH /api/admin/artworks/:id
export const updateArtwork = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updates: Partial<Artwork> = {};

    const allowedFields: Array<keyof Artwork> = [
      "slug",
      "title",
      "artist",
      "imageUrl",
      "medium",
      "category",
      "tags",
      "description",
      "year",
      "dimensions",
      "palette",
      "status",
      "price",
      "currency",
      "isFeatured",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validate artist if it is being changed
    if (updates.artist) {
      const artistExists = await ArtistModel.exists({
        _id: updates.artist,
      });

      if (!artistExists) {
        res.status(400).json({
          message: "Invalid artist.",
        });

        return;
      }
    }

    // Check for duplicate slug if slug is changing
    if (updates.slug) {
      const existingArtwork = await ArtworkModel.findOne({
        slug: updates.slug,
        _id: {
          $ne: req.params.id,
        },
      });

      if (existingArtwork) {
        res.status(409).json({
          message: "An artwork with this slug already exists.",
        });

        return;
      }
    }

    const artwork = await ArtworkModel.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("artist");

    if (!artwork) {
      res.status(404).json({
        message: "Artwork not found.",
      });

      return;
    }

    res.status(200).json({
      message: "Artwork updated successfully.",
      artwork,
    });
  } catch (error) {
    console.error("Update artwork error:", error);

    res.status(500).json({
      message: "Failed to update artwork.",
    });
  }
};

// DELETE /api/admin/artworks/:id
export const deleteArtwork = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const artwork = await ArtworkModel.findByIdAndDelete(
      req.params.id
    );

    if (!artwork) {
      res.status(404).json({
        message: "Artwork not found.",
      });

      return;
    }

    res.status(200).json({
      message: "Artwork deleted successfully.",
    });
  } catch (error) {
    console.error("Delete artwork error:", error);

    res.status(500).json({
      message: "Failed to delete artwork.",
    });
  }
};

// POST /api/artworks/:slug/like
export const likeArtwork = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const artwork = await ArtworkModel.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      {
        $inc: {
          likeCount: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!artwork) {
      res.status(404).json({
        message: "Artwork not found.",
      });

      return;
    }

    res.status(200).json({
      message: "Artwork liked.",
      likeCount: artwork.likeCount,
    });
  } catch (error) {
    console.error("Like artwork error:", error);

    res.status(500).json({
      message: "Failed to like artwork.",
    });
  }
};

// GET /api/artists/:slug/artworks
export const getArtworksByArtistSlug = async (
  req: Request,
  res: Response
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

    const artworks = await ArtworkModel.find({
      artist: artist._id,
    })
      .populate("artist")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      artist,
      artworks,
    });
  } catch (error) {
    console.error("Get artworks by artist error:", error);

    res.status(500).json({
      message: "Failed to fetch artworks.",
    });
  }
};