FROM node:14-alpine

WORKDIR /opt/wvw-crawler

COPY package*.json .

RUN npm install

COPY lib lib

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
