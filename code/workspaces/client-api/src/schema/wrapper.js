// wrapper - raise more useful exception for authentication errors
export default async function wrapper(promise) {
  try {
    const result = await promise;
    return result;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      const message = (err.response.data && err.response.data.message) ? err.response.data.message : '';
      throw new Error(`Unauthorized: ${message}`);
    }
    throw err;
  }
}

