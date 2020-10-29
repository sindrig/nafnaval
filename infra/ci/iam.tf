locals {
  iam_policies = [
    "lambda_ses",
    "lambda_logging",
    "lambda_dynamo",
  ]
}

module "iam-permissions" {
  source = "../modules/permission"
  name   = "iam"
  user   = aws_iam_user.nafnaval.name
  statements = concat(
    [
      for policy in local.iam_policies :
      {
        actions = ["iam:GetPolicy", "iam:GetPolicyVersion"],
        resources = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${policy}staging",
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${policy}",
        ]
      }
    ],
    [
      {
        actions = ["iam:GetRole", "iam:ListAttachedRolePolicies"]
        resources = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda-execution-rolestaging",
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda-execution-role",
        ]
      }
    ]
  )
}
