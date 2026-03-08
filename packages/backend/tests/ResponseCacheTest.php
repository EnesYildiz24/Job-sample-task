<?php

declare(strict_types=1);

namespace Tests;

use App\Service\ResponseCache;
use PHPUnit\Framework\TestCase;

final class ResponseCacheTest extends TestCase
{
    public function testGetReturnsNullWhenDisabled(): void
    {
        $cache = new ResponseCache(['REDIS_CACHE_ENABLED' => '0']);
        $this->assertNull($cache->get('resp:/health'));
    }

    public function testGetReturnsCachedValueWhenClientInjected(): void
    {
        $cache = new ResponseCache();
        $fake = new class {
            /** @var array<string, string> */
            private array $store = ['resp:/foo' => '{"ok":true}'];

            public function get(string $key): string|false
            {
                return $this->store[$key] ?? false;
            }

            public function setex(string $key, int $ttl, string $value): bool
            {
                $this->store[$key] = $value;
                return true;
            }
        };
        $cache->setClient($fake);
        $this->assertTrue($cache->isEnabled());
        $this->assertSame('{"ok":true}', $cache->get('resp:/foo'));
        // Miss returns null
        $this->assertNull($cache->get('resp:/bar'));
    }
}
