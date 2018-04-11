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
    "prettier/prettier": ["error", {
      trailingComma: 'es5',
      singleQuote: true,
    }],
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": [ "Link" ],
      "specialLink": [ "to", "hrefLeft", "hrefRight" ],
      "aspects": [ "noHref", "invalidHref", "preferButton" ],
    }],
    "no-param-reassign": [2, { "props": false }],
  },
};
