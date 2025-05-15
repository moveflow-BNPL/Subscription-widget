module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
  plugins: ["simple-import-sort", "unused-imports"],
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "react/display-name": "off",
    "unused-imports/no-unused-imports": "warn",
    "simple-import-sort/imports": "off",
    "simple-import-sort/exports": "off",
    "import/first": "off",
    "import/newline-after-import": "off",
    "import/no-duplicates": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: ["@mui/*/*/*"],
      },
    ],
  },
};
