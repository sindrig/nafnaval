module "lambda-permissions" {
  source = "../modules/permission"
  name   = "lambda-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions = [
        "lambda:CreateFunction",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration",
        "lambda:UpdateFunctionConfiguration",
        "lambda:GetAlias",
      ]
      resources = [
        "arn:aws:lambda:eu-west-1:${data.aws_caller_identity.current.account_id}:function:${data.terraform_remote_state.staging.outputs.lambda_function_name}"
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
