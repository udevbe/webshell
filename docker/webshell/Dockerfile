FROM openresty/openresty:alpine

COPY /docker/webshell/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY /docker/webshell/conf/htpasswd /etc/nginx/conf.d/htpasswd
COPY build /webshell
RUN mkdir -p /upload && chown nobody /upload

