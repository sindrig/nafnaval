#!/usr/bin/env bash

set -euxo pipefail

ENV=$1

echo "REACT_APP_BASE_API_URL=$(cd infra/$ENV && terraform output base_url)" > frontend/.env