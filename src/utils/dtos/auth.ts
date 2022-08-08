export type AuthBody = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshBody = {
  refreshToken: string;
};
