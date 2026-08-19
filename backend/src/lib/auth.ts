import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  id: number;
  email: string;
  tipo?: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'luminasaber-dev-secret';
const JWT_EXPIRES_IN = '8h';

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}
