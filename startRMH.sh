#!/bin/bash
docker-compose up -d
sleep 15
docker exec mongo bash ./scripts/rs-init.sh
