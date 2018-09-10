FROM node:6.6

# Create app directory
WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "start" ]