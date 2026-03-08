resource "aws_elasticache_subnet_group" "main" {
  name       = "${local.name_prefix}-redis"
  subnet_ids = aws_subnet.private_data[*].id
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = replace("${local.name_prefix}-redis", "_", "-")
  description                = "Redis cache for ${local.name_prefix}"
  engine                     = "redis"
  engine_version             = "7.1"
  node_type                  = var.redis_node_type
  port                       = 6379
  num_cache_clusters         = 1
  automatic_failover_enabled = false
  multi_az_enabled           = false
  parameter_group_name       = "default.redis7"
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
}
