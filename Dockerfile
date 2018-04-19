FROM quiq/openresty

RUN mkdir -p /var/www/webchat/app/webchat \
    && mkdir -p /var/www/webchat-admin/admin \
    && mkdir -p /var/www/docs/webchat
    
COPY devops/ci/nginx.conf /usr/local/openresty/nginx/conf/
COPY devops/ci/cdn.lua /usr/local/openresty/nginx/conf/
COPY temp_docker/server.conf /etc/conf.d/
COPY temp_docker/webchat.html temp_docker/bridge.html temp_docker/testWaitScreen.html /var/www/app/webchat/
COPY temp_docker/docs/ /var/www/docs/webchat/
COPY build-info.json /var/www/webchat-admin/admin/
