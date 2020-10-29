module "apigateway-permissions" {
  source = "../modules/permission"
  name   = "apigateway"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions = ["apigateway:GET", "tag:GetResources"],
      resources = [
        "arn:aws:apigateway:eu-west-1:*:/restapis/${data.terraform_remote_state.staging.outputs.rest_api_id}",
        "arn:aws:apigateway:eu-west-1:*:/restapis/${data.terraform_remote_state.staging.outputs.rest_api_id}/*",
        "arn:aws:apigateway:eu-west-1:*:/restapis/${data.terraform_remote_state.prod.outputs.rest_api_id}",
        "arn:aws:apigateway:eu-west-1:*:/restapis/${data.terraform_remote_state.prod.outputs.rest_api_id}/*"
      ]
    },
  ]
}
