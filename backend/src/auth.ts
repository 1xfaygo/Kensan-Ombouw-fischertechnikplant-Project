import bcrypt from 'bcrypt';
import db from './db.js';
import type { User, UserWithoutPassword } from './types.js';

const SALT_ROUNDS = 10;

export function createUser(email: string, password: string, name: string, role: string = 'user'): number {
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  
  try {
    const stmt = db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(email, hashedPassword, name, role);
    return Number(result.lastInsertRowid);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export function verifyUser(email: string, password: string): UserWithoutPassword | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as User | undefined;
  
  console.log('Verifying user:', email, 'Found:', !!user);
  
  if (!user) {
    console.log('User not found in database');
    return null;
  }
  
  const isValid = bcrypt.compareSync(password, user.password);
  
  console.log('Password validation:', isValid);
  
  if (!isValid) {
    console.log('Invalid password for user:', email);
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserById(id: number): UserWithoutPassword | undefined {
  const stmt = db.prepare('SELECT id, email, name, role, profile_picture FROM users WHERE id = ?');
  return stmt.get(id) as UserWithoutPassword | undefined;
}

export function getAllUsers(): UserWithoutPassword[] {
  const stmt = db.prepare('SELECT id, email, name, role, created_at FROM users');
  return stmt.all() as UserWithoutPassword[];
}

export function deleteUserByEmail(email: string): boolean {
  const stmt = db.prepare('DELETE FROM users WHERE email = ?');
  const result = stmt.run(email);
  
  if (result.changes === 0) {
    throw new Error('User not found');
  }
  
  return true;
}

export function initDefaultUser(): void {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = stmt.get() as { count: number };
  
  if (result.count === 0) {
    console.log('Creating default admin user...');
    createUser('admin@kensan.nl', 'admin123', 'Administrator', 'admin');
    console.log('Default user created: admin@kensan.nl / admin123');
  }
}
