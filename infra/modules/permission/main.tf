variable "name" {
  type = string
}

variable "statements" {
  type = list(object({
    actions   = list(string)
    resources = list(string)
  }))
}

variable "user" {}

data "aws_iam_policy_document" "policy" {
  dynamic "statement" {
    for_each = var.statements
    content {
      actions   = statement.value.actions
      resources = statement.value.resources
    }
  }
}

resource "aws_iam_policy" "policy" {
  name   = "nafnaval-${var.name}"
  policy = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_user_policy_attachment" "attachment" {
  user       = var.user
  policy_arn = aws_iam_policy.policy.arn
}
