import { Request, Response, NextFunction } from 'express';
import logger from '../../logging/logger';

class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;

    logger.error({
        message: error.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
    });

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message
        });
    }

    // For unhandled errors
    return res.status(500).json({
        success: false,
        error: 'Server Error'
    });
};

export { AppError, errorHandler };