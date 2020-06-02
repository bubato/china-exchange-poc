FROM node:12.16.0

# Create app directory
WORKDIR /usr/src/app

ARG SWAGGER_ENV
ARG SWAGGER_SERVER_URL

ENV SWAGGER_ENV=$SWAGGER_ENV
ENV SWAGGER_SERVER_URL=$SWAGGER_SERVER_URL
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN echo "detect SWAGGER_ENV: $SWAGGER_ENV"
RUN echo "detect SWAGGER_SERVER_URL: $SWAGGER_SERVER_URL"
COPY . .
RUN cd web-client && npm install && npm run build
RUN npm install
RUN npm run build-server
# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 3000
CMD [ "npm", "start" ]