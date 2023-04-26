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

The workers powering all background tasks of gw2treasures.com are located [apps/worker](apps/worker/). If you have workers running in docker, it is best to stop them first (`docker compose stop worker`), because they will not contain your changes.

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

## License
**gw2treasures.com** is licensed under the [MIT License](LICENSE).
