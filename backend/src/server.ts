import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyUser, getUserById, initDefaultUser, createUser, deleteUserByEmail } from './auth.js';
import { updateUserProfile, updateProfilePicture, deleteProfilePicture } from './profile.js';
import type { JWTPayload } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'kensan-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

// Create profile_pictures directory
const UPLOAD_DIR = path.join(__dirname, '../profile_pictures');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/profile_pictures', express.static(UPLOAD_DIR));

// Middleware to verify JWT
const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

initDefaultUser();

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, timestamp: new Date().toISOString() });
  
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Login failed: Invalid email format');
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }
  
  const user = verifyUser(email, password);
  
  if (!user) {
    console.log('Login failed: Invalid credentials for email:', email);
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
  
  console.log('Login successful:', { email, userId: user.id });
  
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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
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

// Profile endpoints
app.put('/api/profile/update', verifyToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, email, currentPassword, newPassword } = req.body;

    const updatedUser = updateUserProfile(userId, {
      name,
      email,
      currentPassword,
      newPassword
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

app.post('/api/profile/upload-picture', verifyToken, upload.single('profilePicture'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = (req as any).user.userId;
    const filename = `${userId}-${Date.now()}.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Resize and convert to JPEG
    await sharp(req.file.buffer)
      .resize(512, 512, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Update database
    updateProfilePicture(userId, filename);

    const user = getUserById(userId);

    res.json({
      success: true,
      user,
      profilePictureUrl: `/profile_pictures/${filename}`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload picture'
    });
  }
});

app.delete('/api/profile/delete-picture', verifyToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    deleteProfilePicture(userId);

    const user = getUserById(userId);

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete picture'
    });
  }
});
