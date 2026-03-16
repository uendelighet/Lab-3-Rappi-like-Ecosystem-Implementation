import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import { AuthUser } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const getAuthUser = (req: AuthenticatedRequest): AuthUser => {
  if (req.user) return req.user;
  throw Boom.unauthorized('User not authenticated');
};

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    throw Boom.unauthorized('Authorization header is missing');
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token) throw Boom.unauthorized('Token is missing');

  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8')
    );
    req.user = {
      id: payload.sub,
      email: payload.email,
      user_metadata: payload.user_metadata || {},
      app_metadata: payload.app_metadata || {},
    } as any;
    next();
  } catch (err) {
    throw Boom.unauthorized('Invalid token');
  }
};