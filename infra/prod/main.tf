locals {
  root_domain_name     = "nafnaval.is"
  www_domain_name      = "www.nafnaval.is"
  lambda_function_name = "nafnaval-api-lambda"
  dynamo_table_name    = "nafnaval-names"
}

provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us"
}

terraform {
  backend "s3" {
    encrypt = true
    bucket  = "nafnaval-is-terraform-state"
    region  = "eu-west-1"
    key     = "prod/terraform.tfstate"
  }
  required_providers {
    aws = "~> 3.73.0"
  }
}

data "aws_acm_certificate" "certificate" {
  provider = aws.us
  domain   = "*.nafnaval.is"
}

resource "aws_cloudfront_distribution" "www_distribution" {
  origin {
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    domain_name = module.frontend.website_endpoint
    origin_id   = local.www_domain_name
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.www_domain_name
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  aliases = [local.www_domain_name]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.certificate.arn
    ssl_support_method  = "sni-only"
  }
}

resource "aws_route53_zone" "zone" {
  name = local.root_domain_name
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = local.www_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.www_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.www_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_cloudfront_distribution" "root_distribution" {
  origin {
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
    domain_name = module.frontend.root_website_endpoint
    origin_id   = local.root_domain_name
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.root_domain_name
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  aliases = [local.root_domain_name]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.certificate.arn
    ssl_support_method  = "sni-only"
  }
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.zone.zone_id

  // NOTE: name is blank here.
  name = ""
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.root_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.root_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}


resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${local.lambda_function_name}"
  retention_in_days = 14
}

module "nafnaval" {
  source               = "../modules/backend"
  dynamo_table_name    = local.dynamo_table_name
  lambda_function_name = local.lambda_function_name
}

module "frontend" {
  source           = "../modules/frontend"
  base_url         = module.nafnaval.base_url
  www_domain_name  = local.www_domain_name
  root_domain_name = local.root_domain_name
}


output "base_url" {
  value = module.nafnaval.base_url
}

output "source_code" {
  value = module.nafnaval.source_code
}

output "names_table" {
  value = module.nafnaval.names_table
}

output "frontendbucket" {
  value = module.frontend.frontendbucket
}

output "cloudfront" {
  value = aws_cloudfront_distribution.www_distribution.id
}

output "root_cloudfront" {
  value = aws_cloudfront_distribution.root_distribution.id
}

output "certificate_arn" {
  value = data.aws_acm_certificate.certificate.arn
}

output "rest_api_id" {
  value = module.nafnaval.rest_api_id
}

output "source_code_bucket" {
  value = module.nafnaval.source_code_bucket
}

output "rootbucket" {
  value = module.frontend.rootbucket
}

output "lambda_function_name" {
  value = local.lambda_function_name
}
