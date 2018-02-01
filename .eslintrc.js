module.exports = {
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
    "prettier/prettier": "error"
  },
};
