export interface AuthInterface {
  refresh: string;
  access: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Credentials {
  email: string
  password: string
}
