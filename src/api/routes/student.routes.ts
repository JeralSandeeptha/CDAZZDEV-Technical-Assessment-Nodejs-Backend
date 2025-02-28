import { getStudent } from '../controllers/student.controller';
import express from 'express';

const router = express.Router();

router.get('/:userId', getStudent);

export default router;