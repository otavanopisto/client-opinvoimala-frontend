# Build
FROM node:16-alpine as build-deps
WORKDIR /usr/src/app

ARG ENVIRONMENT
ARG REACT_APP_MEILI_HOST
ARG REACT_APP_MEILI_PUBLIC_KEY
ENV REACT_APP_MEILI_HOST $REACT_APP_MEILI_HOST
ENV REACT_APP_MEILI_PUBLIC_KEY $REACT_APP_MEILI_PUBLIC_KEY

COPY package.json yarn.lock ./
RUN yarn install
COPY . ./

RUN yarn build:${ENVIRONMENT}
RUN yarn autoclean --force

# Production environment
FROM nginx:1.23.1-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
