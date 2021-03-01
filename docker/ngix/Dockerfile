FROM nginx:alpine

COPY /docker/ngix/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY /docker/ngix/conf/htpasswd /etc/nginx/conf.d/htpasswd
COPY build /webshell
