import winston from 'winston';
import { APP_TYPE, APP_VERSION, IS_PROD, LOG_LEVEL } from '../constants';

const { format } = winston;
const { combine, timestamp, label, colorize, align, printf } = format;
const formatObject = param => {
  if (typeof param === 'object') {
    return JSON.stringify(param);
  }

  return param;
};

const all = format(info => {
  return { ...info, message: formatObject(info.message) };
});

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(
    all(),
    format.splat(),
    label({ label: IS_PROD ? 'PROD' : 'DEV' }),
    timestamp(),
    colorize(),
    align(),
    printf(
      info =>
        `${info.timestamp} [${info.label}] ${info.level}: ${formatObject(
          info.message,
        )}`,
    ),
  ),
  transports: [new winston.transports.Console()],
});

export const logRequest = (req, res, next) => {
  logger.info(req.url);
  next();
};

export const logError = (err, req, res, next) => {
  logger.error(err);
  next();
};
