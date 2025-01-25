import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key-2025";

interface JwtPayload {
  id: number;
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    console.log(jwt.verify(token, JWT_SECRET) as JwtPayload);
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (e) {
    return null;
  }
};
