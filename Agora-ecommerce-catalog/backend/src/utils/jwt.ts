import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { JwtAccessPayload, JwtRefreshPayload, UserRole } from '../types';

// Helper to convert expiry string to seconds
const parseExpiry = (expiry: string): number => {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // Default 15 minutes
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 900;
  }
};

// Generate access token (short-lived)
export const generateAccessToken = (
  userId: number,
  email: string,
  role: UserRole
): string => {
  const payload: JwtAccessPayload = {
    userId,
    email,
    role,
  };

  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: parseExpiry(env.jwt.accessExpiry),
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId: number): {
  token: string;
  tokenId: string;
} => {
  const tokenId = uuidv4();
  
  const payload: JwtRefreshPayload = {
    userId,
    tokenId,
  };

  const token = jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: parseExpiry(env.jwt.refreshExpiry),
  });

  return { token, tokenId };
};

// Verify access token
export const verifyAccessToken = (token: string): JwtAccessPayload | null => {
  try {
    return jwt.verify(token, env.jwt.accessSecret) as JwtAccessPayload;
  } catch {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtRefreshPayload | null => {
  try {
    return jwt.verify(token, env.jwt.refreshSecret) as JwtRefreshPayload;
  } catch {
    return null;
  }
};

// Decode token without verification (for debugging)
export const decodeToken = (token: string): unknown => {
  return jwt.decode(token);
};

// Get token expiry time in seconds
export const getTokenExpiry = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // Default 15 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 900;
  }
};

// Calculate refresh token expiry date
export const getRefreshTokenExpiryDate = (): Date => {
  const expirySeconds = getTokenExpiry(env.jwt.refreshExpiry);
  return new Date(Date.now() + expirySeconds * 1000);
};

