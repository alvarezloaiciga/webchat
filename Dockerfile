FROM nginx:stable-alpine
MAINTAINER talon.daniels@goquiq.com

RUN mkdir -p /var/www/webchat/app/webchat \
    && mkdir -p /var/www/webchat-admin/admin \
    && rm /etc/nginx/conf.d/default.conf \
    && mv /var/cache/nginx /var/cache/nginx.bak \
    && ln -s /tmp /var/cache/nginx \
    && mv /var/run /var/run.bak \
    && ln -s /tmp /var/run

COPY temp_docker/webchat.html temp_docker/bridge.html temp_docker/testWaitScreen.html /var/www/app/webchat/
COPY temp_docker/server.conf /etc/nginx/conf.d/server.conf
COPY temp_docker/docs/ /var/www/app/docs/webchat/ 
COPY build-info.json /var/www/webchat-adm