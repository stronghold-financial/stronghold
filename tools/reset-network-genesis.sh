#!/usr/bin/env bash

# You should run this first to reset the genesis block
# and wipe out all the fixtures. Then you should run
# reset-network-fixtures.sh

set -euo pipefail
cd "$(dirname "$0")"

echo "Deleting snapshots"
find . -name "__snapshots__" | xargs rm -rf

echo "Deleting fixtures"
find . -name "__fixtures__" | xargs rm -rf

echo "Regenerating genesis block"
cd ../stronghold-cli
yarn start:once chain:genesisblock

echo ""
echo "Copy the above block into genesisBlock.ts"
