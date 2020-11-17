class K8sApiError extends Error {
  constructor(k8sErrorResponse, ...defaultArgs) {
    super(...defaultArgs);

    this.name = 'K8sApiError';
    this.errorResponse = k8sErrorResponse;

    this.getStatusCode.bind(this);
    this.getResponseBodyStatus.bind(this);
    this.getResponseBodyReason.bind(this);
    this.getResponseBodyMessage.bind(this);
    this.getErrorString.bind(this);
  }

  getStatusCode() {
    return this.errorResponse.response.statusCode;
  }

  getResponseBodyStatus() {
    return this.errorResponse.response.body.status;
  }

  getResponseBodyReason() {
    return this.errorResponse.response.body.reason;
  }

  getResponseBodyMessage() {
    return this.errorResponse.response.body.message;
  }

  getErrorString() {
    const messageParts = [
      'K8s Api request failed with:',
      `Status - ${this.getResponseBodyStatus()}`,
      `Code - ${this.getStatusCode()}`,
      `Reason - ${this.getResponseBodyReason()}`,
      `Message - ${this.getResponseBodyMessage()}`,
    ];
    return messageParts.join('\n  ');
  }
}

export default K8sApiError;
