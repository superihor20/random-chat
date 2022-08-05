export type User = {
  id: number;
  username: string;
  color: string;
};

export type Users = User[];

export type SignUpBody = {
  email: string;
  password: string;
};

export type SignUpResponse = {
  accessToken: string;
  refreshToken: string;
};
