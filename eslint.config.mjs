import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules",
      "dist",
      "coverage",
      "docs",
      "scripts",
      "tests",
      "eslint.config.mjs",
      "prettier.config.mjs",
      "tailwind.config.js",
      "postcss.config.js",
      "vite.config.ts",
      "vite.config.js",
      "vite.config.mjs",
    ],
  },
];

export default eslintConfig;
