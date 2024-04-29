import chalk from "chalk";

const logger = {
  info: (message) => console.log(chalk.blue(message)),
  success: (message) => console.log(chalk.bgGreen(chalk.bold(message))),
  warn: (message) => console.log(chalk.yellow(message)),
  error: (message) => console.log(chalk.bgRed(chalk.bold(message))),
};

export default logger;
