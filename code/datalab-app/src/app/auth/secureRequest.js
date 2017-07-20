import request from 'axios';
import auth from './auth';

request.interceptors.request.use((requestConfig) => {
  const currentSession = auth.getCurrentSession();
  return {
    ...requestConfig,
    headers: {
      ...requestConfig.headers,
      Authorization: `Bearer ${currentSession.accessToken}`,
    },
  };
});

request.interceptors.response.use(
  undefined, // No intercept for good responses
  (error) => {
    // This intercept will catch 401 responses for requests with expired bearer token to the API and attempt to renew
    // access token and reissue the request. Failed unauthorized posts will appear as an error in the console log.
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && originalRequest.method === 'post' && !originalRequest.isRetryRequest) {
      // Add tag to reissued request to prevent looping
      originalRequest.isRetryRequest = true;
      return auth.renewSession()
        .then(() => request(originalRequest));
    }
    return Promise.reject(error);
  });

export default request;
