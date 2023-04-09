FROM node:6 as build

RUN npm install --global grunt-cli@1.3.2

WORKDIR /usr/src/storage

COPY package*.json ./

RUN npm install

COPY src src
COPY Gruntfile.coffee .

RUN grunt build

FROM nginx:1.19-alpine

COPY --from=build /usr/src/storage/out /usr/src/template
COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]
