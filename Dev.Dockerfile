FROM node:10.15-alpine

WORKDIR /var/app

COPY package*.json ./

RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  apk del make gcc g++ python
  
COPY ./ /var/app

CMD npm run dev