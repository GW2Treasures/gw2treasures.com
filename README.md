# gw2treasures.com

**[gw2treasures.com](https://gw2treasures.com)** is a Guild Wars 2 database powered by the official API.

You can create a new issue to report a bug or request a new feature.

## Contributing

The simplest way to get this running locally using docker.

1. Clone this repository or [make a fork](https://docs.github.com/en/github/getting-started-with-github/quickstart/fork-a-repo) if you plan to submit your changes
2. Run `docker-compose up -d` (or `docker-compose up -d --scale wvw-crawler=0` to save some resources if you don't need the WvW crawler)
3. Visit http://gw2treasures.localhost/ to view your local instance
4. The database will be empty, you can fill it from the GW2 Api by running `docker-compose exec --user www-data web ./cron.sh` (see [cron.sh](web/cron.sh)).
   You can run this everytime you need to update your local database.
   
   If you just want to update a single entity you are working with and not the whole db, you can run a command like `docker-compose exec --user www-data web php -dmemory_limit=-1 artisan gw2treasures:achievements`. 
5. Make your changes
6. Run `docker-compose up -d --build web` to restart the service you have been working on to see your changes.
7. Commit the changes to a new branch and push them to your fork
8. Create a new [Pull Request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)


## License
**gw2treasures.com** is licensed under the [MIT License](LICENSE).
