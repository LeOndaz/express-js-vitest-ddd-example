import { db } from '../db';
import { users } from '../features/auth/models/user';
import { eq } from 'drizzle-orm';
import { env } from '../common/env';
import { generateToken } from '../features/auth/auth.service';

export const getAdminUserWithToken = async () => {
  const [ user] = await db
    .select()
    .from(users) // TODO: where admin
    .where(eq(users.email, env.ADMIN_EMAIL))
    .execute();

  const token = await generateToken(user);

  return {
    user,
    token,
  };
};