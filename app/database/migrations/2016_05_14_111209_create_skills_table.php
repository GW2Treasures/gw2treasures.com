<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSkillsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('skills', function(Blueprint $table)
		{
			$table->increments('id');

			$table->string('type');
			$table->string('weapon_type');
			$table->string('slot');

			$table->string('signature', 40);
			$table->integer('file_id');

			$table->string('name_de');
			$table->string('name_en');
			$table->string('name_es');
			$table->string('name_fr');

			$table->string('description_de');
			$table->string('description_en');
			$table->string('description_es');
			$table->string('description_fr');

			$table->text('data_de');
			$table->text('data_en');
			$table->text('data_es');
			$table->text('data_fr');

			$table->timestamps();
		});

		Schema::create('skill_professions', function(Blueprint $table) {
			$table->increments('id');

			$table->integer('skill_id')->unsigned();
			$table->string('profession_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('skills');
		Schema::drop('skill_professions');
	}

}
