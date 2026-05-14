class Logger {
  log(...args: unknown[]): void {
    console.log(...args);
  }

  write(message: string): void {
    process.stdout.write(message);
  }

  error(err: Error): void {
    console.error(err.message);
  }
}

export default new Logger();
