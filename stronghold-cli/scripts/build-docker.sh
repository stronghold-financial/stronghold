#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cd ../..

echo "Building Docker Image"
cp .gitignore .dockerignore

docker build . \
    --progress plain \
    --tag stronghold:latest \
    --file stronghold-cli/Dockerfile

docker run \
    --interactive \
    --rm \
    stronghold:latest --version
