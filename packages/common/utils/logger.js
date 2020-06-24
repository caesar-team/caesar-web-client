import pino from 'pino';
import { APP_TYPE, LOG_LEVEL } from '../constants';

export const logger = pino({
  prettyPrint: true,
  level: LOG_LEVEL || 'info',
  name: APP_TYPE || 'default',
});
