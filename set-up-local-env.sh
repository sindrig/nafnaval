#!/usr/bin/env bash
set -exuo pipefail

export AWS_ACCESS_KEY_ID=foo
export AWS_SECRET_ACCESS_KEY=bar
export AWS_REGION=eu-west-1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
AWS_ACCESS_KEY_ID=foo
AWS_SECRET_ACCESS_KEY=bar
ENDPOINT=http://localhost:4566
export AWS_EXECUTABLE="aws --endpoint=$ENDPOINT"

docker-compose down -v
rm -f infra/dev/terraform.tfstate
docker-compose up -d

while ! $AWS_EXECUTABLE s3 ls; do
    sleep 0.1
done

export AUTO_APPROVE_TF=true
export CREATE_INVALIDATION=false
make target=dev deploy

users=( sindri gerdur heidur bjorn nafnaval )
for user in "${users[@]}"; do
    aws ses verify-email-identity --email-address $user@nafnaval.is --region us-east-1 --endpoint-url=$ENDPOINT
done
