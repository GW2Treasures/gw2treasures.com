<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraitsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('traits', function(Blueprint $table)
		{
			$table->increments('id');

			$table->integer('tier');
			$table->integer('order');

			$table->enum('slot', ['Major', 'Minor']);

			$table->integer('specialization_id');

			$table->string('signature', 40);
			$table->integer('file_id');

			$table->string('name_de');
			$table->string('name_en');
			$table->string('name_es');
			$table->string('name_fr');

			$table->text('description_de');
			$table->text('description_en');
			$table->text('description_es');
			$table->text('description_fr');

			$table->text('data_de');
			$table->text('data_en');
			$table->text('data_es');
			$table->text('data_fr');

			$table->timestamps();
		});

		Schema::create('traits_required', function(Blueprint $table) {
			$table->increments('id');

			$table->integer('trait_id')->unsigned();
			$table->integer('required_trait_id')->unsigned();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('traits');
		Schema::drop('traits_required');
	}

}
