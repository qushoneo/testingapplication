import { jwtVerify } from "jose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key-2025";

interface JwtPayload {
  id: string; // User ID
  email: string; // User email
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    console.log(token);
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (e) {
    console.log(e);
    return null;
  }
};
