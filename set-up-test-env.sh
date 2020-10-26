#!/usr/bin/env bash
set -exuo pipefail

AWS_ACCESS_KEY_ID=foo
AWS_SECRET_ACCESS_KEY=bar
AWS_REGION=eu-west-1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
AWS_ACCESS_KEY_ID=foo
AWS_SECRET_ACCESS_KEY=bar
ENDPOINT=http://localhost:4566

docker-compose down -v &
./build_backend.sh
wait
# rm -rf /tmp/localstack
rm -f infra/dev/terraform.tfstate
docker-compose up -d

while ! aws s3 ls --endpoint=$ENDPOINT; do
    sleep 0.1
done

(
    cd infra/dev/
    terraform apply -auto-approve
)

users=( sindri gerdur heidur bjorn nafnaval )
for user in "${users[@]}"; do
    aws ses verify-email-identity --email-address $user@nafnaval.is --region us-east-1 --endpoint-url=$ENDPOINT
done
$DIR/wire.sh dev