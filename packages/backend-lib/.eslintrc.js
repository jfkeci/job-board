module.exports = {
  extends: ['@job-board/eslint-config-backend'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
