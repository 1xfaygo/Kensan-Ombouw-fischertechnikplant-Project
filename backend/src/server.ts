import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDefaultUser } from './auth.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../profile_pictures');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = express();
const PORT = 3000;


app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/profile_pictures', express.static(UPLOAD_DIR));
app.use('/api/auth', userRoutes);
app.use('/api/profile', profileRoutes);

app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});


initDefaultUser();


app.listen(PORT, () => {
  console.log(`Kensan Auth Server running on http://localhost:${PORT}`);
  console.log(`Default login: admin@kensan.nl / admin123`);
});