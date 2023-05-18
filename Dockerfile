# base node image
FROM node:16-bullseye-slim

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

RUN mkdir /app
WORKDIR /app

ADD package.json package-lock.json ./

RUN npm ci

ADD prisma .

ADD . .
RUN npm run build
RUN npx prisma generate
RUN npm run prisma:seed; exit 0

ENV PORT 8080
CMD ["npm", "run", "start"]
