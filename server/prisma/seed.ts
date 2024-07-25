import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const saltRound = 10;

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const users: Prisma.UserCreateInput[] = [
  {
    name: 'Admin user',
    phoneNumber: '9801234567',
    gender: 'Male',
    address: 'Kathmandu',
    batch: '2020',
    dob: '2002-01-02',
    roles: [ROLE.ADMIN],
    password: 'dipesh123',
    email: 'dipesh@mailinator.com',
  },
  {
    name: 'Dipesh Kumar sah',
    phoneNumber: '9801234567',
    gender: 'Male',
    dob: '2002-01-02',
    address: 'Kathmandu',
    roles: [ROLE.ADMIN],
    batch: '2020',
    password: 'dipesh123',
    email: 'dipesh.mindxcape@gmail.com',
  },
  {
    name: 'Student User',
    address: 'Kathmandu',
    phoneNumber: '9801234567',
    gender: 'Male',
    dob: '2002-01-02',
    roles: [ROLE.ADMIN],
    password: 'student123',
    batch: '2020',
    course: 'Bsc.CSIT',
    email: 'student@gmail.com',
  },
];

const prisma = new PrismaClient();

async function main() {
  for await (const user of users) {
    const hashPass = await hashPassword(user.password);
    await prisma.user.create({
      data: {
        ...user,
        password: hashPass,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.log(error);
    await prisma.$disconnect();
  });
