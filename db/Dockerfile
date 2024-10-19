FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json .

# RUN npm ci --only=production
RUN npm install

COPY prisma .

RUN npx prisma generate

COPY . .

EXPOSE 5432

# CMD ["bash","./wait-for-it.sh", "rabbitmq:5672","--","npm", "run", "dev" ]
#--no-reset --skip-seed
# CMD [ "./wait-for-it.sh", "rabbitmq:5672", "--","npm", "run", "start" ]
CMD ./wait-for-it.sh postgres:5432 -- && \
  if [ "$INIT" = "true" ]; then \
  npx prisma migrate dev  && \
  npx prisma db seed; fi && \
  ./wait-for-it.sh rabbitmq:5672 -- && \
  npm run dev