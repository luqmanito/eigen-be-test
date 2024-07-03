FROM node:lts-alpine as builder

WORKDIR /app

RUN apk add --update openssl libc-dev

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

# Production image

FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV production

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 4080

CMD ["node", "dist/main"]
