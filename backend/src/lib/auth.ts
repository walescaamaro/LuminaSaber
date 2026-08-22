import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  id: number;
  email: string;
  tipo?: string;
}

const JWT_EXPIRES_IN = '8h';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET deve ser configurado com pelo menos 32 caracteres.');
  }
  return secret;
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}
