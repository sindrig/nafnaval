provider "aws" {
  region = "us-east-1"

  access_key                  = "foo"
  secret_key                  = "bar"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_force_path_style         = true
  endpoints {
    apigateway     = "http://localhost:4566"
    cloudwatchlogs = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    s3             = "http://localhost:4566"
  }
}

module "nafnaval" {
  source               = "../modules/backend"
  dynamo_table_name    = "dev-nafnaval-names"
  lambda_function_name = "dev-nafnaval-api-lambda"
  iam_resource_suffix  = "dev"
  lambda_environment = {
    LOCALSTACK = "true"
  }
}


module "frontend" {
  source           = "../modules/frontend"
  base_url         = local.base_url
  www_domain_name  = "nafnaval"
  root_domain_name = "root-nafnaval"
  write_local      = true
}

locals {
  base_url = "http://localhost:4566/restapis/${module.nafnaval.rest_api_id}/stage/_user_request_/"
}


output "frontendbucket" {
  value = module.frontend.frontendbucket
}

output "base_url" {
  value = local.base_url
}

output "names_table" {
  value = module.nafnaval.names_table
}
