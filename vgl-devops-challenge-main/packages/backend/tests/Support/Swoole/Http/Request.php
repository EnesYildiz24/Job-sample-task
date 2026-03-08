<?php

declare(strict_types=1);

namespace Swoole\Http;

if (!class_exists(Request::class)) {
    class Request
    {
        /** @var array<string, mixed> */
        public array $server = [];

        /**
         * @param array<string, mixed> $server
         */
        public function __construct(array $server = [])
        {
            $this->server = $server;
        }
    }
}
