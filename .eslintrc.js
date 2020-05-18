module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jest": true,
        "jest/globals": true
    },
    "parser": '@typescript-eslint/parser',
    "plugins": [
      "jest",
      "@typescript-eslint",
      "promise",
      "chai-expect",
      "security",
    ],
    parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.json'],
    },
    "extends": [
        "airbnb-typescript/base",
        "eslint:recommended",
        "plugin:promise/recommended",
        "plugin:security/recommended",
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    "rules": {
        "indent": ["error", 4],
        "@typescript-eslint/indent": ["error", 4],
        "comma-dangle": [
            "error",
            "never"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "no-var": [
            "off"
        ],
        "one-var": [
            "off"
        ],
        "chai-expect/missing-assertion": 2,
        "chai-expect/terminating-properties": 1,
        'no-console': 'off',
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off' 
    }
}