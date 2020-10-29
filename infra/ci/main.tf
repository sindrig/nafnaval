provider "aws" {
  region = "eu-west-1"
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {
    encrypt = true
    bucket  = "nafnaval-is-terraform-state"
    region  = "eu-west-1"
    key     = "ci/terraform.tfstate"
  }
}

data "terraform_remote_state" "staging" {
  backend = "s3"

  config = {
    bucket = "nafnaval-is-terraform-state"
    region = "eu-west-1"
    key    = "staging/terraform.tfstate"
  }
}

data "terraform_remote_state" "prod" {
  backend = "s3"

  config = {
    bucket = "nafnaval-is-terraform-state"
    region = "eu-west-1"
    key    = "prod/terraform.tfstate"
  }
}

resource "aws_iam_user" "nafnaval" {
  name = "nafnaval-ci"
}


resource "aws_iam_access_key" "access-key" {
  user = aws_iam_user.nafnaval.name
}
