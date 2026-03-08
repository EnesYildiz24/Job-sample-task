variable "project_name" {
  description = "Project/application identifier used in resource names"
  type        = string
  default     = "vgl"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "state_bucket_name" {
  description = "Optional explicit S3 bucket name for Terraform state. Leave empty to auto-generate."
  type        = string
  default     = ""
}

variable "lock_table_name" {
  description = "DynamoDB table name used for state locking"
  type        = string
  default     = ""
}

variable "create_github_actions_role" {
  description = "Whether to create an IAM role for GitHub Actions OIDC"
  type        = bool
  default     = false
}

variable "github_repository" {
  description = "GitHub repository in owner/name format (e.g. org/repo)"
  type        = string
  default     = ""

  validation {
    condition     = var.create_github_actions_role == false || var.github_repository != ""
    error_message = "github_repository must be set when create_github_actions_role=true."
  }
}

variable "github_branch" {
  description = "Git branch allowed to assume the GitHub Actions role"
  type        = string
  default     = "main"
}

variable "github_actions_role_name" {
  description = "Optional explicit IAM role name for GitHub Actions"
  type        = string
  default     = ""
}

variable "github_oidc_provider_arn" {
  description = "Optional pre-existing GitHub OIDC provider ARN. Leave empty to use account-local default ARN pattern."
  type        = string
  default     = ""
}

variable "github_actions_managed_policy_arns" {
  description = "Managed IAM policies to attach to the GitHub Actions role"
  type        = list(string)
  default     = ["arn:aws:iam::aws:policy/AdministratorAccess"]
}
