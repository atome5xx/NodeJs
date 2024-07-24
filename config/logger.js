import { createLogger, format, transports } from 'winston';

// Définir un format personnalisé qui inclut le timestamp
const customFormat = format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Format de la date et heure
        customFormat
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'access.log', level: 'info' }),
    ],
});

// Log to the console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

export default logger;