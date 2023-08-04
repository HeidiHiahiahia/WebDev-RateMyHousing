#!bin/bash
#to be manually deployed on the server side default ec2-user ~/ directory
set -e
export NODE_ENV=production
if [ ! -d "rate-my-housing-server" ]
then
   echo "No previous deployment found"
   git clone ist-git@git.uwaterloo.ca:team27/rate-my-housing-server.git
   cd rate-my-housing-server
   npm install
   pm2 start server.js
   exit 0
else
   echo "Previous deployment exists"
   pm2 stop server
   if [ $? -eq 1 ]
   then
     echo "Failed to stop process/ procces not existing"
     cd rate-my-housing-server
     git fetch
     git pull origin master
     npm install
     pm2 start server.js
     exit 0
   else
     echo "Process exists..fetching new code and restarting"
     cd rate-my-housing-server
     git fetch
     git pull origin master
     npm install
     pm2 restart server.js
     exit 0
   fi
fi