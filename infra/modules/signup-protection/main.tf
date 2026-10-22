terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.100.0"
    }
  }
}

variable "name" {
  type = string
}

variable "stage_arn" {
  type = string
}

variable "domains" {
  type = list(string)
}

resource "aws_wafv2_web_acl" "signup" {
  name          = "${var.name}-signup"
  description   = "Human verification and rate limiting for signup emails"
  scope         = "REGIONAL"
  token_domains = var.domains

  default_action {
    allow {}
  }

  rule {
    name     = "signup-rate-limit"
    priority = 0

    action {
      block {}
    }

    statement {
      rate_based_statement {
        aggregate_key_type    = "IP"
        limit                 = 20
        evaluation_window_sec = 300

        scope_down_statement {
          byte_match_statement {
            positional_constraint = "EXACTLY"
            search_string         = "put"
            field_to_match {
              method {}
            }
            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.name}-signup-rate-limit"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "signup-captcha"
    priority = 1

    action {
      captcha {}
    }

    # Every PUT can reach StateHandler.put, including /state/extra/path.
    # Checking only /state/ would leave alternate paths unprotected.
    statement {
      byte_match_statement {
        positional_constraint = "EXACTLY"
        search_string         = "put"
        field_to_match {
          method {}
        }
        text_transformation {
          priority = 0
          type     = "LOWERCASE"
        }
      }
    }

    captcha_config {
      immunity_time_property {
        immunity_time = 60
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.name}-signup-captcha"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.name}-signup"
    sampled_requests_enabled   = false
  }
}

resource "aws_wafv2_web_acl_association" "signup" {
  resource_arn = var.stage_arn
  web_acl_arn  = aws_wafv2_web_acl.signup.arn
}

resource "aws_wafv2_api_key" "signup" {
  scope         = "REGIONAL"
  token_domains = var.domains
}

output "captcha" {
  value = {
    # Public account/region-scoped URL returned by WAF ListAPIKeys in eu-west-1.
    # It differs from the Web ACL's challenge SDK application_integration_url.
    scriptUrl = "https://7502871be952.eu-west-1.captcha-sdk.awswaf.com/7502871be952/jsapi.js"
    # CAPTCHA keys are domain-bound client configuration, not AWS credentials.
    apiKey = nonsensitive(aws_wafv2_api_key.signup.api_key)
  }
}
