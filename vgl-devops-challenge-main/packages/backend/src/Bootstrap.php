<?php

declare(strict_types=1);

namespace App;

use Dotenv\Dotenv;
use RuntimeException;

class Bootstrap
{
    /** @var array<string, string> */
    private array $config;

    public function __construct(string $projectRoot)
    {
        // Load .env (non-fatal if missing, use defaults)
        if (is_file($projectRoot . '/.env')) {
            $dotenv = Dotenv::createImmutable($projectRoot);
            $dotenv->safeLoad();
        }

        $this->config = [
            'DB_DRIVER' => getenv('DB_DRIVER') ?: 'sqlite',
            'DB_PATH'   => getenv('DB_PATH') ?: $projectRoot . 'data/dev.db',
            'DB_HOST'   => getenv('DB_HOST') ?: '127.0.0.1',
            'DB_PORT'   => getenv('DB_PORT') ?: '3306',
            'DB_NAME'   => getenv('DB_NAME') ?: 'app',
            'DB_USER'   => getenv('DB_USER') ?: 'app',
            'DB_PASS'   => getenv('DB_PASS') ?: 'app',
            'REDIS_CACHE_ENABLED' => getenv('REDIS_CACHE_ENABLED') ?: '0',
            'REDIS_HOST' => getenv('REDIS_HOST') ?: '127.0.0.1',
            'REDIS_PORT' => getenv('REDIS_PORT') ?: '6379',
            'REDIS_PASSWORD' => getenv('REDIS_PASSWORD') ?: '',
            'REDIS_DB' => getenv('REDIS_DB') ?: '0',
            'REDIS_TIMEOUT' => getenv('REDIS_TIMEOUT') ?: '0.05',
            'HTTP_HOST' => getenv('HTTP_HOST') ?: '0.0.0.0',
            'HTTP_PORT' => getenv('HTTP_PORT') ?: '8080',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function getConfig(): array
    {
        return $this->config;
    }

    // Doctrine-only bootstrap: PDO removed; config remains for Doctrine DBAL
}
