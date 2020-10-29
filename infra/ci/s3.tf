module "s3-permissions" {
  source = "../modules/permission"
  name   = "s3"
  user   = aws_iam_user.nafnaval.name
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
        "arn:aws:s3:::${data.terraform_remote_state.prod.outputs.source_code_bucket}",
        "arn:aws:s3:::${data.terraform_remote_state.prod.outputs.frontendbucket}",
        "arn:aws:s3:::${data.terraform_remote_state.prod.outputs.rootbucket}",
        "arn:aws:s3:::${data.terraform_remote_state.prod.outputs.source_code_bucket}/*",
        "arn:aws:s3:::${data.terraform_remote_state.prod.outputs.frontendbucket}/*",
        "arn:aws:s3:::${data.terraform_remote_state.prod.outputs.rootbucket}/*",
      ]
    }
  ]
}
