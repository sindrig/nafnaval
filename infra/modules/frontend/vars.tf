variable "base_url" {
  type        = "string"
  description = "Base url of the api"
}

variable "write_local" {
  type        = bool
  description = "Write env.json to local disk"
  default     = false
}

variable "www_domain_name" {
  type        = "string"
  description = "www domain name of the bucket"
}

variable "root_domain_name" {
  type        = "string"
  description = "root domain name of the bucket"
}
