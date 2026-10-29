# API Laravel — image de démonstration (serveur intégré PHP, suffisant pour un prototype)
FROM php:8.4-cli-alpine

# Extension PostgreSQL : dépendances de build temporaires, libpq conservée à l'exécution
RUN apk add --no-cache libpq unzip \
    && apk add --no-cache --virtual .build-deps postgresql-dev $PHPIZE_DEPS \
    && docker-php-ext-install pdo_pgsql \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Dépendances d'abord (cache Docker), code ensuite
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --no-progress

COPY . .
RUN composer dump-autoload --optimize --no-dev \
    && chmod -R a+rw storage bootstrap/cache

EXPOSE 8000

# Migrations à chaque démarrage, jeu de données uniquement si la base est vide
CMD ["sh", "-c", "php artisan migrate --force && php artisan app:seed-if-empty && php artisan serve --host=0.0.0.0 --port=8000"]
