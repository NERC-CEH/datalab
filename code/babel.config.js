module.exports = (api) => {
  api.cache(false);

  return {
    presets: [
      ['@babel/preset-env'],
    ],
    babelrcRoots: ['.', './workspaces/*'],
    env: {
      debug: {
        sourceMaps: 'inline',
        retainLines: true,
      },
    },
  };
};
