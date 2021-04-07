FROM openresty/openresty:alpine

COPY /docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY build /www/data/webshell
RUN mkdir -p /upload && chown nobody /upload

