FROM node:18.16.1

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

COPY ./dist ./dist

CMD ["yarn", "remove", "bcrypt"]
CMD ["yarn", "add", "bcrypt"]
CMD ["yarn", "run", "start:dev"]