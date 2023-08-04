FROM node:lts-bullseye
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN apt-get update && npm install && echo REFRESH_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(256).toString('base64'));") >> .env && echo ACCESS_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(256).toString('base64'));") >> .env
EXPOSE 8000 27017
CMD ["npm","run" , "start"]
