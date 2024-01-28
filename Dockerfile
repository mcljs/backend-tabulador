FROM node:16-alpine3.16
RUN apk update && apk upgrade && \
    apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install --production && npm cache clean --force
COPY ./ /usr/src/app
EXPOSE 80
CMD [ "npm", "start" ]
