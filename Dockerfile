FROM nginx:stable-alpine
MAINTAINER talon.daniels@goquiq.com

RUN mkdir -p /var/www/webchat/app/webchatiframify \
    && mkdir -p /var/www/webchat-admin/admin \
    && rm /etc/nginx/conf.d/default.conf \
    && mv /var/cache/nginx /var/cache/nginx.bak \
    && ln -s /tmp /var/cache/nginx \
    && mv /var/run /var/run.bak \
    && ln -s /tmp /var/run

COPY temp_docker/webchat.html temp_docker/bridge.html /var/www/webchat/app
COPY temp_docker/server.conf /etc/nginx/conf.d/server.conf
COPY build-info.json /var/www/webchat-admin/admin