#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cd ../..

echo "Building Docker Image"
cp .gitignore .dockerignore

docker build . \
    --progress plain \
    --tag stronghold-rosetta-api:latest \
    --file stronghold-rosetta-api/Dockerfile
