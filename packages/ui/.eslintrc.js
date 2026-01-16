module.exports = {
  extends: ['@job-board/eslint-config-frontend'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
