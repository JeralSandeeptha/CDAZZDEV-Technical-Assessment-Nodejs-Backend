import { verifyAdmin, verifyToken } from '../middlewares/userAuthenticator';
import { createEnrollment, deleteEnrollment, getEnrollment, getEnrollments, getEnrollmentsBtStudentId, updateEnrollment } from '../controllers/enrollment.controller';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createEnrollment);
router.get('/', verifyToken, getEnrollments);
router.get('/get-enrollments-by-studentId/:studentId', verifyToken, getEnrollmentsBtStudentId);
router.get('/:enrollmentId/:courseId/:studentId', verifyToken, getEnrollment);
router.delete('/:enrollmentId', verifyAdmin, deleteEnrollment);
router.put('/:enrollmentId', verifyAdmin, updateEnrollment);

export default router;