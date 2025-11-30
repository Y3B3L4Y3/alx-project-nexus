import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendUnauthorized, sendForbidden } from '../utils/response';
import { AuthRequest, UserRole } from '../types';

// Authenticate user via JWT
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorized(res, 'No token provided');
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    sendUnauthorized(res, 'Invalid or expired token');
    return;
  }

  req.user = payload;
  next();
};

// Authorize specific roles
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendForbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};

// Authorize super admin only
export const superAdminOnly = authorize('super_admin');

// Authorize admin only (includes super_admin)
export const adminOnly = authorize('super_admin', 'admin');

// Authorize admin or moderator (includes super_admin)
export const adminOrModerator = authorize('super_admin', 'admin', 'moderator');

// Authorize users who can edit (includes super_admin, admin, moderator, editor)
export const canEdit = authorize('super_admin', 'admin', 'moderator', 'editor');

// Authorize any admin panel user (all roles except customer)
export const adminPanelAccess = authorize('super_admin', 'admin', 'moderator', 'editor', 'viewer');

// Optional authentication (user may or may not be logged in)
export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    
    if (payload) {
      req.user = payload;
    }
  }

  next();
};

