import chalk from "chalk";

const logger = {
  info: (message: string) => console.log(chalk.blue(message)),
  success: (message: string) => console.log(chalk.bgGreen(chalk.bold(message))),
  warn: (message: string) => console.log(chalk.yellow(message)),
  error: (message: string) => console.log(chalk.bgRed(chalk.bold(message))),
};

export default logger;
