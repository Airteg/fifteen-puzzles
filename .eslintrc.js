module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Додаємо підтримку для Node.js (для змінної 'module')
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all", // Плагін для React Native, який забезпечує всі правила
    "plugin:prettier/recommended", // Prettier для забезпечення стилю коду
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Підтримка JSX для React
    },
  },
  plugins: [
    "react", // Плагін для React
    "react-native", // Плагін для React Native
    "prettier", // Плагін для Prettier
    "@emotion", // Плагін для @emotion
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all", // Додаємо коми всюди (ES6+)
        singleQuote: false, // Використовуємо одинарні лапки
        semi: true, // Включаємо крапку з комою в кінці виразу
        endOfLine: "auto", // Автоматична підтримка кінця рядків
      },
    ],
    "react-native/no-color-literals": "off", // Вимикає перевірку кольорів-літералів
    "react-native/sort-styles": "off", // Вимкнути сортування стилів
    "@emotion/jsx-import": "error", // Специфічні правила для @emotion
    "@emotion/pkg-renaming": "error",
    "react/react-in-jsx-scope": "off", // Вимикаємо для нового JSX runtime
    "react-native/no-inline-styles": "off", // Попередження для інлайн-стилів
    "react/prop-types": "off", // Вимикаємо вимогу використовувати PropTypes
  },
  settings: {
    react: {
      version: "detect", // Автоматичне визначення версії React
    },
  },
};
