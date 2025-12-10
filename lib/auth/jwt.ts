import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET ?? 'your-secret-key-change-in-production') as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];

export interface JWTPayload {
  id: string;
  type: 'user' | 'admin';
  email?: string;
  username?: string;
}

export function generateToken(payload: JWTPayload): string {
  const opts: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload as jwt.JwtPayload, JWT_SECRET, opts);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload | string;
    if (typeof decoded === 'string') return null;
    // now TS knows decoded is an object
    return decoded as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function generateConsentToken(): string {
  const opts: SignOptions = { expiresIn: '30d' };
  return jwt.sign({ type: 'consent', random: Math.random() }, JWT_SECRET, opts);
}
