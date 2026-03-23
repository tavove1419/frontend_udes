import { User } from './index';

export interface AppStateInterface{
  isAuthenticated: boolean;
  accesToken: string | null;
  userInfo: User | null;
}

