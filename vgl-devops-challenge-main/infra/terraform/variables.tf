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

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.42.0.0/16"
}

variable "frontend_desired_count" {
  description = "Desired number of frontend tasks"
  type        = number
  default     = 2
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 2
}

variable "frontend_container_port" {
  description = "Frontend container port"
  type        = number
  default     = 3000
}

variable "backend_container_port" {
  description = "Backend container port"
  type        = number
  default     = 8080
}

variable "frontend_cpu" {
  description = "Frontend task CPU units"
  type        = number
  default     = 512
}

variable "frontend_memory" {
  description = "Frontend task memory in MiB"
  type        = number
  default     = 1024
}

variable "backend_cpu" {
  description = "Backend task CPU units"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Backend task memory in MiB"
  type        = number
  default     = 1024
}

variable "frontend_image_tag" {
  description = "Tag of frontend image in ECR"
  type        = string
  default     = "latest"
}

variable "backend_image_tag" {
  description = "Tag of backend image in ECR"
  type        = string
  default     = "latest"
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "app"
}

variable "db_username" {
  description = "MySQL username"
  type        = string
  default     = "app"
}

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max autoscaled storage in GB"
  type        = number
  default     = 100
}

variable "db_backup_retention_days" {
  description = "RDS backup retention days"
  type        = number
  default     = 7
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t4g.micro"
}

variable "log_retention_days" {
  description = "CloudWatch log retention"
  type        = number
  default     = 14
}

variable "frontend_min_capacity" {
  description = "Minimum frontend tasks for autoscaling"
  type        = number
  default     = 2
}

variable "frontend_max_capacity" {
  description = "Maximum frontend tasks for autoscaling"
  type        = number
  default     = 10
}

variable "backend_min_capacity" {
  description = "Minimum backend tasks for autoscaling"
  type        = number
  default     = 2
}

variable "backend_max_capacity" {
  description = "Maximum backend tasks for autoscaling"
  type        = number
  default     = 20
}

variable "autoscaling_target_cpu_percent" {
  description = "CPU target tracking threshold for ECS services"
  type        = number
  default     = 60
}
