FROM node:20-slim as base

WORKDIR /home/ricardo/heve-line-planner/

COPY package*.json ./

RUN npm i --legacy-peer-deps

COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build