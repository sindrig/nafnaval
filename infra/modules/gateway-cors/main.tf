locals {
  methodOptions  = "OPTIONS"
  defaultHeaders = ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token"]

  methods = join(",", distinct(concat(var.methods, [local.methodOptions])))
  headers = var.discard_default_headers ? join(",", var.headers) : join(",", distinct(concat(var.headers, local.defaultHeaders)))
}

resource "aws_api_gateway_method" "cors_method" {
  count         = var.enable ? length(var.resources) : 0
  rest_api_id   = var.api
  resource_id   = var.resources[count.index]
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "cors_integration" {
  count       = var.enable ? length(var.resources) : 0
  rest_api_id = var.api
  resource_id = var.resources[count.index]
  http_method = aws_api_gateway_method.cors_method.*.http_method[count.index]
  type        = "MOCK"

  request_templates = {
    "application/json" = <<EOF
{ "statusCode": 200 }
EOF
  }
}

resource "aws_api_gateway_method_response" "cors_method_response" {
  count       = var.enable ? length(var.resources) : 0
  rest_api_id = var.api
  resource_id = var.resources[count.index]
  http_method = aws_api_gateway_method.cors_method.*.http_method[count.index]

  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "cors_integration_response" {
  count       = var.enable ? length(var.resources) : 0
  rest_api_id = var.api
  resource_id = aws_api_gateway_method.cors_method.*.resource_id[count.index]
  http_method = aws_api_gateway_method.cors_method.*.http_method[count.index]
  status_code = aws_api_gateway_method_response.cors_method_response.*.status_code[count.index]

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'${local.headers}'"
    "method.response.header.Access-Control-Allow-Methods" = "'${local.methods}'"
    "method.response.header.Access-Control-Allow-Origin"  = "'${var.origin}'"
  }
}
