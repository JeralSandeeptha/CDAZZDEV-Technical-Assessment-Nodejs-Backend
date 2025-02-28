import { createEnrollment, deleteEnrollment, getEnrollment, getEnrollments, updateEnrollment } from '../controllers/enrollment.controller';
import express from 'express';

const router = express.Router();

router.post('/', createEnrollment);
router.get('/', getEnrollments);
router.get('/:enrollmentId/:courseId/:studentId', getEnrollment);
router.delete('/:enrollmentId', deleteEnrollment);
router.put('/:enrollmentId', updateEnrollment);

export default router;