locals {
  code_path = "${path.module}/../../../dist/code.zip"
}

resource "aws_s3_bucket" "lambdaholder" {
  acl = "private"
  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_object" "code" {
  bucket = aws_s3_bucket.lambdaholder.bucket
  key    = "${filemd5(local.code_path)}/code.zip"
  source = local.code_path

  etag = filemd5(local.code_path)
}

resource "aws_lambda_function" "namelambda" {
  s3_bucket = aws_s3_bucket.lambdaholder.id
  s3_key    = aws_s3_bucket_object.code.id

  function_name = var.lambda_function_name

  handler = "main.handler"
  runtime = "python3.8"
  role    = aws_iam_role.lambda_exec.arn

  reserved_concurrent_executions = -1
  timeout                        = 5
  memory_size                    = 128

  tracing_config {
    mode = "PassThrough"
  }

  environment {
    variables = merge(
      map(
        "NAMES_TABLE", aws_dynamodb_table.names.name
      ),
      var.lambda_environment
    )
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_logs, aws_s3_bucket_object.code]
}

resource "aws_iam_role" "lambda_exec" {
  name               = "lambda-execution-role${var.iam_resource_suffix}"
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

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging${var.iam_resource_suffix}"
  path        = "/"
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
  name        = "lambda_dynamo${var.iam_resource_suffix}"
  path        = "/"
  description = "IAM policy for dynamodb from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Resource": ["${aws_dynamodb_table.names.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_ses" {
  name        = "lambda_ses${var.iam_resource_suffix}"
  path        = "/"
  description = "IAM policy for SES from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ses:SendEmail"
      ],
      "Resource": ["*"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "lambda_dynamo" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_dynamo.arn
}

resource "aws_iam_role_policy_attachment" "lambda_ses" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_ses.arn
}

resource "aws_api_gateway_rest_api" "gateway" {
  name        = "NafnavalGateway"
  description = "Terraform Gateway to Nafnaval lambda"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.gateway.id
  parent_id   = aws_api_gateway_rest_api.gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.gateway.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "cors_method_response_200" {
  rest_api_id = aws_api_gateway_rest_api.gateway.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method
  status_code = 200
  #response_parameters = {
  #"method.response.header.Access-Control-Allow-Origin" = true
  #}
  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
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

module "gateway_cors" {
  source  = "bridgecrewio/apigateway-cors/aws"
  version = "1.2.0"

  api       = aws_api_gateway_rest_api.gateway.id
  resources = [aws_api_gateway_resource.proxy.id]

  methods = ["GET", "POST", "PUT"]

  depends_on = [aws_api_gateway_rest_api.gateway, aws_api_gateway_resource.proxy]
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.namelambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.gateway.execution_arn}/*/*/*"
}

resource "aws_dynamodb_table" "names" {
  name         = var.dynamo_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "StateId"

  attribute {
    name = "StateId"
    type = "S"
  }
}
