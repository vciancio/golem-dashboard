FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY app/package.json ./
COPY app/package-lock.json ./
RUN npm install

COPY app/ /app/
CMD ["npm", "start"]
