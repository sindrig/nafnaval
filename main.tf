provider "aws" {
  region = "eu-west-1"
}

variable "app_version" {
}

resource "aws_s3_bucket" "lambdaholder" {
  acl    = "private"
}

resource "aws_lambda_function" "namelambda" {
  function_name = "nafnaval-api-lambda"
  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = aws_s3_bucket.lambdaholder.id
  s3_key    = "${var.app_version}/code.zip"
  # s3_bucket = "stack-helpers.irdn.is"
  # s3_key = "code.zip"
  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "main.handler"
  runtime = "python3.8"
  role = aws_iam_role.lambda_exec.arn
  depends_on    = [aws_iam_role_policy_attachment.lambda_logs, aws_cloudwatch_log_group.example]
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda-execution-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_cloudwatch_log_group" "example" {
  name              = "/aws/lambda/nafnaval-api-lambda"
  retention_in_days = 14
}

resource "aws_iam_policy" "lambda_logging" {
  name = "lambda_logging"
  path = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_dynamo" {
  name = "lambda_dynamo"
  path = "/"
  description = "IAM policy for dynamodb from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Resource": ["${aws_dynamodb_table.names.arn}", "${aws_dynamodb_table.config.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "lambda_dynamo" {
  role = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_dynamo.arn
}

resource "aws_api_gateway_rest_api" "gateway" {
  name        = "ServerlessExample"
  description = "Terraform Serverless Application Example"
}

resource "aws_api_gateway_resource" "proxy" {
   rest_api_id = aws_api_gateway_rest_api.gateway.id
   parent_id   = aws_api_gateway_rest_api.gateway.root_resource_id
   path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "options_method" {
    rest_api_id   = aws_api_gateway_rest_api.gateway.id
    resource_id   = aws_api_gateway_resource.proxy.id
    http_method   = "OPTIONS"
    authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200" {
    rest_api_id   = aws_api_gateway_rest_api.gateway.id
    resource_id   = aws_api_gateway_resource.proxy.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = "200"
    response_models = {
        "application/json" = "Empty"
    }
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = [aws_api_gateway_method.options_method]
}
resource "aws_api_gateway_integration" "options_integration" {
    rest_api_id   = aws_api_gateway_rest_api.gateway.id
    resource_id   = aws_api_gateway_resource.proxy.id
    http_method   = aws_api_gateway_method.options_method.http_method
    type          = "MOCK"
    depends_on = [aws_api_gateway_method.options_method]
}
resource "aws_api_gateway_integration_response" "options_integration_response" {
    rest_api_id   = aws_api_gateway_rest_api.gateway.id
    resource_id   = aws_api_gateway_resource.proxy.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = aws_api_gateway_method_response.options_200.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'",
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = [aws_api_gateway_method_response.options_200]
}

resource "aws_api_gateway_method" "proxy" {
   rest_api_id   = aws_api_gateway_rest_api.gateway.id
   resource_id   = aws_api_gateway_resource.proxy.id
   http_method   = "ANY"
   authorization = "NONE"
}

resource "aws_api_gateway_method_response" "cors_method_response_200" {
    rest_api_id   = aws_api_gateway_rest_api.gateway.id
    resource_id   = aws_api_gateway_resource.proxy.id
    http_method   = aws_api_gateway_method.proxy.http_method
    status_code   = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = [aws_api_gateway_method.proxy]
}

resource "aws_api_gateway_integration" "lambda" {
   rest_api_id = aws_api_gateway_rest_api.gateway.id
   resource_id = aws_api_gateway_method.proxy.resource_id
   http_method = aws_api_gateway_method.proxy.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.namelambda.invoke_arn
 }

resource "aws_api_gateway_method" "proxy_root" {
   rest_api_id   = aws_api_gateway_rest_api.gateway.id
   resource_id   = aws_api_gateway_rest_api.gateway.root_resource_id
   http_method   = "ANY"
   authorization = "NONE"
 }

 resource "aws_api_gateway_integration" "lambda_root" {
   rest_api_id = aws_api_gateway_rest_api.gateway.id
   resource_id = aws_api_gateway_method.proxy_root.resource_id
   http_method = aws_api_gateway_method.proxy_root.http_method

   integration_http_method = "POST"
   type                    = "AWS_PROXY"
   uri                     = aws_lambda_function.namelambda.invoke_arn
 }

 resource "aws_api_gateway_deployment" "deployment" {
   depends_on = [
     aws_api_gateway_integration.lambda,
     aws_api_gateway_integration.lambda_root,
   ]

   rest_api_id = aws_api_gateway_rest_api.gateway.id
   stage_name  = "stage"
 }

resource "aws_lambda_permission" "apigw" {
   statement_id  = "AllowAPIGatewayInvoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.namelambda.function_name
   principal     = "apigateway.amazonaws.com"

   source_arn = "${aws_api_gateway_rest_api.gateway.execution_arn}/*/*/*"
 }

resource "aws_dynamodb_table" "config" {
  # TODO: Maybe vars?
  name = "nafnaval-config"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "StateId"
  # range_key = "Email"

  attribute {
    name = "StateId"
    type = "S"
  }

#  attribute {
#    name = "Email"
#    type = "S"
#  }
}

resource "aws_dynamodb_table" "names" {
  name = "nafnaval-names"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "StateId"
  range_key = "Name"

  attribute {
    name = "StateId"
    type = "S"
  }

   attribute {
     name = "Name"
     type = "S"
   }

#  attribute {
#    name = "Done"
#    type = "N"
#  }

#  attribute {
#    name = "Selected"
#    type = "N"
#  }
}

output "base_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}

output "names_table" {
  value = aws_dynamodb_table.names.name
}

output "config_table" {
  value = aws_dynamodb_table.config.name
}

output "codebucket" {
  value = aws_s3_bucket.lambdaholder.bucket
}