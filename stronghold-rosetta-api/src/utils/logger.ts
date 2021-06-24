
import { transports, createLogger, format } from 'winston'

/**
 * Logger system using winston
 * Allows to write errors to error.log and other log to combined.log
 */
export const Logger = createLogger({
  level: 'debug',
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
})
