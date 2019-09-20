const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default generateOptions;
