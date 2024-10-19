FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json .

# RUN npm ci --only=production
RUN npm install

COPY . .

CMD [ "./wait-for-it.sh", "postgres:5432", "--" , "./wait-for-it.sh", "rabbitmq:5672", "--","npm", "run", "start"]