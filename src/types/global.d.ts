import { User as AppUser } from './../features/auth/models/user';

declare global {
  namespace Express {
    export interface User extends AppUser {}

  }
}
