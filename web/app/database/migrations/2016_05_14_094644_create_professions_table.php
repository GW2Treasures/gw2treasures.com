<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfessionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('professions', function(Blueprint $table)
		{
			$table->string('id', 255)->primary();

			$table->string('signature', 40);
			$table->integer('file_id');

			$table->string('name_de');
			$table->string('name_en');
			$table->string('name_es');
			$table->string('name_fr');

			$table->text('data_de');
			$table->text('data_en');
			$table->text('data_es');
			$table->text('data_fr');

			$table->timestamps();
		});

		Schema::table('specializations', function(Blueprint $table) {
			$table->renameColumn('profession', 'profession_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('professions');

		Schema::table('specializations', function(Blueprint $table) {
			$table->renameColumn('profession_id', 'profession');
		});
	}

}
