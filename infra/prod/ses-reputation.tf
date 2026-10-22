data "aws_caller_identity" "current" {}

resource "aws_sns_topic" "ses_reputation" {
  name = "nafnaval-ses-reputation"
}

resource "aws_sns_topic_policy" "ses_reputation" {
  arn = aws_sns_topic.ses_reputation.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "OwnerAccess"
        Effect    = "Allow"
        Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
        Action = [
          "sns:GetTopicAttributes",
          "sns:SetTopicAttributes",
          "sns:AddPermission",
          "sns:RemovePermission",
          "sns:DeleteTopic",
          "sns:Subscribe",
          "sns:ListSubscriptionsByTopic",
          "sns:Publish",
        ]
        Resource = aws_sns_topic.ses_reputation.arn
      },
      {
        Sid       = "CloudWatchAlarms"
        Effect    = "Allow"
        Principal = { Service = "cloudwatch.amazonaws.com" }
        Action    = "sns:Publish"
        Resource  = aws_sns_topic.ses_reputation.arn
        Condition = {
          StringEquals = { "aws:SourceAccount" = data.aws_caller_identity.current.account_id }
          ArnLike      = { "aws:SourceArn" = "arn:aws:cloudwatch:eu-west-1:${data.aws_caller_identity.current.account_id}:alarm:nafnaval-ses-*" }
        }
      },
    ]
  })
}

resource "aws_sns_topic_subscription" "ses_reputation" {
  topic_arn = aws_sns_topic.ses_reputation.arn
  protocol  = "email"
  endpoint  = "sindrigudmundsson@gmail.com"
}

resource "aws_cloudwatch_metric_alarm" "ses_reputation" {
  for_each = {
    complaints = { metric = "Reputation.ComplaintRate", threshold = 0.0005 }
    bounces    = { metric = "Reputation.BounceRate", threshold = 0.03 }
  }

  alarm_name          = "nafnaval-ses-${each.key}"
  alarm_description   = "SES account-wide reputation in eu-west-1; investigate before AWS review thresholds are reached."
  namespace           = "AWS/SES"
  metric_name         = each.value.metric
  statistic           = "Maximum"
  period              = 300
  evaluation_periods  = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = each.value.threshold
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.ses_reputation.arn]
  ok_actions          = [aws_sns_topic.ses_reputation.arn]
}
