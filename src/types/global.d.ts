import { User as AppUser } from '@auth/models/user';

declare global {
  namespace Express {
    export interface User extends AppUser {}

  }


}