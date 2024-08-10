import winston from 'winston';
import colors from 'ansi-colors';

const { combine, timestamp, printf, colorize } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${colors.gray(timestamp)} ${level}: `;

    if (typeof message === 'object') {
        const { method, path, query, body } = message;
        msg += `${colors.cyan(method)} ${colors.yellow(path)}`;
        if (Object.keys(query).length) msg += ` ${colors.magenta('Query:')} ${JSON.stringify(query)}`;
        if (Object.keys(body).length) msg += ` ${colors.magenta('Body:')} ${JSON.stringify(body)}`;
    } else {
        msg += message;
    }

    if (Object.keys(metadata).length) {
        msg += ` ${colors.gray(JSON.stringify(metadata))}`;
    }

    return msg;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'roadmap-service' },
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            )
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

export default logger;