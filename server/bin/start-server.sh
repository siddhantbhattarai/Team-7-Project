#!/bin/sh

# bundle deps
npm install

# migration shit
npx prisma generate
npm run migrate:deploy

# start server
exec npm run start:dev
