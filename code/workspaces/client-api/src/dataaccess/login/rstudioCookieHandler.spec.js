import rstudioCookieHandler from './rstudioCookieHandler';

describe('RStudio Cookie Handler', () => {
  it('should correctly parse tokens', () => {
    const cookies = [
      'user-id=rstudio|Thu%2C%2002%20Nov%202017%2008%3A26%3A46%20GMT|cybwuAyQf1YcC9qnf4XqUX1sMMXTZRmP5tfZRjBTW6E%3D; path=/; HttpOnly',
      'csrf-token=a9a40335-dc8d-43ee-bc65-7f2e93e44a4a; path=/',
    ];

    const expected = {
      expires: 'Thu%2C%2002%20Nov%202017%2008%3A26%3A46%20GMT',
      token: 'cybwuAyQf1YcC9qnf4XqUX1sMMXTZRmP5tfZRjBTW6E%3D',
      csrfToken: 'a9a40335-dc8d-43ee-bc65-7f2e93e44a4a',
    };

    expect(rstudioCookieHandler(cookies)).toEqual(expected);
  });
});
