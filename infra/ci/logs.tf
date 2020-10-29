module "logs-permissions" {
  source = "../modules/permission"
  name   = "logs"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions   = ["logs:DescribeLogGroups", "logs:ListTagsLogGroup"],
      resources = ["arn:aws:logs:eu-west-1:${data.aws_caller_identity.current.account_id}:log-group:*:log-stream:*"]
    }
  ]
}
