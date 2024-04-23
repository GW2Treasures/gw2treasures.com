# [![gw2treasures.com](.github/readme.png)](https://gw2treasures.com)

**[gw2treasures.com](https://gw2treasures.com)** is a Guild Wars 2 database powered by the official API.

You can create a new issue to report a bug or request a new feature.

## Contributing

Pull requests are always welcome ❤️.

It's best to to open an issue first to discuss the changes you want to make. You can also always ask on [discord](https://discord.gg/gvx6ZSE) if you have any questions.

### Setup

These are the steps that are required to work on any of the gw2treasures.com components.

1. Install dependencies by running `npm i` in the root directory. This will install dependencies for all apps and packages.
2. Start the database in docker using `docker compose up -d database`.
3. (Optional) To get data into the database, it is best to run workers with `docker compose up -d worker` in the background.

### Web

The website uses nextjs and the code is found in [apps/web](apps/web/).

1. Run `npm run dev:web`
2. Visit http://gw2treasures.localhost:3000/
3. Make your changes

### Worker

The workers powering all background tasks of gw2treasures.com are located in [apps/worker](apps/worker/). If you have workers running in docker, it is best to stop them first (`docker compose stop worker`), because they will not contain your changes.

1. Make your changes
2. Start the worker with `npm run dev:worker`

You can rebuild your docker workers with `docker compose up --build -d worker

### Database Access

You can run `npm run prisma:studio` to open prisma studio to access the local development database.

### Database Migrations

If you need to make changes to the database schema, follow these steps:

1. Make your changes in [schema.prisma](packages/database/prisma/schema.prisma)
2. Run `npm run prisma:migrate-dev <name>`. `<name>` should be the migration name in camelCase (for example addItemTable).
3. Now you can restart the components you need. The migration gets applied automatically.

### Import legacy database

If you have a local legacy database running, you can import the data with this command.

```sh
docker compose -f docker-compose.yml -f docker-compose.importer.yml up legacy-importer
```

### Authentication

If you need to work on features that required you to be logged in, you need to create a new application on [gw2.me](https://gw2.me/). Then add the generated `client_id` and `client_secret` in `apps/web/.env.local`:

```
GW2ME_CLIENT_ID="<client_id>"
GW2ME_CLIENT_SECRET="<client_secret>"
```

After this, you can log in with your gw2.me account.

You can also run gw2.me locally ([gw2.me repository](https://github.com/GW2Treasures/gw2.me)), then you also need to set `GW2ME_URL` to `http://localhost:4000/`.

You can also add the `Admin` role to your user if required, see [Database Access](#database-access).


### End-to-End tests

The e2e tests are located in [e2e](e2e/).

#### Running local against dev server

First make sure you are running the dev server (`npm run dev:web`). You can run the tests with `npm run e2e`. Follow the onscreen instructions to install all required dependencies.

#### Running in docker

```sh
# start database and web server
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up -d web database database-migration

# run e2e tests
docker compose -f docker-compose.yml -f docker-compose.e2e.yml up e2e
```

### Upgrade database

When the database version is upgraded to a new major version, you need to run the following steps to migrate the data from the old version to the new one.

These instructions only work for migrating from the preceeding database version. If you need to migrate multiple versions, checkout old commits and run the steps from the corresponding README for each version.

1. Make sure all other containers are stopped (`docker compose stop`).
2. Start the new database (`docker compose up -d database`).
3. Start the old database by running `docker compose -f docker-compose.yml -f docker-compose.database-migration.yml up -d database-old`.
4. Run `docker compose exec database-old bash -c 'pg_dumpall -p 5432 -U gw2treasures | PGPASSWORD=$POSTGRES_PASSWORD psql -U gw2treasures -h database'` to migrate the data to the new database.
5. Stop the old database `docker compose -f docker-compose.yml -f docker-compose.database-migration.yml down database-old`.
6. Verify everything works.
7. Delete the old volume `rm -r .docker/database`.

## License
**gw2treasures.com** is licensed under the [MIT License](LICENSE).
