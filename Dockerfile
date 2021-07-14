FROM node:14.17 AS builder
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm i

COPY . .
RUN npm run prod

FROM nginx:1.20
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/public /usr/share/nginx/html
