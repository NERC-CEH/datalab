import zeppelinShiroGenerator from './zeppelinShiroGenerator';

describe('sha', () => {
  it('should correctly hash the string password', () => {
    const shiroCredentials = zeppelinShiroGenerator.generateNewShiroCredentials('password', 'testsalt');
    expect(shiroCredentials).toEqual({
      password: 'password',
      salt: 'testsalt',
      shiroCredentials: '$shiro1$SHA-256$500000$dGVzdHNhbHQ=$+XYtDUVDrc1wVQtuZxXo3A5NJm0PoA9smZBXu7YhqQQ=',
    });
  });

  it('should correctly create new random credentials', () => {
    const shiroCredentials = zeppelinShiroGenerator.generateNewShiroCredentials();
    expect(shiroCredentials.password.length).toBe(128);
    expect(shiroCredentials.salt.length).toBe(128);
    expect(shiroCredentials.shiroCredentials.indexOf('$shiro1$SHA-256$500000$')).toBe(0);
  });
});
