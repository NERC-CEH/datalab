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

  it('throws graphQL errors messages correctly', () => {
    const response = {
      errors: [{ message: 'something broke' }],
      data: { stacks: null },
    };

    expect(() => errorHandler('data.stacks')(response))
      .toThrowError('something broke');
  });

  it('throws response errors correctly', () => {
    const response = {
      errors: ['something broke'],
    };

    expect(() => errorHandler('data.stacks')(response))
      .toThrowError('something broke');
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
