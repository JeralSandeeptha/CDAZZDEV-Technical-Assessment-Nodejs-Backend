import { verifyAdmin, verifyToken } from '../middlewares/userAuthenticator';
import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from '../controllers/course.controller';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createCourse);
router.get('/', verifyToken, getAllCourses);
router.get('/:courseId', verifyToken, getCourse);
router.delete('/:courseId', verifyAdmin, deleteCourse);
router.put('/:courseId', verifyAdmin, updateCourse);

export default router;