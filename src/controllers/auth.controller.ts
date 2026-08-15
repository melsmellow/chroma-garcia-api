import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { LoginInput, SignupInput } from "../types/user.types.js";
import User from "../models/User.js";
import { generateToken } from "../lib/jwt.js";


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
  res: Response
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
  res: Response
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

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

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
export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  res.status(200).json({
    message: "Logged out successfully.",
  });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Don't reveal whether an email exists
    if (!user) {
      res.status(200).json({
        message:
          "If an account exists with this email, password reset instructions will be sent.",
      });

      return;
    }

    // TODO:
    // 1. Generate reset token
    // 2. Save hashed token + expiry to User
    // 3. Send reset link via email

    res.status(200).json({
      message:
        "If an account exists with this email, password reset instructions will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Failed to process password reset request.",
    });
  }
};