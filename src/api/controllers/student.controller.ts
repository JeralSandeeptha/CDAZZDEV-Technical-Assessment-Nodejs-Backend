import logger from "../config/logger/logger";
import { Request, Response } from "express";
import ErrorResponse from "../utils/responses/ErrorResponse";
import SuccessResponse from "../utils/responses/SuccessResponse";
import HttpStatus from "../types/enums/HttpStatus";
import db from '../config/db/db';
import { StudentUpdateRequest } from "api/types/interfaces/requestDTO/StudentUpdateRequest";

const getStudent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { studentId } = req.params;

        if(!studentId) {
            logger.error('Student Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get student query was failed',
                    'Student Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT id, email, address, mobile, lname, fname, role, created_at from student WHERE id = $1', [studentId]);

        if(dbResponse.rows.length === 0) {
            logger.error('Student not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get student query was failed',
                    'Student not found'
                )
            )
        }

        logger.info('Get student query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get student query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get student internal server error',
                error.message
            )
        )
    }
}

const deleteStudent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { studentId } = req.params;

        if(!studentId) {
            logger.error('Student Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Delete student query was failed',
                    'Student Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM student WHERE id = $1', [studentId]);

        if(!dbResponse.rows[0]) {
            logger.error('Student not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Delete student query was failed',
                    'Student not found'
                )
            )
        }
        
        await db.query('DELETE FROM student WHERE id = $1', [studentId]);
        
        logger.info('Delete student query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Delete student query was successful',
                'Student deleted successful',
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Delete student internal server error',
                error.message
            )
        )
    }
}

const getAllStudents = async (req: Request, res: Response): Promise<any> => {
    try {

        const dbResponse = await db.query('SELECT * FROM student');

        logger.info('Get students query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get students query was successful',
                dbResponse.rows
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get students internal server error',
                error.message
            )
        )
    }
}

const updateStudent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { studentId } = req.params;
        const { address, mobile, email, password, fname, lname } : StudentUpdateRequest = req.body;

        if(!studentId) {
            logger.error('Student Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Update student query was failed',
                    'Student Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM student WHERE id = $1', [studentId]);

        if(dbResponse.rows.length === 0) {
            logger.error('Student not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Update student query was failed',
                    'Student not found'
                )
            )
        }
        
        const dbResponseTwo = await db.query('UPDATE student SET address = $1, mobile = $2, fname = $3, lname = $4 WHERE id = $5', [address, mobile, fname, lname, studentId]);

        logger.info('Update student query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Update student query was successful',
                dbResponseTwo.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Update student internal server error',
                error.message
            )
        )
    }
}

export {
    getStudent,
    deleteStudent,
    getAllStudents,
    updateStudent
}