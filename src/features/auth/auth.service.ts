import { User, users } from '@auth/models/user';
import { db } from '@db/db';
import { eq } from 'drizzle-orm';
import { RegisterSchema } from '@auth/auth.validation';
import { hashPassword } from '@auth/auth.utils';

export const getUserById = async (id: string): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(users)
    .where(
      eq(users.id, id),
    )
    .execute();

  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(users)
    .where(
      eq(users.email, email),
    )
    .execute();

  return user;
};

export const createUser = async (data: RegisterSchema) => {
  const password = data.password ? await hashPassword(data.password) : null;

  const [user] = await db
    .insert(users)
    .values({
      ...data,
      password,
    })
    .returning()
    .execute();

  return user;
};