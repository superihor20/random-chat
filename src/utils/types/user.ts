export type User = {
  id: number;
  username: string;
  color: string;
};

export type Users = User[];

export type SignUpBody = {
  login: string;
  password: string;
};
