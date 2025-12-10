// /lib/auth/session.ts
import { NextRequest, NextResponse } from 'next/server';
import { JWTPayload, generateToken, verifyToken } from './jwt';

const USER_SESSION_COOKIE = 'user_session';
const ADMIN_SESSION_COOKIE = 'admin_session';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export function setUserSession(response: NextResponse, payload: JWTPayload): void {
  const token = generateToken(payload);
  response.cookies.set(USER_SESSION_COOKIE, token, COOKIE_OPTIONS);
}

export function setAdminSession(response: NextResponse, payload: JWTPayload): void {
  const token = generateToken(payload);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, COOKIE_OPTIONS);
}

export function getUserSession(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getAdminSession(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function clearUserSession(response: NextResponse): void {
  response.cookies.delete(USER_SESSION_COOKIE);
}

export function clearAdminSession(response: NextResponse): void {
  response.cookies.delete(ADMIN_SESSION_COOKIE);
}

export function clearAllSessions(response: NextResponse): void {
  clearUserSession(response);
  clearAdminSession(response);
}

export function hasUserSession(request: NextRequest): boolean {
  return getUserSession(request) !== null;
}

export function hasAdminSession(request: NextRequest): boolean {
  return getAdminSession(request) !== null;
}