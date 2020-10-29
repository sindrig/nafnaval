module "certs-permissions" {
  source = "../modules/permission"
  name   = "certs"
  user   = aws_iam_user.nafnaval.name
  statements = [
    {
      actions   = ["acm:ListCertificates"],
      resources = ["*"]
    },
    {
      actions   = ["acm:DescribeCertificate", "acm:ListTagsForCertificate"],
      resources = [data.terraform_remote_state.staging.outputs.certificate_arn, data.terraform_remote_state.prod.outputs.certificate_arn]
    }
  ]
}
