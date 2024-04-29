#! /usr/bin/env node

import { Command } from "commander";
import logger from "./utils/logger.js";
import readline from "node:readline";
import exec from "node:child_process";
import fs from "node:fs";

const program = new Command();

program
  .version("0.1.0", "-v, --version", "Output the current version")
  .parse(process.argv);

logger.info(
  "This is a simple CLI tool to create a TS SWC React app, using Vite cli, with some custom configurations."
);

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

input.question(`Project name (default: react-template): \n`, (name) => {
  input.close();
  projectCreation(name || "react-template");
});

const getPackageJSON = (name) =>
  JSON.stringify(
    {
      name: name,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
        format: "prettier --write .",
        "format-check": "prettier --check .",
        "eslint-check": "eslint --color .",
        "eslint-fix": "eslint --color --fix .",
        "ts-check": "tsc --noEmit --pretty",
        lint: "yarn format-check && yarn eslint-check && yarn ts-check",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      },
      devDependencies: {
        "@types/react": "^18.2.66",
        "@types/react-dom": "^18.2.22",
        "@typescript-eslint/eslint-plugin": "^7.0.1",
        "@typescript-eslint/parser": "^7.2.0",
        "@vitejs/plugin-react-swc": "^3.5.0",
        eslint: "8.57.0",
        "eslint-config-love": "^47.0.0",
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-import": "^2.25.2",
        "eslint-plugin-n": "^15.0.0",
        "eslint-plugin-promise": "^6.0.0",
        "eslint-plugin-react": "^7.34.1",
        "eslint-plugin-react-hooks": "^4.6.2",
        "eslint-plugin-react-refresh": "^0.4.6",
        prettier: "^3.2.5",
        typescript: "^5.2.2",
        vite: "^5.2.0",
        "vite-tsconfig-paths": "^4.3.2",
      },
    },
    null,
    2
  );

const projectCreation = (name) => {
  try {
    logger.info(`Running Vite CLI to create ${name} project...`);
    exec.execSync(`npm create vite@latest ${name} -- --template react-swc-ts`, {
      stdio: "inherit",
    });
    logger.info("Project created");

    const path = process.cwd() + "/" + name;

    logger.info("Copying new configuration files...");
    fs.copyFileSync("src/configs/lint/.eslintrc", path + "/.eslintrc");
    fs.copyFileSync("src/configs/lint/.eslintignore", path + "/.eslintignore");
    fs.copyFileSync(
      "src/configs/vite/vite.config.ts",
      path + "/vite.config.ts"
    );
    fs.copyFileSync("src/configs/ts/tsconfig.json", path + "/tsconfig.json");
    fs.copyFileSync("src/configs/.gitignore", path + "/.gitignore");
    fs.writeFileSync(path + "/package.json", getPackageJSON(name));

    logger.info("Removing old configuration files...\n");
    fs.rmSync(path + "/.eslintrc.cjs");
    fs.rmSync(path + "/package.json");

    logger.success("Project created successfully!");
  } catch (error) {
    logger.error("An error occurred while creating the project.");
    logger.error(error);
  }
};
