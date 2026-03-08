type LogLevel = 'INFO' | 'WARN' | 'ERROR';

function log(level: LogLevel, message: string): void {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}`;

  if (level === 'ERROR') {
    console.error(formattedMessage);
    return;
  }

  if (level === 'WARN') {
    console.warn(formattedMessage);
    return;
  }

  console.log(formattedMessage);
}

export const logger = {
  info(message: string): void {
    log('INFO', message);
  },
  warn(message: string): void {
    log('WARN', message);
  },
  error(message: string): void {
    log('ERROR', message);
  },
};
