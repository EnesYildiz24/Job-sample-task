<?php

declare(strict_types=1);

namespace Swoole\Http;

if (!class_exists(Response::class)) {
    class Response
    {
        public int $statusCode = 200;
        /** @var array<string, string> */
        public array $headers = [];
        public string $body = '';

        public function status(int $code): void
        {
            $this->statusCode = $code;
        }

        public function header(string $name, string $value): void
        {
            $this->headers[$name] = $value;
        }

        public function end(string $content = ''): void
        {
            $this->body = $content;
        }
    }
}
