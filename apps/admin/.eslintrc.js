module.exports = {
  extends: ["@job-board/eslint-config-frontend", "next/core-web-vitals"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
