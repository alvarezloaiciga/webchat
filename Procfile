wpk: node dev-server.js
ngrok: sleep 1 && ./node_modules/.bin/ngrok tcp 3000 --log=stdout
url: sleep 2 && out=`curl -silent -L localhost:4040 | grep -oh --color '0.tcp.ngrok.io:[0-9]\{5\}'` && echo "\033[31m !!!!!!!!Navigate to http://$out to get started!!!!!!!" && sleep 9999999999999999999
