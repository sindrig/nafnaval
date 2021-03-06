module "lambda-permissions" {
  source = "../modules/permission"
  name   = "lambda"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions = [
        "lambda:*",
      ]
      resources = [
        "arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.account_id}:function:${data.terraform_remote_state.staging.outputs.lambda_function_name}",
        "arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.account_id}:function:${data.terraform_remote_state.prod.outputs.lambda_function_name}"
      ]
    },
    {
      actions = [
        "lambda:ListFunctions",
        "lambda:ListTags",
      ],
      resources = ["*"]
    }
  ]
}
