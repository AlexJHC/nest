FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn

COPY --chown=node:node . .

RUN yarn build

USER node
###

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/dist dist
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/yarn.lock ./

RUN yarn install --production
RUN yarn cache clean

CMD yarn start:prod