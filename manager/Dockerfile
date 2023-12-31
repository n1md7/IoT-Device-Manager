ARG BUILD_ENV
ARG PORT=8000
ARG BUILD_IMAGE="node:21.0.0-alpine3.17"

LABEL authors="nimda"

FROM $BUILD_IMAGE AS server
ENV BUILD_ENV=${BUILD_ENV:-production}
WORKDIR /service

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV \
  PORT=$PORT

ENTRYPOINT ["npm", "run", "start:prod"]
