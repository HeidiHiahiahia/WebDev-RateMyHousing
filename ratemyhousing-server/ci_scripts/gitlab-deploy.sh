#!bin/bash

echo "Deploy project on server ${STAGE_DEPLOY_SERVER}"
ssh ec2-user@${STAGE_DEPLOY_SERVER} "bash ./aws-ec2-deploy.sh"