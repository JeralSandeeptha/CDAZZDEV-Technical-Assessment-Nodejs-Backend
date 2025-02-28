import logger from "../config/logger/logger";
import { Request, Response } from "express";
import ErrorResponse from "../utils/responses/ErrorResponse";
import SuccessResponse from "../utils/responses/SuccessResponse";
import HttpStatus from "../types/enums/HttpStatus";
import db from '../config/db/db';
import { CourseRequest } from "api/types/interfaces/requestDTO/CourseRequest";
import { CourseUpdateRequest } from "api/types/interfaces/requestDTO/CourseUpdateRequest";

const createCourse = async (req: Request, res: Response): Promise<any> => {
    try {

        const { image,description,end_date,instructor,start_date,title }: CourseRequest = req.body; 

        const dbResponse = await db.query('INSERT INTO course (image, title, description, instructor, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)', [image, title, description, instructor, start_date, end_date]);

        logger.info('Create course query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Create course query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Create course internal server error',
                error.message
            )
        )
    }
}

const getCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { courseId } = req.params;

        if(!courseId) {
            logger.error('Course Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get course query was failed',
                    'Course Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * from course WHERE id = $1', [courseId]);

        if(dbResponse.rows.length === 0) {
            logger.error('Course not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get course query was failed',
                    'Course not found'
                )
            )
        }

        logger.info('Get course query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get course query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get course internal server error',
                error.message
            )
        )
    }
}

const getAllCourses = async (req: Request, res: Response): Promise<any> => {
    try {

        const dbResponse = await db.query('SELECT * FROM course');

        logger.info('Get courses query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get courses query was successful',
                dbResponse.rows
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get courses internal server error',
                error.message
            )
        )
    }
}

const deleteCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { courseId } = req.params;

        if(!courseId) {
            logger.error('Course Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Delete course query was failed',
                    'Course Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM course WHERE id = $1', [courseId]);

        if(!dbResponse.rows[0]) {
            logger.error('Course not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Delete course query was failed',
                    'Course not found'
                )
            )
        }
        
        await db.query('DELETE FROM course WHERE id = $1', [courseId]);
        
        logger.info('Delete course query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Delete course query was successful',
                'Course deleted successful',
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Delete course internal server error',
                error.message
            )
        )
    }
}

const updateCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { courseId } = req.params;
        const { description, end_date, image, instructor, start_date, title } : CourseUpdateRequest = req.body;

        if(!courseId) {
            logger.error('Course Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Update course query was failed',
                    'Course Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM course WHERE id = $1', [courseId]);

        if(dbResponse.rows.length === 0) {
            logger.error('Course not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Update course query was failed',
                    'Course not found'
                )
            )
        }
        
        const dbResponseTwo = await db.query('UPDATE course SET image = $1, title = $2, description = $3, instructor = $4, start_date = $5, end_date = $6 WHERE id = $7', [image, title, description, instructor, start_date, end_date, courseId]);

        logger.info('Update course query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Update course query was successful',
                dbResponseTwo.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Update course internal server error',
                error.message
            )
        )
    }
}

export {
    getCourse,
    getAllCourses,
    deleteCourse,
    createCourse,
    updateCourse
}