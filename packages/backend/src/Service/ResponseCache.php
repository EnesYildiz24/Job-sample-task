<?php

declare(strict_types=1);

namespace App\Service;

/**
 * Naive response cache backed by Redis (if available).
 */
class ResponseCache
{
    private bool $enabled = false;
    /** @var \Redis|null */
    private $redis = null;

    /**
     * @param array<string, mixed> $config
     */
    public function __construct(array $config = [])
    {
        $enabledRaw = strtolower((string)($config['REDIS_CACHE_ENABLED'] ?? '0'));
        $enabled = in_array($enabledRaw, ['1', 'true', 'yes', 'on'], true);
        if (!$enabled) {
            return;
        }

        $host = (string)($config['REDIS_HOST'] ?? '127.0.0.1');
        $port = (int)($config['REDIS_PORT'] ?? 6379);
        $timeout = (float)($config['REDIS_TIMEOUT'] ?? 0.05);
        $password = (string)($config['REDIS_PASSWORD'] ?? '');
        $db = (int)($config['REDIS_DB'] ?? 0);

        try {
            $r = new \Redis();
            $r->connect($host, $port, $timeout);
            if ($password !== '') {
                $r->auth($password);
            }
            if ($db > 0) {
                $r->select($db);
            }
            $this->redis = $r;
            $this->enabled = true;
        } catch (\Throwable $__) {
            $this->enabled = false;
            $this->redis = null;
        }
    }

    public function isEnabled(): bool
    {
        return $this->enabled && $this->redis !== null;
    }

    /**
     * Testing hook: inject a Redis-like client (must implement get() and setex()).
     * Enables the cache when a client is provided.
     */
    public function setClient(object $client): void
    {
        $this->redis = $client;
        $this->enabled = true;
    }

    /**
     * Get a raw cached payload, or null on miss/error/disabled.
     */
    public function get(string $key): ?string
    {
        if (!$this->isEnabled()) {
            return null;
        }
        try {
            $val = $this->redis->get($key);
            if ($val === false) {
                return null;
            }
            return is_string($val) ? $val : null;
        } catch (\Throwable $__) {
            return null;
        }
    }

    /**
     * Optional setter (not used by server). Ignored on failure.
     */
    public function set(string $key, string $value, int $ttlSeconds = 60): void
    {
        if (!$this->isEnabled()) {
            return;
        }
        try {
            $this->redis->setex($key, $ttlSeconds, $value);
        } catch (\Throwable $__) {
            // ignore
        }
    }
}
