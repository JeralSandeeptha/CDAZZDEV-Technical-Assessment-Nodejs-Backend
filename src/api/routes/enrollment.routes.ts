import { verifyAdmin, verifyToken } from '../middlewares/userAuthenticator';
import { createEnrollment, deleteEnrollment, getEnrollment, getEnrollments, updateEnrollment } from '../controllers/enrollment.controller';
import express from 'express';

const router = express.Router();

router.post('/', verifyToken, createEnrollment);
router.get('/', verifyToken, getEnrollments);
router.get('/:enrollmentId/:courseId/:studentId', verifyToken, getEnrollment);
router.delete('/:enrollmentId', verifyAdmin, deleteEnrollment);
router.put('/:enrollmentId', verifyAdmin, updateEnrollment);

export default router;