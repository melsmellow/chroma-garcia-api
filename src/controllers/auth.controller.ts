import type { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import type { LoginInput, SignupInput } from "../types/user.types.js";
import User from "../models/User.js";
import { generateToken } from "../lib/jwt.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

const COOKIE_NAME = "token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/auth/signup
export const signup = async (
  req: Request<{}, {}, SignupInput>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409).json({
        message: "Email is already registered.",
      });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role ?? "officer",
    });

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Failed to create user.",
    });
  }
};

// POST /api/auth/login
export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash");

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password.",
      });

      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password.",
      });

      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const response: {
      message: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
      token?: string;
    } = {
      message: "Login successful.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    // Only expose the JWT in development
    if (process.env.NODE_ENV === "development") {
      response.token = token;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
};

// POST /api/auth/logout
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "Logged out successfully.",
  });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: "Email is required.",
      });

      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+passwordResetToken +passwordResetExpires");

    // Prevent email enumeration
    if (!user) {
      res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });

      return;
    }

    // Generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedResetToken;

    // 1 hour expiration
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    const resetUrl =
      `${process.env.FRONTEND_URL}` + `/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });
    } catch (emailError) {
      // Remove token if email failed
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      console.error("Failed to send password reset email:", emailError);

      res.status(500).json({
        message: "Failed to send password reset email. Please try again.",
      });

      return;
    }

    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Failed to process password reset request.",
    });
  }
};
