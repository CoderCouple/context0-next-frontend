import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginBoundaries from "eslint-plugin-boundaries";
import checkFilePlugin from "eslint-plugin-check-file";
import nPlugin from "eslint-plugin-n";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["**/node_modules/**", "**/src/components/ui/**", "middleware.ts"],
    plugins: {
      "check-file": checkFilePlugin,
      n: nPlugin,
      boundaries: eslintPluginBoundaries,
    },
    rules: {
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "n/no-process-env": ["error"],
      "@typescript-eslint/no-empty-object-type": ["warn"],
      "@typescript-eslint/no-unused-vars": ["error"],
      "react/no-unescaped-entities": ["off"],
      // "check-file/filename-naming-convention": [
      //   "error",
      //   {
      //     "**/*.{ts,tsx,js,jsx}": "KEBAB_CASE",
      //     "src/components/ui/**/*": "!KEBAB_CASE",
      //   },
      //   {
      //     ignoreMiddleExtensions: true,
      //   },
      // ],
      // "check-file/folder-naming-convention": [
      //   "error",
      //   {
      //     "src/**/": "KEBAB_CASE",
      //     "src/components/ui/**": "!KEBAB_CASE",
      //     "src/app/**": "!KEBAB_CASE",
      //   },
      // ],
      //"boundaries/no-unknown": ["warn"],
      //"boundaries/no-unknown-files": ["warn"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "shared",
              allow: ["shared"],
              message:
                "Shared modules can only import from other shared modules",
            },
            {
              from: "feature",
              allow: [
                "shared",
                ["feature", { featureName: "${from.featureName}" }],
              ],
              message:
                "Features can only import from shared modules or their own feature",
            },
            {
              from: "app",
              allow: ["shared", "feature"],
              message: "App modules can import from shared and feature modules",
            },
            {
              from: "neverImport",
              allow: [],
              message: "Root level files should not be imported",
            },
          ],
        },
      ],
    },
    settings: {
      boundaries: {
        rootDir: `${__dirname}/src`,
        ignore: ["**/node_modules/**", "**/components/ui/**"],
        include: ["**/*"],
        elements: [
          {
            mode: "file",
            type: "shared",
            pattern: [
              "components/**/*",
              "providers/**/*",
              "lib/**/*",
              "utils/**/*",
              "db/**/*",
              "hooks/**/*",
              "api/**/*",
              "env/**/*",
              "config/**/*",
              "types/**/*",
              "middleware.ts",
            ],
          },
          {
            mode: "file",
            type: "feature",
            capture: ["featureName"],
            pattern: ["features/*/**/*"],
          },
          {
            mode: "file",
            type: "app",
            capture: ["_", "filename"],
            pattern: ["app/**/*"],
          },
        ],
      },
    },
  },
];

export default eslintConfig;
