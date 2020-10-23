#!/usr/bin/env bash
set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

(
    cd $DIR
    rm -rf dist && mkdir -p dist
    cd backend
    if [ ! -d "dist-venv" ]; then
        virtualenv dist-venv
    fi
    source dist-venv/bin/activate
    pip install -r requirements.txt -t $DIR/dist
    cp -r main.py server $DIR/dist
    cd $DIR/dist
    zip -r9 code.zip .
)