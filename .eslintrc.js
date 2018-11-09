module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "parser": 'babel-eslint'
  },

  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};