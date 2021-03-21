FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app

COPY app/* .
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]