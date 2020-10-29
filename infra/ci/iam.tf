locals {
  iam_policies = [
    "lambda_ses",
    "lambda_logging",
    "lambda_dynamo",
  ]
}

module "iam-permissions" {
  source = "../modules/permission"
  name   = "iam-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = concat(
    [
      for policy in local.iam_policies :
      {
        actions   = ["iam:GetPolicy", "iam:GetPolicyVersion"],
        resources = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${policy}staging"]
      }
    ],
    [
      {
        actions   = ["iam:GetRole", "iam:ListAttachedRolePolicies"]
        resources = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda-execution-rolestaging"]
      }
    ]
  )
}
