import wrapper from './wrapper';

describe('wrapper', () => {
  it('returns unrejected promises', async () => {
    // Arrange
    const promise = Promise.resolve('okay');

    // Act
    const result = wrapper(promise);

    // Assert
    await expect(result).resolves.toEqual('okay');
  });

  it('wraps authorization rejections', async () => {
    // Arrange
    const promise = Promise.reject({
      response: {
        status: 401,
        data: {
          message: 'authorization-message',
        },
      },
    });

    // Act
    const result = wrapper(promise);

    // Assert
    await expect(result).rejects.toEqual(new Error('Unauthorized: authorization-message'));
  });

  it('returns other rejections', async () => {
    // Arrange
    const promise = Promise.reject('some-error');

    // Act
    const result = wrapper(promise);

    // Assert
    await expect(result).rejects.toEqual('some-error');
  });
});
