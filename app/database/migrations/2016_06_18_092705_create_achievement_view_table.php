<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAchievementViewTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('achievement_views', function(Blueprint $table)
		{
			$table->engine = 'MyISAM';

			$table->increments('id');

			$table->integer('achievement_id')->unsigned();
			$table->enum('language', array( 'de', 'en', 'es', 'fr', 'zh' ));
			$table->timestamp('time')->default( DB::raw('CURRENT_TIMESTAMP') );;

			$table->index(['time', 'achievement_id']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('achievement_views');
	}

}
