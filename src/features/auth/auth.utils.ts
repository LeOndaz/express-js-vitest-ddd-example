import { User } from '@auth/models/user';
import bcrypt from 'bcrypt';

export const checkUserPassword = async (user: User, rawPassword: string): Promise<boolean> => {
  if (!user.password)  {
    return false;
  }
  
  return bcrypt.compare(user.password, rawPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 20); // TODO rounds should be env
};