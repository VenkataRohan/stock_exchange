FROM node:20-alpine

WORKDIR /app

COPY package*.json .

# RUN npm ci --only=production
RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "start" ]