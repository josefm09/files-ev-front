FROM node:12-buster

WORKDIR /usr/src/app

COPY package-lock.json /usr/src/app
COPY package.json /usr/src/app

RUN npm install && npm cache clean --force

# Default user with lower privileges
USER node

CMD ["npm", "start"]