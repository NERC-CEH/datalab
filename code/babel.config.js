module.exports = (api) => {
  api.cache(false);

  return {
    presets: [
      [
        '@babel/preset-env',
        { modules: 'commonjs', targets: { node: 'current' } },
      ],
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
