import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger.js';
import tabRoutes from './routes/tabulador.js';
import authRoutes from './routes/authRouter.js';

const app = express();
const { PORT } = process.env;

app.use(cors({origin:process.env.CORS}));
app.use(express.json());

app.get('/v1', (req, res) => res.send('OK'));
app.use('/v1/result', tabRoutes);
app.use('/v1/auth', authRoutes);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_CONNECTION}`);
    logger.info(`API is listening on port ${PORT} successfully`);
  } catch (err) {
    logger.error('Error starting Backend', err);
  }
});
