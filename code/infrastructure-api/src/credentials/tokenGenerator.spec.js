import tokenGenerator from './tokenGenerator';

describe('token generator', () => {
  it('should generate a random string', () => {
    const generatedString = tokenGenerator.generateRandomString();
    console.log(generatedString);
    expect(generatedString.length).toBe(20);
    expect(typeof generatedString).toEqual('string');
  });

  it('should generate a uuid', () => {
    expect(tokenGenerator.generateUUID().length).toBe(36);
  });
});
