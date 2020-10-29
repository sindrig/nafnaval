data "aws_s3_bucket" "state" {
  bucket = "nafnaval-is-terraform-state"
}

module "state-permissions" {
  source = "../modules/permission"
  name   = "state"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions   = ["s3:ListBucket"]
      resources = [data.aws_s3_bucket.state.arn]
    },
    {
      actions = ["s3:GetObject", "s3:PutObject"]
      resources = [
        "${data.aws_s3_bucket.state.arn}/staging/terraform.tfstate",
        "${data.aws_s3_bucket.state.arn}/prod/terraform.tfstate"
      ]
    }
  ]
}
