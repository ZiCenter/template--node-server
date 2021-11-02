FROM timbru31/node-alpine-git:14

RUN apk add --no-cache build-base python2-dev python2 libffi-dev libressl-dev bash
RUN apk add --no-cache make g++

RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

RUN npm install --global typescript ts-node

WORKDIR /app

COPY package.json ./
COPY setup.js ./
COPY .env ./

RUN npm install
RUN npm run postinstall

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

FROM node:14-alpine as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm config set unsafe-perm true
RUN npm install -g typescript ts-node

USER node
RUN npm install

COPY --chown=node:node . .
RUN npm run build

FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node
RUN npm install --production

COPY --from=builder /home/node/app/dist ./dist

EXPOSE 3000

CMD ['npm', 'start']


