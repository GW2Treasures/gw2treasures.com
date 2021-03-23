FROM php:7.2-apache

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apt-get update && apt-get install -y \
    zip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libmcrypt-dev \
    wget \
  && docker-php-ext-configure gd --with-freetype-dir --with-jpeg-dir \
  && docker-php-ext-install -j$(nproc) gd pcntl pdo pdo_mysql \
  && pecl install mcrypt \
  && docker-php-ext-enable mcrypt \
  && a2enmod rewrite headers \
  && rm -rf /var/lib/apt/lists/*

# set workdir
WORKDIR /var/gw2treasures

# composer
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-progress --no-autoloader

# entrypoint
COPY docker/entrypoint.sh /entrypoint.sh

# apache config
COPY docker/site.conf /etc/apache2/sites-available/gw2treasures.conf
RUN a2dissite 000-default && a2ensite gw2treasures

# sources
COPY app app
COPY bootstrap bootstrap
COPY public public
COPY artisan artisan
COPY docker/cron.sh cron.sh
COPY docker/config app/config

RUN chmod +x /entrypoint.sh \
  && ln -sfT /dev/stdout app/storage/logs/laravel.log \
  && chown www-data:www-data app/storage/views \
  && mkdir -p app/storage/cache app/storage/sessions \
  && chown www-data:www-data app/storage/cache app/storage/sessions/ \
  && chmod +x cron.sh \
  && composer dump-autoload

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "apache2-foreground" ]