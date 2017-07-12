FROM node:boron

ENV APP_DIR /opt/node-rabbit/server

WORKDIR $APP_DIR

COPY ./package.json /tmp/package.json

RUN cd /tmp && npm install
RUN mv /tmp/node_modules $APP_DIR/node_modules

COPY . .

CMD npm start
