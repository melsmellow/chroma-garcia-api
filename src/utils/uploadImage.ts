import type { UploadApiResponse } from "cloudinary";

import cloudinary from "../config/cloudinary.js";

interface UploadImageOptions {
  folder: string;
}

export const uploadImage = (
  file: Express.Multer.File,
  options: UploadImageOptions
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary did not return an upload result."));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};