/** @type {import('eslint').Linter.Config} */

module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["node_modules/", "dist/"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
  },
  overrides: [
    {
      files: ["./src/testing/*.ts"],
      rules: {
        "no-empty-pattern": 0,
      }
    }
  ],
  rules: {
    camelcase: "error",
    eqeqeq: "error",
    indent: ["error", 2],
    "spaced-comment": "error",
    "default-case": "error",
    "no-alert": "error",
    "no-empty": "error",
    "no-regex-spaces": "error",
    "prefer-const": "error",
    "use-isnan": "error",

    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unsafe-enum-comparison": "error",
    "@typescript-eslint/no-useless-template-literals": "error",
    "@typescript-eslint/non-nullable-type-assertion-style": "error",

    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": ["error", "always-multiline"],

    "@typescript-eslint/prefer-destructuring": "error",

    "@typescript-eslint/prefer-for-of": "error",

    "no-return-await": "off",
    "@typescript-eslint/return-await": "error",

    "@typescript-eslint/prefer-as-const": "error",

    "class-methods-use-this": "off",
    "@typescript-eslint/class-methods-use-this": "error",

    "max-params": "off",
    "@typescript-eslint/max-params": ["error", {max: 4}],
    
    "object-curly-spacing": "off",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],

    semi: "off",
    "@typescript-eslint/semi": ["error", "always"],

    quotes: "off",
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        allowTemplateLiterals: true,
      },
    ],

    "@typescript-eslint/await-thenable": "error",

    "@typescript-eslint/no-this-alias": "error",

    "no-throw-literal": "off",
    "@typescript-eslint/no-throw-literal": "error",
  },
  globals: {
    Node: true,
  },
};
