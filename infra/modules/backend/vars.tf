variable "dynamo_table_name" {}

variable "lambda_function_name" {}

variable "iam_resource_suffix" {
  default = ""
}

variable "lambda_environment" {
  default = {}
  type    = map
}
