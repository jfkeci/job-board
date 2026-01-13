module.exports = {
  extends: ['@borg/eslint-config-backend'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
