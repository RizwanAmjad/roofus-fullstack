FROM node:lts-alpine3.16

RUN addgroup app && adduser -S -G app app

WORKDIR /app

COPY --chown=app:app package*.json ./

RUN npm install

COPY --chown=app:app ./ ./

EXPOSE 3000

CMD npm start