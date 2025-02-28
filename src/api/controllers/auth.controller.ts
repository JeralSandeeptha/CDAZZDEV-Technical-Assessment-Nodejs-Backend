import dotenv from 'dotenv';
import logger from "../config/logger/logger";
import HttpStatus from "../types/enums/HttpStatus";
import { RegisterUser } from "../types/interfaces/requestDTO/RegisterUser";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import db from '../config/db/db';
import ErrorResponse from '../utils/responses/ErrorResponse';
import SuccessResponse from '../utils/responses/SuccessResponse';
import { AuthRequest } from '../types/interfaces/requestDTO/AuthRequest';

dotenv.config();

const registerAdmin = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: RegisterUser = req.body;
    try {

        if(!email || !password) {
            logger.error('Admin registration failed. Please provide related fields.');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Admin registration query was failed',
                    'Admin registration failed'
                )
            );
        }

        const existingUser = await db.query(
            'SELECT * FROM admin WHERE email = $1',
            [email]
        ); 

        if (existingUser.rowCount) {
            logger.error("Already have an admin for this email");
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Register admin query was falied",
                    "Admin already exists"
                )
            );
        }

        const newUser = await db.query(
            'INSERT INTO admin (email, password, role) VALUES ($1, $2, $3) RETURNING *',
            [email, password, 'admin']
        );
        logger.info("Register admin query was successful");

        res.status(HttpStatus.CREATED).json(
            new SuccessResponse(
                HttpStatus.CREATED,
                'Admin registered query was successful',
                newUser.rows[0]
            )
        );
    } catch (error) {
        logger.error('Admin register query internal server error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Admin register query internal server error',
                'Admin registration failed'
            )
        );
    }
};

const loginAdmin = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: AuthRequest = req.body;
    try {
        if(!email) {
            logger.error('Email didn\'t exist');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Admin login query was failed',
                    'Please enter your email'
                )
            );
        }
        if(!password) {
            logger.error('Password didn\'t exist');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Admin login query was failed',
                    'Please enter your password'
                )
            );
        }

        const user = db.query('SELECT * from admin WHERE email = $1', [email]);
        if ((await user).rows.length === 0) {
            logger.warn("Admin not found. Email is incorrect");
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    "Admin login query was failed",
                    "Admin not found. Email is incorrect."
                )
            );
        }

        if ((await user).rows[0].password != password) {
            logger.warn("Password is incorrect");
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Admin login query was failed",
                    "Password is incorrect"
                )
            );
        }
  
        const accessToken = jwt.sign(
            { id: (await user).rows[0].id, role: (await user).rows[0].role },
            process.env.JWT_SECRET
        );
        
        const refreshToken = jwt.sign(
            { id: (await user).rows[0].id, role: (await user).rows[0].role },
            process.env.JWT_REFRESH_SECRET as string,
        );

        const loggedUser = {
            id: (await user).rows[0].id,
            email: (await user).rows[0].email,
            role: (await user).rows[0].role,
            created_at: (await user).rows[0].created_at
        }
  
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.status(HttpStatus.ACCEPTED).json(
            new SuccessResponse(
                HttpStatus.ACCEPTED,
                'User login query was successfull',
                {
                    user: loggedUser,
                    accessToken: accessToken
                }
            )
        );
    } catch (error: any) {
        logger.error('User login query internal server error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'User login query internal server error',
                'User login failed'
            )
        );
    }
};

const registerUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password,address, mobile }: RegisterUser = req.body;
    try {

        if(!email || !password || !address || !mobile) {
            logger.error('Student registration failed. Please provide related fields.');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Student registration query was failed',
                    'Student registration failed'
                )
            );
        }

        const existingUser = await db.query(
            'SELECT * FROM student WHERE email = $1',
            [email]
        ); 

        if (existingUser.rowCount) {
            logger.error("Already have an student for this email");
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Register student query was falied",
                    "Student already exists"
                )
            );
        }

        const newUser = await db.query(
            'INSERT INTO student (email, password, address, mobile , role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, password, address, mobile, 'user']
        );
        logger.info("Register student query was successful");

        res.status(HttpStatus.CREATED).json(
            new SuccessResponse(
                HttpStatus.CREATED,
                'Student registered query was successful',
                newUser.rows[0]
            )
        );
    } catch (error) {
        logger.error('Student register query internal server error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Student register query internal server error',
                'Student registration failed'
            )
        );
    }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: AuthRequest = req.body;
    try {
        if(!email) {
            logger.error('Email didn\'t exist');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Studednt login query was failed',
                    'Please enter your email'
                )
            );
        }
        if(!password) {
            logger.error('Password didn\'t exist');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Student login query was failed',
                    'Please enter your password'
                )
            );
        }

        const user = db.query('SELECT * from student WHERE email = $1', [email]);
        if ((await user).rows.length === 0) {
            logger.warn("Student not found. Email is incorrect");
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    "Student login query was failed",
                    "Student not found. Email is incorrect."
                )
            );
        }

        if ((await user).rows[0].password != password) {
            logger.warn("Password is incorrect");
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Student login query was failed",
                    "Password is incorrect"
                )
            );
        }
  
        const accessToken = jwt.sign(
            { id: (await user).rows[0].id, role: (await user).rows[0].role },
            process.env.JWT_SECRET
        );
        
        const refreshToken = jwt.sign(
            { id: (await user).rows[0].id, role: (await user).rows[0].role },
            process.env.JWT_REFRESH_SECRET as string,
        );

        const loggedUser = {
            id: (await user).rows[0].id,
            email: (await user).rows[0].email,
            role: (await user).rows[0].role,
            created_at: (await user).rows[0].created_at
        }
  
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.status(HttpStatus.ACCEPTED).json(
            new SuccessResponse(
                HttpStatus.ACCEPTED,
                'Student login query was successfull',
                {
                    user: loggedUser,
                    accessToken: accessToken
                }
            )
        );
    } catch (error: any) {
        logger.error('Student login query internal server error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Student login query internal server error',
                'Student login failed'
            )
        );
    }
};

const refreshToken = (req: Request, res: Response): Promise<any> => {
    return new Promise((resolve, reject) => {
        const { refreshToken } = req.cookies;
        console.log(refreshToken);
        if (!refreshToken) {
            logger.error('No refresh token. Please login again')
            return resolve(res.status(401).json({ message: 'No refresh token' }));
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err: any, decoded: any) => {
            if (err) {
                return resolve(res.status(403).json({ message: 'Invalid refresh token' }));
            }

            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET as string, 
                { expiresIn: '15min' }
            );

            return resolve(res.json({ accessToken: newAccessToken }));
        });
    });
};

const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(HttpStatus.REDIRECT).json(
        new SuccessResponse(
            HttpStatus.REDIRECT,
            'User token made expired',
            'Successfully logout'
        )
    );
};
  
export {
    registerAdmin,
    loginAdmin,
    refreshToken,
    logout,
    loginUser,
    registerUser
}