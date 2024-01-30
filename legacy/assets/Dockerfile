FROM node:6 as build

RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list \
  && apt-get update && apt-get install -y --no-install-recommends \
    webp \
    pngcrush \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/gw2treasures-assets

COPY package*.json ./

RUN npm install

COPY src src
COPY tasks tasks
COPY Gruntfile.coffee .

RUN npm run build

FROM nginx:1.19-alpine

COPY --from=build /usr/src/gw2treasures-assets/out /usr/share/nginx/html/gw2treasures/assets
