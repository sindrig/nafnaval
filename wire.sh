#!/usr/bin/env bash

set -euxo pipefail

ENV=$1

BASE_URL=$(cd infra/$ENV && terraform output base_url)

echo "REACT_APP_BASE_API_URL=$BASE_URL" > frontend/.env