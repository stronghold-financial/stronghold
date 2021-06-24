#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cd ../../

if ! command -v rsync &> /dev/null; then
    echo "rsync is not installed but is required"
    exit 1
fi

echo "Building WASM"
( cd stronghold-wasm && yarn run build:node )

echo "Installing from lockfile"
rm -rf ./node_modules
yarn --non-interactive --frozen-lockfile --ignore-scripts

echo "Building Stronghold HTTP API project"
cd stronghold-http-api
yarn build

echo "Outputting build to $PWD/build.api"
rm -rf build.api
mkdir build.api

echo "Packing API"
yarn pack -f ./build.api/packaged.tar.gz
cd build.api
tar zxvf packaged.tar.gz

cd package
echo "Copying build"
cp -R ../../build ./

echo "Copying node_modules"
rsync -L -avrq --exclude='stronghold-http-api' ../../../node_modules ./

echo "Packaging build into stronghold-http-api.tar.gz"
cd ..
mv package stronghold-http-api
tar -cf stronghold-http-api.tar.gz stronghold-http-api