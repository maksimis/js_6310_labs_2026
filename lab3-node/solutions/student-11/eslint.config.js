export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                // Глобальные переменные Node.js
                console: "readonly",
                process: "readonly",
                // Глобальные переменные Jest (для тестов)
                describe: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                jest: "readonly"
            }
        },
        rules: {
            "no-console": "off", // Разрешаем console.log
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "semi": ["error", "always"], // Требовать точку с запятой
            "quotes": ["error", "single"], // Требовать одинарные кавычки
            "indent": ["error", 2], // Отступ 2 пробела
            "eqeqeq": ["error", "always"], // Требовать строгое равенство ===
            "no-var": "error", // Запретить var, использовать let/const
            "prefer-const": "error" // Требовать const, если переменная не меняется
        }
    }
];