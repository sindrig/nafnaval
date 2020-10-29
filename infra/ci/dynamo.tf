module "dynamo-permissions" {
  source = "../modules/permission"
  name   = "dynamo-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions = [
        "dynamodb:DescribeTable",
        "dynamodb:DescribeTimeToLive",
        "dynamodb:ListTagsOfResource",
        "dynamodb:DescribeContinuousBackups"
      ]
      resources = ["arn:aws:dynamodb:eu-west-1:${data.aws_caller_identity.current.account_id}:table/${data.terraform_remote_state.staging.outputs.names_table}"]
    }
  ]
}
