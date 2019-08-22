From node:12.7.0

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "prod"]