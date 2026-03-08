# AWS Setup Checklist

## 1) Bootstrap once

```bash
cd infra/terraform/bootstrap
terraform init
terraform apply \
  -var="create_github_actions_role=true" \
  -var="github_repository=<owner>/<repo>" \
  -var="github_branch=main"
```

Capture outputs:

- `state_bucket_name`
- `lock_table_name`
- `github_actions_role_arn`

## 2) Configure GitHub repository settings

Set repository **Secret**:

- `AWS_GITHUB_OIDC_ROLE_ARN` = `<github_actions_role_arn>`

Set repository **Variables**:

- `AWS_REGION` (e.g. `eu-central-1`)
- `ECR_FRONTEND_REPOSITORY` (e.g. `vgl-prod-frontend`)
- `ECR_BACKEND_REPOSITORY` (e.g. `vgl-prod-backend`)
- `TF_STATE_BUCKET` = `<state_bucket_name>`
- `TF_STATE_KEY` = `prod/terraform.tfstate`
- `TF_STATE_LOCK_TABLE` = `<lock_table_name>`

## 3) Initialize main infra with remote state

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
cp backend.hcl.example backend.hcl
# edit backend.hcl with output values
terraform init -reconfigure -backend-config=backend.hcl
terraform plan
terraform apply
```

## 4) Build/push images and deploy

1. Run workflow `aws-image-publish` (choose `image_tag`).
2. Run workflow `aws-terraform` with matching `frontend_image_tag` + `backend_image_tag`.
3. Optional: set `apply=true` in `aws-terraform` for direct apply.

## 5) Smoke test

- Frontend via ALB URL (`terraform output alb_dns_name`)
- Backend health via frontend route or internal checks
