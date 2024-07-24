import * as bcrypt from 'bcrypt';

const saltRound = parseInt(process.env.SALT_ROUND ?? '10');

export const comparePassword = async (pass: string, hashPass: string): Promise<boolean> => {
  const isValid = await bcrypt.compare(pass, hashPass);
  return isValid;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
