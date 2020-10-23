module "s3-permissions" {
  source = "../modules/permission"
  name   = "s3-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions = ["s3:*"],
      resources = [
        "arn:aws:s3:::${data.terraform_remote_state.staging.outputs.source_code_bucket}",
        "arn:aws:s3:::${data.terraform_remote_state.staging.outputs.frontendbucket}",
        "arn:aws:s3:::${data.terraform_remote_state.staging.outputs.rootbucket}",
        "arn:aws:s3:::${data.terraform_remote_state.staging.outputs.source_code_bucket}/*",
        "arn:aws:s3:::${data.terraform_remote_state.staging.outputs.frontendbucket}/*",
        "arn:aws:s3:::${data.terraform_remote_state.staging.outputs.rootbucket}/*",
      ]
    }
  ]
}
