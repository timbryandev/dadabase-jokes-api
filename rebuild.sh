#!/bin/bash

printf "\n* rebuild.sh\n"

printf "\n*** DOWNING\n"
docker-compose down

printf "\nBUILDING\N"
docker-compose build

printf "\n*** UPPING\n"
docker-compose up -d

printf "\n*** DONE\n"
