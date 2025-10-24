import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
    const erro: AppError = new Error(message);
    erro.statusCode = statusCode;
    erro.isOperational = true;
    return erro;
}

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
    const {statusCode = 500, message} = error;

    console.error(`Error ${statusCode}: ${message}`);
    console.error(error.stack);

    res.status(statusCode).json({
        error: {
            message: statusCode === 500 ? "Erro interno do servidor" : message,
            statusCode,
            ...(process.env.NODE_ENV === "development" && { stack: error.stack })
        }
    });
}

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: `Route ${req.originalUrl} not found`,
        statusCode: 404,
      },
    });
  };