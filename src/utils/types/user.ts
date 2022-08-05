export type User = {
  id: number;
  username: string;
  color: string;
};

export type Users = User[];

export type AuthBody = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};
