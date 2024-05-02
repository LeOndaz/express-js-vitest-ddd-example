import { User } from './models/user';
import bcrypt from 'bcrypt';

export const checkUserPassword = async (user: User, rawPassword: string): Promise<boolean> => {
  if (!user.password)  {
    return false;
  }
  
  return bcrypt.compare(rawPassword, user.password);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10); // TODO rounds should be env
};