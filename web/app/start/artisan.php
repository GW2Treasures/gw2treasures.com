<?php

/*
|--------------------------------------------------------------------------
| Register The Artisan Commands
|--------------------------------------------------------------------------
|
| Each available Artisan command must be registered with the console so
| that it is available to be called. We'll register every command so
| the console gets access to each of the command object instances.
|
*/

Artisan::add( new AchievementsCommand );
Artisan::add( new ColorsCommand );
Artisan::add( new EventsCommand );
Artisan::add( new ItemsCommand );
Artisan::add( new MaterialsCommand );
Artisan::add( new MinisCommand );
Artisan::add( new MountsCommand );
Artisan::add( new NoveltiesCommand );
Artisan::add( new ProfessionCommand );
Artisan::add( new RecipesCommand );
Artisan::add( new RemovedItemsCommand );
Artisan::add( new SkillCommand );
Artisan::add( new SkinsCommand );
Artisan::add( new SpecializationsCommand );
Artisan::add( new TitlesCommand );
Artisan::add( new TraitsCommand );
Artisan::add( new WorldsCommand );
