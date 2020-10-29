module "cloudfront-permissions" {
  source = "../modules/permission"
  name   = "cloudfront"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions = ["cloudfront:GetDistribution", "cloudfront:ListTagsForResource", "cloudfront:CreateInvalidation"]
      resources = [
        "arn:aws:cloudfront:*:${data.aws_caller_identity.current.account_id}:distribution/${data.terraform_remote_state.staging.outputs.cloudfront}",
        "arn:aws:cloudfront:*:${data.aws_caller_identity.current.account_id}:distribution/${data.terraform_remote_state.staging.outputs.root_cloudfront}",
        "arn:aws:cloudfront:*:${data.aws_caller_identity.current.account_id}:distribution/${data.terraform_remote_state.prod.outputs.cloudfront}",
        "arn:aws:cloudfront:*:${data.aws_caller_identity.current.account_id}:distribution/${data.terraform_remote_state.prod.outputs.root_cloudfront}"
      ]
    },
  ]
}
