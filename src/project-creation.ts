#! /usr/bin/env node
import exec from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import logger from "./utils/logger.js";

const viteProjectCreation = (name: string) => {
  logger.info(`Running create-vite CLI to create ${name} project...`);
  exec.execSync(`npm create vite@^5.2.0 ${name} -- --template react-swc-ts`, {
    stdio: "inherit",
  });
  logger.info("Project created");
};

const getPackageJSON = (name: string) =>
  JSON.stringify(
    {
      name,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        "format": "prettier --write .",
        "format-check": "prettier --check .",
        "eslint-check": "eslint --color .",
        "eslint-fix": "eslint --color --fix .",
        "ts-check": "tsc --noEmit --pretty",
        "lint": "yarn format-check && yarn eslint-check && yarn ts-check",
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
      },
      devDependencies: {
        "@types/react": "^18.2.66",
        "@types/react-dom": "^18.2.22",
        "@typescript-eslint/eslint-plugin": "^7.0.1",
        "@typescript-eslint/parser": "^7.2.0",
        "@vitejs/plugin-react-swc": "^3.5.0",
        "eslint": "8.57.0",
        "eslint-config-love": "^47.0.0",
        "eslint-config-prettier": "^9.1.0",
        "eslint-plugin-import": "^2.25.2",
        "eslint-plugin-n": "^15.0.0",
        "eslint-plugin-promise": "^6.0.0",
        "eslint-plugin-react": "^7.34.1",
        "eslint-plugin-react-hooks": "^4.6.2",
        "eslint-plugin-react-refresh": "^0.4.6",
        "prettier": "^3.2.5",
        "typescript": "^5.2.2",
        "vite": "^5.2.0",
        "vite-tsconfig-paths": "^4.3.2",
      },
    },
    null,
    2
  );

const copyCustomConfigs = (projectName: string, projectPath: string) => {
  const dirName = dirname(fileURLToPath(import.meta.url));
  const configsPath = path.resolve(dirName, "..", "src", "configs");
  logger.info("Copying new configuration files...");
  fs.copyFileSync(
    path.resolve(configsPath, "lint", ".eslintrc"),
    path.resolve(projectPath, ".eslintrc")
  );
  fs.copyFileSync(
    path.resolve(configsPath, "lint", ".eslintignore"),
    path.resolve(projectPath, ".eslintignore")
  );
  fs.copyFileSync(
    path.resolve(configsPath, "vite", "vite.config.ts"),
    path.resolve(projectPath, "vite.config.ts")
  );
  fs.copyFileSync(
    path.resolve(configsPath, "ts", "tsconfig.json"),
    path.resolve(projectPath, "tsconfig.json")
  );
  fs.copyFileSync(
    path.resolve(configsPath, ".gitignore"),
    path.resolve(projectPath, ".gitignore")
  );
  fs.writeFileSync(
    path.resolve(projectPath, "package.json"),
    getPackageJSON(projectName)
  );
  logger.info("Removing old configuration files...\n");
  fs.rmSync(path.resolve(projectPath, ".eslintrc.cjs"));
};

const projectCreation = (name = "vite-react-app") => {
  const workDir = process.cwd();
  const projectPath = path.resolve(workDir, name);
  try {
    viteProjectCreation(name);
    copyCustomConfigs(name, projectPath);
    logger.success("Project created successfully!");
  } catch (error) {
    logger.error(`ERROR: ${error as string}`);
  }
};

export default projectCreation;
