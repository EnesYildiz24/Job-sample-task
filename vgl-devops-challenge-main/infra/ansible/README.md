# Ansible Utilities

This folder contains operational playbooks that complement Terraform-based provisioning.

## Smoke test playbook

`playbooks/smoke_check.yml` validates frontend + backend health endpoints.

Run:

```bash
ansible-playbook infra/ansible/playbooks/smoke_check.yml
```

Override URLs (for AWS ALB, for example):

```bash
ansible-playbook infra/ansible/playbooks/smoke_check.yml \
  -e frontend_url=http://<alb-dns-name> \
  -e backend_health_url=http://<alb-dns-name>/health
```
