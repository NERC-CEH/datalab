function requestConfig(token) {
  return {
    headers: { authorization: token },
  };
}

export default requestConfig;
