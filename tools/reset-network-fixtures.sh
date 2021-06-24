#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")"

(
    echo ""
    echo "Generating test fixtures"
    cd ../stronghold-cli
    yarn test
    cd ../stronghold
    yarn test
)

(
    echo ""
    echo "Generating slow test fixtures"
    cd ../stronghold
    yarn test:slow
)

(
    echo ""
    echo "Generating perf test fixtures"
    cd ../stronghold
    yarn test:perf
)
