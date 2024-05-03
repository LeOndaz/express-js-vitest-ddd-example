import { User, users } from './models/user';
import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { RegisterDto } from './auth.validation';
import { checkUserPassword, hashPassword } from './auth.utils';
import { tokens } from './models/token';
import * as fns from 'date-fns';
import { env } from '../../common/env';
import { logger } from '../../common/utils/logger';


export const getUserByEmail = async (email: string): Promise<User> => {
  const queryResult = await db
    .select({
      id: users.id,
      name: users.name,
      password: users.password,
      email: users.email,
    })
    .from(users)
    .where(
      eq(users.email, email),
    )
    .execute();

  if (!queryResult[0]) {
    throw new Error('user not found');
  }

  return queryResult[0];
};

export const getUserById = async (id: string): Promise<User> => {
  // TODO should abstract this + getObjectByX generally
  const queryResult = await db
    .select({
      id: users.id,
      name: users.name,
      password: users.password,
      email: users.email,
    })
    .from(users)
    .where(
      eq(users.id, id),
    )
    .execute();

  if (!queryResult[0]) {
    throw new Error('user not found');
  }

  return queryResult[0];
};

export const createUser = async (data: RegisterDto): Promise<Omit<User, 'password'>> => {
  const existingUser = await getUserByEmail(data.email).catch(() => null);
  
  if (existingUser) {
    throw new Error(`user with email ${data.email} exists`);
  }

  const password = data.password ? await hashPassword(data.password) : null;

  const [user] = await db
    .insert(users)
    .values({
      ...data,
      password,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .execute();

  return user;
};


export const generateToken = async (user: User) => {
  console.log('generateToken');
  const insertResult = await db
    .insert(tokens)
    .values({
      userId: user.id,
    })
    .returning()
    .execute();

  console.log('token generated');
  return insertResult[0];
};

export const validateToken = async (value: string) => {
  const queryResult = await db
    .select({
      value: tokens.value,
      issuedAt: tokens.issuedAt,
      userId: tokens.userId,
    })
    .from(tokens)
    .where(
      eq(tokens.value, value),
    );

  if (!queryResult[0]) {
    throw new Error('invalid token');
  }

  const [token] = queryResult;

  const { issuedAt } = token;
  const endTimestamp = fns.addMinutes(issuedAt, env.TOKEN_AGE_MINUTES);
  
  if (new Date > endTimestamp) {
    throw new Error('expired token');
  }

  return queryResult[0];
};


export const login = async (email: string, password: string) => {
  let user;

  try {
    user = await getUserByEmail(email);
  } catch (e) {
    throw new Error('invalid credentials provided'); // TODO: to prevent malicious users from knowing if the user exists
  }

  const isValidPassword = await checkUserPassword(user, password);

  if (!isValidPassword) {
    throw new Error('invalid credentials provided');
  }

  const { value } = await generateToken(user);
  return value;
};

export const setupAdminUser = async () => {
  try {
    await createUser({
      name: 'Ahmed',
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    });
  } catch (e) {
    logger.log('admin already exists');
  }
};
