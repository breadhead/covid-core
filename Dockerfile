FROM keymetrics/pm2:10-alpine

RUN echo -e 'http://dl-cdn.alpinelinux.org/alpine/edge/main\nhttp://dl-cdn.alpinelinux.org/alpine/edge/community\nhttp://dl-cdn.alpinelinux.org/alpine/edge/testing' > /etc/apk/repositories
RUN apk add --no-cache yarn git mysql-client

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

RUN yarn evolutions:run
RUN yarn prestart:prod

RUN rm -rf src

EXPOSE 3000

CMD [ "pm2-docker", "start", "ecosystem.config.js" ]
