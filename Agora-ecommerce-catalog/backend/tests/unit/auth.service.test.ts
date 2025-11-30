import { hashPassword, comparePassword, validatePasswordStrength } from '../../src/utils/password';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../src/utils/jwt';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      const result = await comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);
      
      const result = await comparePassword(wrongPassword, hash);
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should pass for valid password', () => {
      const result = validatePasswordStrength('ValidPass1!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for short password', () => {
      const result = validatePasswordStrength('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should fail for password without uppercase', () => {
      const result = validatePasswordStrength('lowercase1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should fail for password without number', () => {
      const result = validatePasswordStrength('NoNumber!ABC');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should fail for password without special character', () => {
      const result = validatePasswordStrength('NoSpecial123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });
});

describe('JWT Utils', () => {
  describe('Access Token', () => {
    it('should generate and verify access token', () => {
      const token = generateAccessToken(1, 'test@example.com', 'customer');
      expect(token).toBeDefined();

      const payload = verifyAccessToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(1);
      expect(payload?.email).toBe('test@example.com');
      expect(payload?.role).toBe('customer');
    });

    it('should return null for invalid token', () => {
      const payload = verifyAccessToken('invalid-token');
      expect(payload).toBeNull();
    });
  });

  describe('Refresh Token', () => {
    it('should generate and verify refresh token', () => {
      const { token, tokenId } = generateRefreshToken(1);
      expect(token).toBeDefined();
      expect(tokenId).toBeDefined();

      const payload = verifyRefreshToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(1);
      expect(payload?.tokenId).toBe(tokenId);
    });

    it('should return null for invalid refresh token', () => {
      const payload = verifyRefreshToken('invalid-token');
      expect(payload).toBeNull();
    });
  });
});

