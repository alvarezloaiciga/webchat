FROM nginx:stable-alpine
MAINTAINER talon.daniels@goquiq.com

RUN mkdir -p /var/www/webchatIFramify/app/webchat \
    && mkdir -p /var/www/webchat-admin/admin \
    && rm /etc/nginx/conf.d/default.conf \
    && mv /var/cache/nginx /var/cache/nginx.bak \
    && ln -s /tmp /var/cache/nginx \
    && mv /var/run /var/run.bak \
    && ln -s /tmp /var/run

COPY dist /var/www/webchatIFramify/app/webchat
COPY build-info.json /var/www/webchatIFramify-admin/admin
COPY server.conf /etc/nginx/conf.d/server.conf
