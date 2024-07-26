# Install dependencies only when needed
FROM node:18-alpine3.17 AS builder
WORKDIR /app

#####################
# RUN FOR DEVELOPMENT
#####################
FROM builder as dev
RUN --mount=type=bind,source=client/package.json,target=package.json \
    --mount=type=bind,source=client/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    yarn install --include=dev
#USER node
CMD yarn dev

FROM node:18-alpine3.17 AS devDeps
WORKDIR /opt/app
COPY package.json ./
RUN yarn install --production && yarn cache clean -f


FROM node:18-alpine3.17 AS copy
WORKDIR /usr/src/app
# COPY --from=builder /opt/app/.env ./
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=devDeps /opt/app/node_modules ./node_modules

# Production image, copy all the files and run next
FROM node:18-alpine3.17 AS runner
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=copy /usr/src/app ./
CMD ["node_modules/.bin/next", "start"]
