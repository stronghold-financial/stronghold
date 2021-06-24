#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cd ..

if [ -z "${AWS_ACCESS_KEY_ID-}" ]; then
    echo "Set AWS_ACCESS_KEY_ID before running deploy-brew.sh"
    exit 1
fi

if [ -z "${AWS_SECRET_ACCESS_KEY-}" ]; then
    echo "Set AWS_SECRET_ACCESS_KEY before running deploy-brew.sh"
    exit 1
fi

SOURCE_NAME=stronghold-cli.tar.gz
SOURCE_PATH=./build.cli/$SOURCE_NAME

echo "Getting git hash"
GIT_HASH=$(git rev-parse --short HEAD)

echo "Getting sha256"
UPLOAD_HASH=$(shasum -a 256 $SOURCE_PATH | awk '{print $1}')

UPLOAD_NAME=stronghold-cli-$GIT_HASH.tar.gz
UPLOAD_URL=s3://stronghold-cli/$UPLOAD_NAME
PUBLIC_URL=https://stronghold-cli.s3.amazonaws.com/$UPLOAD_NAME

echo ""
echo "GIT HASH:     $GIT_HASH"
echo "SHA256:       $UPLOAD_HASH"
echo "UPLOAD NAME:  $UPLOAD_NAME"
echo "UPLOAD URL:   $UPLOAD_URL"
echo "PUBLIC URL:   $PUBLIC_URL"
echo ""

if aws s3api head-object --bucket stronghold-cli --key $UPLOAD_NAME > /dev/null 2>&1 ; then
    echo "Release already uploaded: $PUBLIC_URL"
    exit 1
fi

echo "Uploading $SOURCE_NAME to $UPLOAD_URL"
aws s3 cp $SOURCE_PATH $UPLOAD_URL

echo ""
echo "You are almost finished! To finish the process you need to update update url and sha256 in"
echo "https://github.com/stronghold/homebrew-brew/blob/master/Formula/stronghold.rb"
echo ""
echo "URL = \"$PUBLIC_URL\".freeze"
echo "SHA = \"$UPLOAD_HASH\".freeze"
