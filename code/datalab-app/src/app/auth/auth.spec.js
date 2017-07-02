import { isAuthenticated } from './auth';

describe('auth', () => {
  it('isAuthenticated returns false for past date-time', () => {
    // Arrange
    const expiresAt = '1496271600000';
    // Act/Assert
    expect(isAuthenticated(expiresAt)).toBe(false);
  });

  it('isAuthenticated returns true for future date-time', () => {
    // Arrange
    const expiresAt = JSON.stringify(Date.now() + 30000);
    // Act/Assert
    expect(isAuthenticated(expiresAt)).toBe(true);
  });

  it('isAuthenticated throws error for incorrectly formatted expiresAt', () => {
    // Arrange
    const expiresAt = 'not date';
    // Act/Assert
    expect(() => isAuthenticated(expiresAt))
      .toThrow('Auth token expiresAt value is invalid.');
  });
});
