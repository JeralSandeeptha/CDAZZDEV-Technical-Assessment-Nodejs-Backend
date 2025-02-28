import logger from "../config/logger/logger";
import { Request, Response } from "express";
import ErrorResponse from "../utils/responses/ErrorResponse";
import SuccessResponse from "../utils/responses/SuccessResponse";
import HttpStatus from "../types/enums/HttpStatus";
import db from '../config/db/db';
import { EnrollmentRequest } from "../types/interfaces/requestDTO/EnrollmentRequest";
import { EnrollmentUpdateRequest } from "api/types/interfaces/requestDTO/EnrollmentUpdateRequest";

const createEnrollment = async (req: Request, res: Response): Promise<any> => {
    try {

        const { course_id, enrollment_date, status, student_id }: EnrollmentRequest = req.body; 

        const studentCheckRequest = await db.query('SELECT * from student WHERE id = $1', [student_id]);
        if(studentCheckRequest.rows.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Create enrollment query was failed',
                    'Can\'t find a student related to this student ID',
                )
            ) 
        }

        const courseCheckRequest = await db.query('SELECT * FROM course WHERE id = $1', [course_id]);
        if(courseCheckRequest.rows.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Create enrollment query was failed',
                    'Can\'t find a course related to this course ID',
                )
            ) 
        }

        const dbQueryCheck = await db.query('SELECT * FROM enrollment WHERE student_id = $1 AND course_id = $2', [student_id, course_id]);

        if(dbQueryCheck.rows.length !== 0) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Create enrollment query was failed',
                    'Student already enroll to this course',
                )
            ) 
        }

        const dbResponse = await db.query('INSERT INTO enrollment (student_id, course_id, enrollment_date, status) VALUES ($1, $2, $3, $4)', [student_id, course_id, enrollment_date, status]);

        logger.info('Create enrollment query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Create enrollment query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Create enrollment internal server error',
                error.message
            )
        )
    }
}

const getEnrollment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { enrollmentId, courseId, studentId } = req.params;

        if(!enrollmentId) {
            logger.error('Enrollment Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get enrollments query was failed',
                    'Enrollment Id not found'
                )
            )
        }

        const dbQueryCheck = await db.query(
            `SELECT 
                e.id,
                e.enrollment_date,
                e.status,
                s.id,
                s.fname,
                s.lname,
                s.email,
                s.mobile,
                c.id,
                c.title,
                c.description,
                c.instructor,
                c.start_date,
                c.end_date
            FROM enrollment e
            JOIN student s ON e.student_id = s.id
            JOIN course c ON e.course_id = c.id
            WHERE e.student_id = $1 AND e.course_id = $2`,
            [studentId, courseId]
        );

        if(dbQueryCheck.rows.length === 0) {
            logger.error('Enrollment not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get enrollment query was failed',
                    'Enrollment not found'
                )
            )
        }

        logger.info('Get enrollment query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get enrollment query was successful',
                dbQueryCheck.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get enrollment internal server error',
                error.message
            )
        )
    }
}

const getEnrollments = async (req: Request, res: Response): Promise<any> => {
    try {

        const dbQueryCheck = await db.query(
            `SELECT 
                e.id,
                e.enrollment_date,
                e.status,
                s.id,
                s.fname,
                s.lname,
                s.email,
                s.mobile,
                c.id,
                c.title,
                c.description,
                c.instructor,
                c.start_date,
                c.end_date
            FROM enrollment e
            JOIN student s ON e.student_id = s.id
            JOIN course c ON e.course_id = c.id`,
        );

        logger.info('Get enrollments query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get enrollments query was successful',
                dbQueryCheck.rows
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get enrollments internal server error',
                error.message
            )
        )
    }
}

const deleteEnrollment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { enrollmentId } = req.params;

        if(!enrollmentId) {
            logger.error('Enrollment Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Delete enrollment query was failed',
                    'Enrollment Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM enrollment WHERE id = $1', [enrollmentId]);

        if(!dbResponse.rows[0]) {
            logger.error('Course not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Delete enrollment query was failed',
                    'Enrollment not found'
                )
            )
        }
        
        await db.query('DELETE FROM enrollment WHERE id = $1', [enrollmentId]);
        
        logger.info('Delete course query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Delete enrollment query was successful',
                'Enrollment deleted successful',
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Delete enrollment internal server error',
                error.message
            )
        )
    }
}

const updateEnrollment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { enrollmentId } = req.params;
        const { course_id, enrollment_date, status, student_id } : EnrollmentUpdateRequest = req.body;

        if(!enrollmentId) {
            logger.error('Enrollment Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Update enrollment query was failed',
                    'Enrollment Id not found'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM enrollment WHERE id = $1', [enrollmentId]);

        if(dbResponse.rows.length === 0) {
            logger.error('Enrollment not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Update enrollment query was failed',
                    'Enrollment not found'
                )
            )
        }
        
        const dbResponseTwo = await db.query('UPDATE enrollment SET status = $1 WHERE id = $2', [status, enrollmentId]);

        logger.info('Update enrollment query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Update enrollment query was successful',
                dbResponseTwo.rows[0]
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Update enrollment internal server error',
                error.message
            )
        )
    }
}

const getEnrollmentsBtStudentId = async (req: Request, res: Response): Promise<any> => {
    try {
        const { studentId } = req.params;

        if(!studentId) {
            logger.error('Student Id not found');
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get enrollments by student Id query was failed',
                    'Student Id not found'
                )
            )
        }

        const dbQueryCheck = await db.query(
            `SELECT 
                e.id,
                e.enrollment_date,
                e.status,
                s.id,
                s.fname,
                s.lname,
                s.email,
                s.mobile,
                c.id,
                c.title,
                c.description,
                c.instructor,
                c.start_date,
                c.end_date
            FROM enrollment e
            JOIN student s ON e.student_id = s.id
            JOIN course c ON e.course_id = c.id
            WHERE e.student_id = $1`,
            [studentId]
        );

        logger.info('Get enrollments by studentId query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get enrollments by student Id query was successful',
                dbQueryCheck.rows
            )
        )
    } catch (error) {
        logger.error(error.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get enrollments by student Id internal server error',
                error.message
            )
        )
    }
}

export {
    getEnrollment,
    getEnrollments,
    deleteEnrollment,
    updateEnrollment,
    createEnrollment,
    getEnrollmentsBtStudentId
};