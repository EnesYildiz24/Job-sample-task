 # Monorepo Overview

 This repository contains a lightweight web application split into two apps that live side by side:

 - `packages/backend/` — PHP HTTP service (Swoole + Doctrine) exposing read-only endpoints.
 - `packages/frontend/` — Nuxt 4 (Vue 3) frontend consuming the backend API.

 The fictional scenario: an existing backend and a separate frontend have been brought together into a single repository. The objective is to run and deploy them in an AWS environment while keeping developer experience (DX) smooth for day-to-day work.

 ## Tech Stack
 - Backend: PHP 8.1+, Swoole HTTP server, Doctrine ORM/DBAL, SQLite (dev) / MySQL (prod).
 - Frontend: Nuxt 4, Vue 3, Vite, Tailwind CSS.

 ## Goals
 - Keep local development fast and simple for both apps.
 - Provide a clear path to build, test, and deploy each app independently.
 - Use AWS primitives that are familiar and maintainable over time.

 ## Repository Structure
 ```
 packages/
   backend/   # PHP service, Composer scripts, .env config
   frontend/  # Nuxt app, pnpm scripts, runtime config
 ```

 ## Local Development
 - Backend: see `packages/backend/README.md` for Composer scripts, `.env` setup, and endpoints.
 - Frontend: see `packages/frontend/README.md` for pnpm scripts and runtime configuration.

 Typical flow:
 1) Start backend API (defaults to `http://127.0.0.1:8080`).
 2) Start frontend dev server (defaults to `http://localhost:3000`).

 For detailed app instructions, refer to the READMEs in `packages/backend/` and `packages/frontend/`.

## Docker Compose (Reproducible Local Runtime)

You can also run the full stack in containers (frontend + backend + redis):

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Redis: internal service for backend response cache

Stop all services:

```bash
docker compose down
```

## AWS Deployment Baseline (Terraform + ECS Fargate)

The repository now includes AWS infrastructure code under `infra/terraform`:

- Networking: VPC, public/private subnets, IGW, NAT
- Compute: ECS Fargate services for frontend + backend
- Traffic: public ALB (frontend)
- Internal service-to-service DNS: AWS Cloud Map
- Data: RDS MySQL + ElastiCache Redis
- Registry: ECR repositories for frontend/backend
- Operations: CloudWatch logs + ECS autoscaling

Quick start:

```bash
cd infra/terraform/bootstrap
terraform init
terraform apply \
  -var="create_github_actions_role=true" \
  -var="github_repository=<owner>/<repo>" \
  -var="github_branch=main"

cd ../
cp terraform.tfvars.example terraform.tfvars
cp backend.hcl.example backend.hcl
# set bucket/table from bootstrap outputs
terraform init -reconfigure -backend-config=backend.hcl
terraform plan
terraform apply
```

See detailed notes in:

- `infra/terraform/README.md`
- `infra/ansible/README.md`

## CI/CD Workflows (GitHub Actions)

The repository includes:

- `.github/workflows/ci.yml`: backend + frontend tests
- `.github/workflows/aws-image-publish.yml`: manual image build/push to ECR (OIDC)
- `.github/workflows/aws-terraform.yml`: manual Terraform plan/apply (OIDC)

Required repository secrets/variables:

- Secret: `AWS_GITHUB_OIDC_ROLE_ARN`
- Variables: `AWS_REGION`, `ECR_FRONTEND_REPOSITORY`, `ECR_BACKEND_REPOSITORY`
- Optional for remote Terraform state in workflow: `TF_STATE_BUCKET`, `TF_STATE_KEY`, `TF_STATE_LOCK_TABLE`

Detailed setup:

- `infra/terraform/bootstrap/README.md`
- `infra/aws/SETUP.md`
