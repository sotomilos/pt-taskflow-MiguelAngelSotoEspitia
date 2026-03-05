import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  // Base Next configs
  ...nextVitals,
  ...nextTs,

  // Ignore build artifacts + deps
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),

  // Prettier integration: disable conflicting rules + run prettier as eslint rule
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...prettier.rules,
      "prettier/prettier": "error",

      // Custom rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);

export default eslintConfig;
