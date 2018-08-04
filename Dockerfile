FROM node:8.11.3-alpine

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
