module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "prettier"
  ],
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
  ],
  env: {
    browser: true,
  },
  "rules": {
    "strict": 0,
    "prettier/prettier": [
      "error",
      {
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
  },
};
