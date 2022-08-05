import bcrypt from 'bcrypt';

export const generateRefreshToken = async (salt: number | string): Promise<any> => {
  return bcrypt.hash(new Date().toUTCString(), salt);
};
