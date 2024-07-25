module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./client/tsconfig.json", "./server/tsconfig.json"],
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended", // If you are using React
  ],
};
