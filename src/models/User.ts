import { Schema, model } from "mongoose";
import type { IUser, UserRole } from "../types/user.types.js";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
    type: String,
    enum: ["admin", "officer"] as UserRole[],
    default: "admin",
    required: true,
  },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>("User", UserSchema);

export default User;
