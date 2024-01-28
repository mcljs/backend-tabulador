import winston from 'winston';

const { createLogger, transports, format } = winston;

const { combine, timestamp, json } = format;

const logger = createLogger({
  transports: new transports.File({
    filename: 'logs/api.log',
    format: combine(timestamp(), json()),
  }),
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
