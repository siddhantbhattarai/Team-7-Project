#!/bin/sh

# bundle deps
npm install

# migration shit
npx prisma generate
npm run migrate:deploy

# run seeder
npx ts-node prisma/seed.ts

# start server
exec npm run start:dev
