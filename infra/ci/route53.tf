module "route53-permissions" {
  source = "../modules/permission"
  name   = "route53-staging"
  user   = aws_iam_user.nafnaval-staging.name
  statements = [
    {
      actions = [
        "route53:ListHostedZones",
        "route53:GetHostedZone",
        "route53:ListTagsForResource",
        "route53:ListResourceRecordSets"
      ]
      resources = ["*"]
    },
  ]
}
