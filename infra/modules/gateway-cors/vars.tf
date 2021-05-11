variable "enable" {
  description = "Allows enabling this entire module, if you'd like it to be disabled for specific builds / cases"
  default     = true
}

variable "api" {
  description = "ID of an aws_api_gateway_rest_api resource"
  type        = string
}

variable "resources" {
  description = "List of the IDs of an aws_api_gateway_resource resource"
  type        = list(string)
}

variable "methods" {
  description = "List of permitted HTTP methods. OPTIONS is added by default."
  type        = list(string)
}

variable "origin" {
  description = "Permitted origin"
  default     = "*"
}

variable "headers" {
  description = "List of permitted headers. Default headers are alway present unless discard_default_headers variable is set to true"
  default     = ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token"]
}

variable "discard_default_headers" {
  description = "When set to true to it discards the default permitted headers and only includes those explicitly defined"
  default     = false
}
