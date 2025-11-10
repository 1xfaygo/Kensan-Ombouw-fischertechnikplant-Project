import bcrypt from 'bcrypt';
import db from './db.js';

const SALT_ROUNDS = 10;

export function createUser(email, password, name, role = 'user') {
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  
  try {
    const stmt = db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(email, hashedPassword, name, role);
    return result.lastInsertRowid;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export function verifyUser(email, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  
  if (!user) {
    return null;
  }
  
  const isValid = bcrypt.compareSync(password, user.password);
  
  if (!isValid) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserById(id) {
  const stmt = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?');
  return stmt.get(id);
}

export function getAllUsers() {
  const stmt = db.prepare('SELECT id, email, name, role, created_at FROM users');
  return stmt.all();
}

export function initDefaultUser() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const { count } = stmt.get();
  
  if (count === 0) {
    console.log('Creating default admin user...');
    createUser('admin@kensan.nl', 'admin123', 'Administrator', 'admin');
    console.log('Default user created: admin@kensan.nl / admin123');
  }
}
