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
  source               = "../modules/nafnaval"
  dynamo_table_name    = "dev-nafnaval-names"
  lambda_function_name = "dev-nafnaval-api-lambda"
  iam_resource_suffix  = "dev"
  lambda_environment = {
    LOCALSTACK = "true"
  }
}

resource "aws_s3_bucket" "www" {
  bucket = "nafnaval"
  acl    = "public-read"
  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::nafnaval/*"]
    }
  ]
}
POLICY

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "local_file" "local-env-json" {
  content  = local.env_content
  filename = "${path.module}/../../frontend/public/env.json"
}

resource "aws_s3_bucket_object" "object" {
  bucket  = aws_s3_bucket.www.id
  key     = "env.json"
  content = local.env_content

  content_type = "application/json"
}

locals {
  base_url    = "http://localhost:4566/restapis/${module.nafnaval.rest_api_id}/stage/_user_request_/"
  env_content = <<CONTENT
{
  "baseURL": "${local.base_url}"
}
CONTENT
}


output "frontendbucket" {
  value = aws_s3_bucket.www.bucket
}

output "base_url" {
  value = local.base_url
}

output "names_table" {
  value = module.nafnaval.names_table
}
