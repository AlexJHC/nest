import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = 6;
  return bcrypt.hash(password, saltOrRounds);
};
