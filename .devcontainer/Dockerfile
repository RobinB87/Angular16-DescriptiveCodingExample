FROM node:20-alpine3.17

RUN apk update && apk add git

RUN npm install -g @angular/cli@16.2.6

USER node

WORKDIR /app

EXPOSE 4200 49153

CMD npm start