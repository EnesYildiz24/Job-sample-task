output "state_bucket_name" {
  description = "S3 bucket name used for Terraform remote state"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "lock_table_name" {
  description = "DynamoDB lock table name used for Terraform state locking"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "backend_init_example" {
  description = "Example terraform init command for infra/terraform with remote backend"
  value       = "terraform init -reconfigure -backend-config=\"bucket=${aws_s3_bucket.terraform_state.bucket}\" -backend-config=\"key=${var.environment}/terraform.tfstate\" -backend-config=\"region=${var.aws_region}\" -backend-config=\"dynamodb_table=${aws_dynamodb_table.terraform_locks.name}\" -backend-config=\"encrypt=true\""
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC (null if not created)"
  value       = try(aws_iam_role.github_actions[0].arn, null)
}

output "github_actions_secret_name" {
  description = "GitHub repository secret name expected by workflows"
  value       = "AWS_GITHUB_OIDC_ROLE_ARN"
}
