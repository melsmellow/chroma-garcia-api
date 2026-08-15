import type {
  Request,
  Response,
  NextFunction,
} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required.",
    });

    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof decoded === "string") {
      res.status(401).json({
        message: "Invalid authentication token.",
      });

      return;
    }

    req.user = decoded as JwtPayload;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
};