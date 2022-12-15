#!/bin/bash

printf "\n* update.sh\n"

printf "\n*** DOWNING\n"
docker-compose down

printf "\n*** PULLING\n"
git pull

printf "\nBUILDING\N"
docker-compose build

printf "\n*** UPPING\n"
docker-compose up -d

printf "\n*** DONE\n"
