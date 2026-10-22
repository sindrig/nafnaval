variable "dynamo_table_name" {}

variable "lambda_function_name" {}

variable "lambda_runtime" {
  type    = string
  default = "python3.12"
}

variable "frontend_url" {
  type    = string
  default = "https://www.nafnaval.is"
}

variable "iam_resource_suffix" {
  default = ""
}

variable "lambda_environment" {
  default = {}
  type    = map(any)
}

variable "signups_enabled" {
  type        = bool
  default     = false
  description = "Allow new signups only after the CAPTCHA-protected flow has been verified. Existing lists remain available."
}
