<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRemovedFromApi extends Migration {
    static $tables = [
        'achievements' => 'data_fr',
        'professions' => 'data_fr',
        'skills' => 'data_fr',
        'skins' => 'data_fr',
        'specializations' => 'data_fr',
        'traits' => 'data_fr'
    ];

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up() {
	    foreach(self::$tables as $table => $after) {
            Schema::table($table, function(Blueprint $table) use ($after) {
                $table->boolean('removed_from_api')->default(false)->after($after);
            });
        }
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down() {
	    foreach(self::$tables as $table => $after) {
            Schema::table($table, function(Blueprint $table) {
                $table->dropColumn('removed_from_api');
            });
        }
    }
}
