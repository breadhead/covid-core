FROM keymetrics/pm2:latest

RUN echo -e 'http://dl-cdn.alpinelinux.org/alpine/edge/main\nhttp://dl-cdn.alpinelinux.org/alpine/edge/community\nhttp://dl-cdn.alpinelinux.org/alpine/edge/testing' > /etc/apk/repositories
RUN apk add --no-cache yarn git mysql-client

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

RUN yarn prestart:prod

EXPOSE 3000

CMD [ "pm2-docker", "start", "ecosystem.config.js" ]
