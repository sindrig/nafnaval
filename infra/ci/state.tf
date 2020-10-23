data "aws_s3_bucket" "state" {
  bucket = "nafnaval-is-terraform-state"
}

module "state-permissions" {
  source = "../modules/permission"
  name   = "state-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions   = ["s3:ListBucket"]
      resources = [data.aws_s3_bucket.state.arn]
    },
    {
      actions   = ["s3:GetObject", "s3:PutObject"]
      resources = ["${data.aws_s3_bucket.state.arn}/staging/terraform.tfstate"]
    }
  ]
}
