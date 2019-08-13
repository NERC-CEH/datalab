module.exports = (api) => {
  api.cache(false);

  return {
    presets: [
      [
        '@babel/preset-env',
        { modules: 'commonjs', targets: { node: 'current' } },
      ],
    ],
    // ignore: [
    //   '__mocks__',
    //   '**/*.spec.js',
    // ],
    babelrcRoots: ['.', './workspaces/*'],
    env: {
      debug: {
        sourceMaps: 'inline',
        retainLines: true,
      },
    },
  };
};
