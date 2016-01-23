<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAchievementGroupsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('achievement_groups', function(Blueprint $table)
		{
			$table->string('id', 36);
			$table->primary('id');

			$table->string('name_de');
			$table->string('name_en');
			$table->string('name_es');
			$table->string('name_fr');

			$table->text('description_de');
			$table->text('description_en');
			$table->text('description_es');
			$table->text('description_fr');

			$table->integer('order');

			$table->text('data_de');
			$table->text('data_en');
			$table->text('data_es');
			$table->text('data_fr');

			$table->timestamps();
		});

		Schema::table('achievement_categories', function(Blueprint $table)
		{
			$table->string('achievement_group_id', 36)->default('')->after('id')->index();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('achievement_groups');

		Schema::table('achievement_categories', function(Blueprint $table)
		{
			$table->dropColumn('achievement_group_id');
		});
	}

}
