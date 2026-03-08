# AWS Terraform (ECS Fargate)

This Terraform stack deploys the monorepo as managed AWS services:

- VPC with public + private subnets
- Application Load Balancer (public) for the frontend
- ECS Fargate services:
  - `frontend` (public via ALB)
  - `backend` (private, reachable via Cloud Map service discovery)
- ECR repositories for frontend/backend images
- RDS MySQL (for backend)
- ElastiCache Redis (response cache)
- CloudWatch log groups
- ECS service autoscaling (CPU target tracking)

## Architecture

- Internet traffic -> ALB -> frontend ECS service
- Frontend service calls backend service over private DNS (`backend.<namespace>.internal`)
- Backend service connects to RDS + ElastiCache in private subnets

## Prerequisites

- Terraform `>= 1.6`
- AWS credentials with permissions for VPC/ECS/ALB/ECR/RDS/ElastiCache/IAM/Logs/Secrets Manager
- Docker images pushed to ECR (tags provided via tfvars)

## Remote state bootstrap (recommended)

Before using this stack in a team setup, create a shared backend (S3 + DynamoDB lock table):

```bash
cd infra/terraform/bootstrap
terraform init
terraform apply
```

Then initialize the main stack with remote backend config:

```bash
cd ../
cp backend.hcl.example backend.hcl
# edit backend.hcl with bucket/table names from bootstrap outputs
terraform init -reconfigure -backend-config=backend.hcl
```

## Usage

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init # if remote backend is already configured
terraform plan
terraform apply
```

After apply, use outputs:

```bash
terraform output alb_dns_name
terraform output frontend_ecr_repository_url
terraform output backend_ecr_repository_url
```

## Image rollout flow

1. Build + push images to ECR.
2. Update `frontend_image_tag` and `backend_image_tag` in `terraform.tfvars`.
3. Run `terraform apply`.

## FinOps defaults in this stack

- Graviton-friendly instance classes by default (`t4g` families)
- Single NAT gateway (lower cost baseline)
- Small starter database/cache tiers (`db.t4g.micro`, `cache.t4g.micro`)
- ECR lifecycle policy to retain only recent images
- CloudWatch retention set to 14 days by default

## Notes

- This is intentionally a lean production baseline.
- For strict HA and larger traffic, raise task counts, use Multi-AZ DB setup, and add canary/blue-green deployment strategy.
