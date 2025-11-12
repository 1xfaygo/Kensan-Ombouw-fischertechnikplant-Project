export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  profile_picture?: string;
  created_at: string;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
  name: string;
  role: string;
  profile_picture?: string;
  created_at?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  password?: string;
}
