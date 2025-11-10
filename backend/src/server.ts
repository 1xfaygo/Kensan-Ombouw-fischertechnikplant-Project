import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { verifyUser, getUserById, initDefaultUser, createUser, deleteUserByEmail } from './auth.js';
import type { JWTPayload } from './types.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'kensan-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

initDefaultUser();

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  const user = verifyUser(email, password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role } as JWTPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password and name are required'
    });
  }
  
  try {
    const userId = createUser(email, password, name);
    const user = getUserById(userId);
    
    res.status(201).json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message === 'Email already exists' ? 'Email already exists' : 'Registration failed'
    });
  }
});

app.post('/api/auth/deluser', (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  try {
    deleteUserByEmail(email);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message === 'User not found' ? 'User not found' : 'Failed to delete user'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Kensan Auth Server running on http://localhost:${PORT}`);
  console.log(`Default login: admin@kensan.nl / admin123`);
});
