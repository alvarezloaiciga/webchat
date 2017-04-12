FROM nginx:stable-alpine
MAINTAINER talon.daniels@goquiq.com

RUN mkdir -p /var/www/webchat/app/webchat \
    && mkdir -p /var/www/webchat-admin/admin \
    && rm /etc/nginx/conf.d/default.conf \
    && mv /var/cache/nginx /var/cache/nginx.bak \
    && ln -s /tmp /var/cache/nginx \
    && mv /var/run /var/run.bak \
    && ln -s /tmp /var/run

COPY dist /var/www/webchat/app/webchat
COPY build-info.json /var/www/webchat-admin/admin
COPY server.conf /etc/nginx/conf.d/server.conf
