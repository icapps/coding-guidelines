module.exports = {
    "parser": "babel-eslint",
    "extends": ["airbnb", "plugin:flowtype/recommended", "plugin:react/recommended"],
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
        "flowtype",
    ],
    "parserOptions": {
      "sourceType": "module",
    },
    "rules": {
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    }
};
