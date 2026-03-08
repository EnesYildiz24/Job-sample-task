## Baseline-Check (Startphase abgeschlossen)

Ich habe zuerst die lokale Umgebung lauffähig gemacht und danach Backend und Frontend einmal komplett gestartet und geprüft.

Auf dem Mac waren anfangs `php` und `composer` nicht installiert. Das habe ich über Homebrew nachgezogen.  
Danach kam das nächste Thema: Swoole läuft nicht mit PHP 8.5.x. Deshalb habe ich auf PHP 8.4 gewechselt und Swoole für PHP 8.4 über `pecl` gebaut und installiert.

Anschließend habe ich im Backend diese Checks ausgeführt:
- `composer install`
- `composer test`
- `composer lint`
- `composer stan`
- `composer start`

Backend-Ergebnis:
- Tests laufen (`7` Tests, `3` Deprecation-Hinweise).
- Lint läuft grün nach Test-/Namespace- und Strukturfixes.
- PHPStan läuft grün nach Typisierungs- und Generic-Fixes.
- Runtime funktioniert: `curl -i http://127.0.0.1:8080/health` und `curl -i http://127.0.0.1:8080/artists` liefern `200 OK`.

Danach habe ich Frontend-Setup und Checks gemacht:
- `pnpm` installiert (`10.12.3`)
- `pnpm install`
- `pnpm test`
- `pnpm lint`
- `pnpm dev`

Frontend-Ergebnis:
- Tests laufen (`7/7` grün).
- Lint läuft grün nach TS-/ESLint-Config- und Import/Style-Fixes.
- Runtime funktioniert: `curl -I http://localhost:3000` liefert `HTTP/1.1 200 OK`.

## Erster Config/Security-Fix im Frontend

Als nächsten Schritt habe ich die hardcoded Backend-IP im Frontend entfernt und auf konfigurierbare Runtime-Variablen umgestellt.

Umgesetzt in:
- `packages/frontend/server/utils/backend.ts`
- `packages/frontend/nuxt.config.ts`
- `packages/frontend/.env.example`

Was konkret geändert wurde:
- In `server/utils/backend.ts` wird die Base-URL jetzt nicht mehr fest im Code gesetzt, sondern aus `runtimeConfig.public` gelesen.
- In `nuxt.config.ts` sind die benötigten Public-Runtime-Werte hinterlegt:
  - `NUXT_PUBLIC_API_ENVIRONMENT`
  - `NUXT_PUBLIC_API_BASE_URL_DEV`
  - `NUXT_PUBLIC_API_BASE_URL_PROD`
- In `.env.example` sind diese Variablen dokumentiert und mit sicheren lokalen Defaults vorbelegt.

Zusätzlich habe ich in den beiden Proxy-Utilities den Rückgabetyp von `$fetch` explizit gecastet (`as unknown as T`), damit der TypeScript-Fehler `TS2322` in der IDE verschwindet.

## Backend ResponseCache auf Env umgestellt

Ich habe den Redis-Response-Cache im Backend von hardcoded Verbindungsdaten auf Konfiguration umgestellt.

Umgesetzt in:
- `packages/backend/src/Service/ResponseCache.php`
- `packages/backend/src/Bootstrap.php`
- `packages/backend/bin/server.php`
- `packages/backend/.env.example`

Was konkret geändert wurde:
- `ResponseCache` liest jetzt Redis-Einstellungen aus dem Config-Array (`REDIS_*`) statt mit fester IP/Passwort zu verbinden.
- Cache kann jetzt gezielt über `REDIS_CACHE_ENABLED` ein- oder ausgeschaltet werden.
- `server.php` gibt die Bootstrap-Konfiguration an `ResponseCache` weiter.
- `.env.example` dokumentiert die neuen Redis-Variablen (`REDIS_CACHE_ENABLED`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `REDIS_TIMEOUT`).
- Zusätzlich wurde `packages/backend/.env.example` bei MySQL auf neutrale Platzhalter bereinigt (`DB_HOST=127.0.0.1`, `DB_PASS=change-me`).

Verifikation:
- `vendor/bin/phpunit tests/ResponseCacheTest.php` läuft grün (`2` Tests).

## Reproduzierbares Local Runtime mit Docker Compose

Ich habe als nächsten Schritt Container-Artefakte ergänzt, damit Frontend und Backend reproduzierbar ohne lokale Toolchain laufen können.

Umgesetzt in:
- `docker-compose.yml`
- `packages/backend/Dockerfile`
- `packages/backend/.dockerignore`
- `packages/frontend/Dockerfile`
- `packages/frontend/.dockerignore`
- `README.md` (Root, neuer Docker-Abschnitt)

Was konkret geändert wurde:
- Docker Compose startet jetzt drei Services: `frontend`, `backend`, `redis`.
- Backend-Container baut PHP 8.4 + Swoole und startet `bin/server.php`.
- Frontend-Container baut Nuxt und startet den Nitro-Server über `.output/server/index.mjs`.
- Compose verbindet Frontend intern mit Backend (`http://backend:8080`) und Backend optional mit Redis für den Response-Cache.
- Der Backend-Build wurde stabilisiert: `sockets` wird explizit mitgebaut und Swoole wird im Dockerfile mit festen `--configureoptions` nicht-interaktiv installiert.
- Root-README enthält einen klaren Start/Stop-Flow mit `docker compose up --build` und `docker compose down`.

Verifikation:
- `docker compose config` läuft erfolgreich (Compose-Datei ist syntaktisch/strukturell gültig).
- Vollständiger Lauf funktioniert: `docker compose down` und danach `docker compose up --build -d` starten alle Services erfolgreich.
- `docker compose ps` zeigt `backend` und `frontend` auf `Up` sowie `redis` auf `healthy`.
- Backend-Runtime geprüft: `curl -i http://localhost:8080/health` und `curl -i http://localhost:8080/artists` liefern `200 OK`.
- Frontend-Runtime geprüft: `curl -I http://localhost:3000` liefert `HTTP/1.1 200 OK`.

## AWS-Deployment-Baseline (Terraform, CI/CD, Ansible)

Damit das Setup „deployment-ready“ für AWS wird, habe ich als nächsten Block die Infra-/Delivery-Baseline ergänzt.

Umgesetzt in:
- `infra/terraform/*`
- `infra/terraform/bootstrap/*`
- `infra/terraform/backend.hcl.example`
- `infra/ansible/playbooks/smoke_check.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/aws-image-publish.yml`
- `.github/workflows/aws-terraform.yml`
- `README.md` (Root, AWS-Abschnitte)

Was konkret geändert wurde:
- Terraform-Baseline für AWS aufgebaut:
  - VPC mit Public-/Private-Subnetzen, Internet Gateway, NAT Gateway.
  - ECS Fargate Cluster mit zwei Services (`frontend`, `backend`).
  - Public ALB für Frontend-Traffic.
  - Private Service Discovery (Cloud Map) für Frontend -> Backend.
  - RDS MySQL + ElastiCache Redis + Security Groups.
  - ECR-Repositories inklusive Lifecycle-Policies.
  - CloudWatch Log Groups und ECS CPU-Autoscaling.
- Zusätzlich separaten Terraform-Bootstrap für Remote State aufgebaut:
  - S3-Bucket für State.
  - DynamoDB-Lock-Tabelle für State-Locking.
  - `backend.hcl.example` für reproduzierbares `terraform init -backend-config`.
- Ansible-Smoke-Playbook ergänzt, um Frontend-/Backend-Healthchecks nach Deployment schnell zu prüfen.
- GitHub Actions ergänzt:
  - CI-Testworkflow für Backend + Frontend.
  - Manueller Workflow für Image-Build + Push nach ECR (OIDC).
  - Manueller Workflow für Terraform Plan/Apply (OIDC), inkl. optionalem Remote-State-Init über `TF_STATE_*` Variablen.
- AWS-Setup weiter operationalisiert:
  - Bootstrap kann jetzt optional eine GitHub Actions OIDC-Rolle erzeugen (`create_github_actions_role=true`).
  - Zusätzliche Setup-Checkliste dokumentiert (`infra/aws/SETUP.md`).
  - Workflows prüfen fehlende Secrets/Variablen früh und brechen mit klarer Fehlermeldung ab.
- Root-README erweitert um lokale Container-Nutzung und AWS-Infrastruktur-Quickstart.
- Backend-Dockerfile für AWS/Redis vervollständigt:
  - `redis` PECL-Extension wird mitinstalliert und aktiviert.
  - `sockets` wird explizit gebaut, damit Swoole-Build stabil läuft.

Verifikation:
- Terraform lokal per Container validiert:
  - `terraform fmt -recursive`
  - `terraform init -backend=false`
  - `terraform validate`
- Terraform-Bootstrap-Stack (`infra/terraform/bootstrap`) ebenfalls mit `fmt`, `init -backend=false` und `validate` geprüft.
- Backend-Container neu gebaut: `docker compose build backend` läuft erfolgreich (inkl. `redis` + `swoole`).

## Externer Blocker (AWS Zugriff)

- Im verfügbaren Zeitfenster gab es keinen nutzbaren AWS-Account bzw. keine gültigen AWS-Credentials.
- Dadurch konnten nur die IaC-Definitionen und Workflows vorbereitet/validiert werden, aber kein echter `terraform apply` gegen AWS ausgeführt werden.
- Nicht verifiziert in einer realen AWS-Umgebung:
  - Erstellung der Ressourcen in AWS (VPC/ECS/RDS/ElastiCache/ECR/ALB).
  - GitHub OIDC Role in einem Zielkonto.
  - End-to-End Deploy über GitHub Actions.
- Ready-to-run Handover ist vorhanden:
  - `infra/aws/SETUP.md`
  - `infra/terraform/bootstrap/README.md`
  - `infra/terraform/README.md`

## Annahmen

- AWS-Zielplattform ist containerbasiert auf ECS Fargate (kein EKS/EC2-Cluster nötig für die erste belastbare Version).
- Ein einzelnes AWS-Environment (`prod`) reicht für die Baseline; Staging/Dev in AWS folgt als nächster Ausbau.
- Secrets werden über AWS Secrets Manager verwaltet und per Task Definition injiziert.
- Der Fokus liegt auf einer kostenbewussten, robusten Startarchitektur, nicht auf maximaler Multi-Region-HA.

## Nächste sinnvolle Schritte (chronologisch)

0. AWS-Konto bzw. AWS-Zugang (IAM/SSO) bereitstellen, damit `terraform apply` und ein echter End-to-End-Deploy überhaupt möglich sind.
1. Remote-State-Bootstrap im Zielkonto ausrollen und bestehende lokale State-Datei sauber in den S3-Backend-State migrieren.
2. GitHub Environments mit Freigabeprozess aufsetzen (z. B. `staging`, `production`) und Workflow-Inputs absichern.
3. Staging-Umgebung in AWS hinzufügen und den gesamten Pipeline-Flow dort einmal End-to-End testen.
4. HTTPS/TLS einbauen (ACM + ALB Listener 443), optional Route53-Domain und Redirect von 80 -> 443.
5. ECS-Rollout-Strategie verbessern (Health-gated Deployment, optional Blue/Green via CodeDeploy).

## Risiken, Skalierung und FinOps-Hinweise

- NAT-Kosten: Ein NAT-Gateway ist bereits die günstigere Basis; bei sehr hohem Egress lohnt detaillierte Kostenanalyse (z. B. Endpoints/Traffic-Optimierung).
- Datenbank ist aktuell Single-AZ (`multi_az=false`): günstiger, aber geringere Ausfallsicherheit.
- Redis läuft aktuell ohne Replikat/Multi-AZ: kosteneffizient, aber begrenzte High Availability.
- CloudWatch-Retention ist auf 14 Tage gesetzt; längere Retention nur dort aktivieren, wo betrieblich erforderlich.
- ECR-Lifecycle-Policies begrenzen alte Images und reduzieren laufende Storage-Kosten.

## Transparenz-Hinweis

Kleiner Transparenz-Hinweis: Ich habe bei Teilen der Umsetzung Codex als Unterstützung genutzt, vor allem bei einigen PHP-Details und etwas beim Terraforming.
