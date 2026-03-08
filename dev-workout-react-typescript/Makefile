.PHONY: help install dev build preview ci-frontend ci-backend docker-build docker-up docker-down docker-frontend-build docker-backend-build backend-dev backend-build backend-clean

help:
	@echo "Targets:"
	@echo "  install        Install frontend dependencies"
	@echo "  dev            Start frontend dev server"
	@echo "  build          Build frontend for production"
	@echo "  preview        Preview production build"
	@echo "  ci-frontend    Run frontend CI steps (npm ci + build)"
	@echo "  ci-backend     Run backend CI steps (gradle build)"
	@echo "  docker-build   Build frontend+backend images via Docker Compose"
	@echo "  docker-up      Build and run frontend+backend via Docker Compose"
	@echo "  docker-down    Stop Docker Compose services"
	@echo "  docker-frontend-build  Build frontend Docker image"
	@echo "  docker-backend-build   Build backend Docker image"
	@echo "  backend-dev    Start backend locally"
	@echo "  backend-build  Build backend"
	@echo "  backend-clean  Clean backend build"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

ci-frontend:
	npm ci
	npm run build

ci-backend:
	cd ../dev-workout-backend-kotlin && ./gradlew build

docker-build:
	docker compose build

docker-up:
	docker compose up --build

docker-down:
	docker compose down

docker-frontend-build:
	docker build -t dev-workout-frontend .

docker-backend-build:
	cd ../dev-workout-backend-kotlin && docker build -t dev-workout-backend .

backend-dev:
	cd ../dev-workout-backend-kotlin && ./gradlew bootRun

backend-build:
	cd ../dev-workout-backend-kotlin && ./gradlew build

backend-clean:
	cd ../dev-workout-backend-kotlin && ./gradlew clean
