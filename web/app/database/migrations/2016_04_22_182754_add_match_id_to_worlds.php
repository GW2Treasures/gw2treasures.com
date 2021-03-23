<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMatchIdToWorlds extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('worlds', function(Blueprint $table)
		{
			$table->integer('match_id')->unsigned()->default(0)->after('name_fr');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('worlds', function(Blueprint $table)
		{
			$table->dropColumn('match_id');
		});
	}

}
