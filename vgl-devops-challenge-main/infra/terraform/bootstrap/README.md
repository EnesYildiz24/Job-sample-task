# Terraform Backend Bootstrap (S3 + DynamoDB)

This stack creates remote-state infrastructure for the main stack in `infra/terraform`:

- S3 bucket for Terraform state
- DynamoDB table for state locking
- Optional IAM role for GitHub Actions OIDC

## Usage

```bash
cd infra/terraform/bootstrap
terraform init
terraform apply
```

To also create the GitHub Actions role:

```bash
terraform apply \
  -var="create_github_actions_role=true" \
  -var="github_repository=<owner>/<repo>" \
  -var="github_branch=main"
```

Optional overrides:

```bash
terraform apply \
  -var="aws_region=eu-central-1" \
  -var="project_name=vgl" \
  -var="environment=prod"
```

## Next step: initialize main stack with remote state

After apply, copy the output values into `terraform init` for the main stack:

```bash
cd ../
terraform init -reconfigure \
  -backend-config="bucket=<state-bucket-name>" \
  -backend-config="key=prod/terraform.tfstate" \
  -backend-config="region=eu-central-1" \
  -backend-config="dynamodb_table=<lock-table-name>" \
  -backend-config="encrypt=true"
```

## GitHub repository settings

After bootstrap apply, configure the GitHub repo:

- Secret:
  - `AWS_GITHUB_OIDC_ROLE_ARN` = output `github_actions_role_arn`
- Variables:
  - `AWS_REGION` (e.g. `eu-central-1`)
  - `ECR_FRONTEND_REPOSITORY` (e.g. `vgl-prod-frontend`)
  - `ECR_BACKEND_REPOSITORY` (e.g. `vgl-prod-backend`)
  - Optional for Terraform workflow remote state:
    - `TF_STATE_BUCKET`
    - `TF_STATE_KEY` (e.g. `prod/terraform.tfstate`)
    - `TF_STATE_LOCK_TABLE`
