import type { Request, Response } from "express";

import ArtistModel from "../models/Artist.js";
import { uploadImage } from "../utils/uploadImage.js";

// GET /api/artists
export const getArtists = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const artists = await ArtistModel.find().sort({
      name: 1,
    });

    res.status(200).json({
      artists,
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
    const { slug, name, artStyle, medium, bio, palette, social, portraitUrl } =
      req.body;

    // If the slug is being changed, make sure it isn't already used
    if (slug) {
      const existingArtist = await ArtistModel.findOne({
        slug,
        _id: {
          $ne: req.params.id,
        },
      });

      if (existingArtist) {
        res.status(409).json({
          message: "An artist with this slug already exists.",
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
        palette,
        social,
        portraitUrl,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!artist) {
      res.status(404).json({
        message: "Artist not found.",
      });

      return;
    }

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

    res.status(200).json({
      message: "Artist deleted successfully.",
    });
  } catch (error) {
    console.error("Delete artist error:", error);

    res.status(500).json({
      message: "Failed to delete artist.",
    });
  }
};
