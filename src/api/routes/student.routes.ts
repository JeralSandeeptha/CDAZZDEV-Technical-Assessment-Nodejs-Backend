import { deleteStudent, getAllStudents, getStudent, updateStudent } from '../controllers/student.controller';
import express from 'express';

const router = express.Router();

router.get('/:studentId', getStudent);
router.get('/', getAllStudents);
router.delete('/:studentId', deleteStudent);
router.put('/:studentId', updateStudent);

export default router;