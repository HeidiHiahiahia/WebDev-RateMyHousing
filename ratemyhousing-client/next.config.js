require('dotenv').config()

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["photos.zillowstatic.com","mdbcdn.b-cdn.net"],
  },
  env: {
      BUCKET_NAME: process.env.BUCKET_NAME,
      DIRECTORY:process.env.DIRECTORY,
      REGION:process.env.REGION,
      ACCESS_KEY:process.env.ACCESS_KEY,
      SECRET_KEY:process.env.SECRET_KEY,
      SERVER_URL:process.env.SERVER_URL
  }
};
