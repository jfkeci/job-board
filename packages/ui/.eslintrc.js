module.exports = {
  extends: ['@borg/eslint-config-frontend'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
