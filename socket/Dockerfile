# syntax=docker/dockerfile:1

FROM node:19-alpine

ENV NODE_ENV=dev

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
