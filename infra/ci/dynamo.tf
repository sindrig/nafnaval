module "dynamo-permissions" {
  source = "../modules/permission"
  name   = "dynamo"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions = [
        "dynamodb:DescribeTable",
        "dynamodb:DescribeTimeToLive",
        "dynamodb:ListTagsOfResource",
        "dynamodb:DescribeContinuousBackups"
      ]
      resources = [
        "arn:aws:dynamodb:eu-west-1:${data.aws_caller_identity.current.account_id}:table/${data.terraform_remote_state.staging.outputs.names_table}",
        "arn:aws:dynamodb:eu-west-1:${data.aws_caller_identity.current.account_id}:table/${data.terraform_remote_state.prod.outputs.names_table}"
      ]
    }
  ]
}
