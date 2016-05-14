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
Artisan::add( new ItemsCommand );
Artisan::add( new SkinsCommand );
Artisan::add( new TraitsCommand );
Artisan::add( new SpecializationsCommand );
Artisan::add( new ProfessionCommand );
