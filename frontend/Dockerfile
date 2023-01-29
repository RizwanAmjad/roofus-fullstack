FROM node:lts-alpine3.16

RUN addgroup app && adduser -S -G app app

WORKDIR /app

COPY --chown=app:app package*.json ./

ENV CONFIG='{"API_BASE_URL":"http://backend:3000/api"}'

RUN npm install

COPY --chown=app:app ./ ./

RUN echo $CONFIG>src/config.json

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD serve dist/
