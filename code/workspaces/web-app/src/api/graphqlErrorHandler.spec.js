import errorHandler from './graphqlErrorHandler';

describe('GraphQL Error Handler', () => {
  it('parses graphQL responses correctly', () => {
    const response = {
      errors: undefined,
      data: { stacks: 'expectedValue' },
    };

    expect(errorHandler('data.stacks')(response))
      .toBe('expectedValue');
  });

  it('rejects promise with graphQL errors messages correctly', async () => {
    const response = {
      errors: [{ message: 'something broke' }],
      data: { stacks: null },
    };

    await expect(errorHandler('data.stacks')(response))
      .rejects.toEqual('something broke');
  });

  it('rejects promise with throws response errors correctly', async () => {
    const response = {
      errors: ['something broke'],
    };

    await expect(errorHandler('data.stacks')(response))
      .rejects.toEqual('something broke');
  });

  it('filters ignored errors correctly', () => {
    const response = {
      errors: [{ path: ['users'] }],
      data: { stacks: 'expectedValue' },
    };

    expect(errorHandler('data.stacks', 'users')(response))
      .toBe('expectedValue');
  });
});
