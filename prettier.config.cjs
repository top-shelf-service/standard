module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  proseWrap: "preserve",
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 100,
        proseWrap: "preserve",
      },
    },
  ],
};
