FROM php:8.4-cli-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    pkg-config \
    libssl-dev \
    libpcre2-dev \
    libsqlite3-dev \
    zlib1g-dev \
    && docker-php-ext-install sockets pdo pdo_mysql pdo_sqlite \
    && pecl install redis \
    && pecl install --configureoptions 'enable-sockets="yes" enable-openssl="yes" enable-mysqlnd="no" enable-swoole-curl="no" enable-cares="no" enable-brotli="no" enable-zstd="no" enable-swoole-pgsql="no" with-swoole-odbc="no" with-swoole-oracle="no" enable-swoole-sqlite="no" enable-swoole-thread="no" enable-iouring="no"' swoole \
    && docker-php-ext-enable redis swoole \
    && rm -rf /tmp/pear /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader

COPY . .

EXPOSE 8080

CMD ["php", "bin/server.php"]
