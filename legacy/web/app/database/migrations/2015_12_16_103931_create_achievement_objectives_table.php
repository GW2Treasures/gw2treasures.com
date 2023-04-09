<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAchievementObjectivesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('achievement_objectives', function(Blueprint $table)
		{
			$table->increments('id');

			$table->integer('achievement_id')->index();

			$table->string('type');
			$table->integer('entity_id');

			$table->index(['entity_id', 'type']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('achievement_objectives');
	}

}
