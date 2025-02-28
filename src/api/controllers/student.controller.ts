import logger from "../config/logger/logger";
import { Request, Response } from "express";
import ErrorResponse from "../utils/responses/ErrorResponse";
import SuccessResponse from "../utils/responses/SuccessResponse";
import HttpStatus from "../types/enums/HttpStatus";
import db from '../config/db/db';

const getStudent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if(!userId) {
            logger.error('User Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get user query was failed',
                    'User Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT id, email, created_at from users WHERE id = $1', [userId]);

        logger.info('Get user query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get user query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get user query was failed',
                error.message
            )
        )
    }
}

export {
    getStudent
}