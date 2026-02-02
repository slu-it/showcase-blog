export interface Context {
  user: User;
}

export interface User {
  username: string;
  isAuthor: boolean;
  isAdmin: boolean;
}
