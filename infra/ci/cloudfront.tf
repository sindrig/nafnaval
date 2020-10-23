module "cloudfront-permissions" {
  source = "../modules/permission"
  name   = "cloudfront-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions = ["cloudfront:GetDistribution", "cloudfront:ListTagsForResource"]
      resources = [
        "arn:aws:cloudfront:*:${data.aws_caller_identity.current.account_id}:distribution/${data.terraform_remote_state.staging.outputs.cloudfront}",
        "arn:aws:cloudfront:*:${data.aws_caller_identity.current.account_id}:distribution/${data.terraform_remote_state.staging.outputs.root_cloudfront}"
      ]
    },
  ]
}
