import K8sApiError from './k8sApiError';

describe('K8sApiError', () => {
  const k8sErrorResponse = {
    response: {
      statusCode: 404,
      body: {
        status: 'Expected Status',
        reason: 'Expected Reason',
        message: 'Expected Message',
      },
    },
  };

  it('assigns the provided message to to the message variable', () => {
    const error = new K8sApiError(k8sErrorResponse, 'Expected error message');
    expect(error.message).toEqual('Expected error message');
  });

  it('constructs the correct error string from the provided error response', () => {
    const error = new K8sApiError(k8sErrorResponse);
    expect(error.getErrorString()).toMatchSnapshot();
  });
});
