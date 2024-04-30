import { nanoid } from 'nanoid';
import { varchar } from 'drizzle-orm/pg-core';


const length = 21;
export const nanoId = (name: string) => { // TODO: name can't be undefined, or provide "id" as default
  return varchar(name, {
    length,
  }).$defaultFn(() => nanoid(length));
};