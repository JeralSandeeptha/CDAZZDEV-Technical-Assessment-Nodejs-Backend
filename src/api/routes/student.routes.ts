import { verifyAdmin, verifyToken } from '../middlewares/userAuthenticator';
import { deleteStudent, getAllStudents, getStudent, updateStudent } from '../controllers/student.controller';
import express from 'express';

const router = express.Router();

router.get('/:studentId', verifyToken, getStudent);
router.get('/', verifyToken, getAllStudents);
router.delete('/:studentId', verifyAdmin, deleteStudent);
router.put('/:studentId', verifyAdmin, updateStudent);

export default router;