locals {
  default_github_actions_role_name = "${var.project_name}-${var.environment}-github-actions"
  github_actions_role_name         = var.github_actions_role_name != "" ? var.github_actions_role_name : local.default_github_actions_role_name

  default_github_oidc_provider_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
  github_oidc_provider_arn         = var.github_oidc_provider_arn != "" ? var.github_oidc_provider_arn : local.default_github_oidc_provider_arn
}

data "aws_iam_policy_document" "github_actions_assume_role" {
  count = var.create_github_actions_role ? 1 : 0

  statement {
    sid     = "GitHubActionsAssumeRole"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  count = var.create_github_actions_role ? 1 : 0

  name               = local.github_actions_role_name
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role[0].json
}

resource "aws_iam_role_policy_attachment" "github_actions_managed" {
  for_each = var.create_github_actions_role ? toset(var.github_actions_managed_policy_arns) : toset([])

  role       = aws_iam_role.github_actions[0].name
  policy_arn = each.value
}
