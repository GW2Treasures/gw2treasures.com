gw2treasures-wvw-crawler
========================

Crawls the Guild Wars 2 WvW APIs for current scores

Setup
=====

1. Create the table for mysql

  ```mysql
  CREATE TABLE IF NOT EXISTS `matches` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `match_id` varchar(8) NOT NULL,
    `red_world_id` int(10) unsigned NOT NULL,
    `blue_world_id` int(10) unsigned NOT NULL,
    `green_world_id` int(10) unsigned NOT NULL,
    `start_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
    `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
    `red_score` int(10) unsigned NOT NULL DEFAULT '0',
    `blue_score` int(10) unsigned NOT NULL DEFAULT '0',
    `green_score` int(10) unsigned NOT NULL DEFAULT '0',
    `data` text NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ; 
  ```
2. `npm install`
3. Copy the `config-sample.json` to `config.json` and adjust mysql user/db/password
4. `coffee index.coffee`  
