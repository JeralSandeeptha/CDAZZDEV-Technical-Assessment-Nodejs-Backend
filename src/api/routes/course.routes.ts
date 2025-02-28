import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from '../controllers/course.controller';
import express from 'express';

const router = express.Router();

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:courseId', getCourse);
router.delete('/:courseId', deleteCourse);
router.put('/:courseId', updateCourse);

export default router;