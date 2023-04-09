<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAchievementPrerequisites extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('achievement_prerequisites', function(Blueprint $table)
		{
			$table->increments('id');

            $table->integer('achievement_id')->index();
            $table->integer('prerequisite_id')->index();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('achievement_prerequisites');
	}

}
