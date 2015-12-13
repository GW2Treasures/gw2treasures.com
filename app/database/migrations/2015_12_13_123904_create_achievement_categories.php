<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAchievementCategories extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('achievement_categories', function(Blueprint $table)
		{
			$table->increments('id');

			$table->string('name_de');
			$table->string('name_en');
			$table->string('name_es');
			$table->string('name_fr');

			$table->text('description_de');
			$table->text('description_en');
			$table->text('description_es');
			$table->text('description_fr');

			$table->string('signature', 40);
			$table->integer('file_id');

			$table->text('data_de');
			$table->text('data_en');
			$table->text('data_es');
			$table->text('data_fr');

			$table->timestamps();
		});

		Schema::table('achievements', function(Blueprint $table)
		{
			$table->integer('achievement_category_id')->default(0)->after('id')->index();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('achievement_categories');
		Schema::table('achievements', function(Blueprint $table)
		{
			$table->dropColumn('achievement_category_id');
		});
	}

}
