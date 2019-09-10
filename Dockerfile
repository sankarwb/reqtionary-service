From node:12.7.0

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "prod"]