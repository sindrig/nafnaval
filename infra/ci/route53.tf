module "route53-permissions" {
  source = "../modules/permission"
  name   = "route53"
  user   = aws_iam_user.nafnaval.name
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
