module "certs-permissions" {
  source = "../modules/permission"
  name   = "certs-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions   = ["acm:ListCertificates"],
      resources = ["*"]
    },
    {
      actions   = ["acm:DescribeCertificate", "acm:ListTagsForCertificate"],
      resources = [data.terraform_remote_state.staging.outputs.certificate_arn]
    }
  ]
}
