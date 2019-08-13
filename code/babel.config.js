module.exports = (api) => {
  api.cache(false);

  return {
    presets: [
      [
        '@babel/preset-env',
        { modules: 'commonjs', target: { node: 'current' } },
      ],
    ],
    ignore: [
      '__mocks__',
      '**/*.spec.js',
    ],
    babelrcRoots: ['.', './workspaces/common'],
    env: {
      debug: {
        sourceMaps: 'inline',
        retainLines: true,
      },
    },
  };
};
