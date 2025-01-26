import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key-2025";

interface JwtPayload {
  id: number;
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    console.log(jwt.verify(token, JWT_SECRET) as JwtPayload);
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (e) {
    throw new Error("failed token verification");
  }
};
