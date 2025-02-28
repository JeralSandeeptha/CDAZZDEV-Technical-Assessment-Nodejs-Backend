import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import logger from './config/logger/logger';
import './config/db/db';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';

dotenv.config();

const app = express();

app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"], 
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true
    })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/student', studentRoutes);

const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
});
