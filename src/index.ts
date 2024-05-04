#! /usr/bin/env node
import readline from "node:readline";
import { Command } from "commander";
import logger from "./utils/logger.js";
import projectCreation from "./project-creation.js";

const main = () => {
  const program = new Command();
  program
    .version("0.1.2", "-v, --version", "Output the current version")
    .parse(process.argv);

  logger.info(
    "This is a simple CLI tool to create a TS SWC React app, using create-vite v5 CLI, with ESLint and Prettier custom configurations."
  );

  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  input.question("Project name (default: vite-react-app): \n", (name) => {
    input.close();
    projectCreation(name);
  });
};

main();
