resource "random_password" "db" {
  length  = 24
  special = true
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db"
  subnet_ids = aws_subnet.private_data[*].id
}

resource "aws_db_instance" "main" {
  identifier                 = "${local.name_prefix}-mysql"
  engine                     = "mysql"
  engine_version             = "8.0"
  instance_class             = var.db_instance_class
  allocated_storage          = var.db_allocated_storage
  max_allocated_storage      = var.db_max_allocated_storage
  db_name                    = var.db_name
  username                   = var.db_username
  password                   = random_password.db.result
  multi_az                   = false
  storage_encrypted          = true
  backup_retention_period    = var.db_backup_retention_days
  skip_final_snapshot        = true
  deletion_protection        = false
  auto_minor_version_upgrade = true
  publicly_accessible        = false

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.database.id]
}

resource "aws_secretsmanager_secret" "db" {
  name        = "${local.name_prefix}/database"
  description = "Database credentials for ${local.name_prefix}"
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db.result
    host     = aws_db_instance.main.address
    port     = tostring(aws_db_instance.main.port)
    dbname   = var.db_name
  })
}
