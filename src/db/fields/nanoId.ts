import { nanoid } from 'nanoid';
import { varchar } from 'drizzle-orm/pg-core';


const length = 21;

export const nanoId = (name: string, maxLength?: number) => { // TODO: name can't be undefined, or provide "id" as default
  return varchar(name, {
    length: maxLength || length,
  }).$defaultFn(() => nanoid(maxLength || length));
};