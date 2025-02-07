/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "@withbee/eslint-config/next.js",
    "plugin:storybook/recommended",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
