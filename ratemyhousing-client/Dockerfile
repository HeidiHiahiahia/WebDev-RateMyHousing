FROM node:lts-bullseye
# ENV NODE_ENV=production
ENV NODE_ENV=development
RUN apt-get update && apt-get install
WORKDIR /usr/src/app
COPY package.json .
COPY . .
RUN echo SERVER_URL=http://localhost:8000 >> .env && echo DIRECTORY=propertyImages 
RUN npm install
RUN npm run build
EXPOSE 3000
