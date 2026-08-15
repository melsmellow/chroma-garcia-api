import jwt, { type JwtPayload } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined.");
}

export const generateToken = ({
  userId,
  role,
}: JwtPayload): string => {
  return jwt.sign(
    {
      userId,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};