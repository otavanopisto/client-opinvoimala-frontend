#!/bin/bash
sed -i "s|{PROD_API_URL}|${PROD_API_URL}|" package.json
sed -i "s|{STAGE_API_URL}|${STAGE_API_URL}|" package.json