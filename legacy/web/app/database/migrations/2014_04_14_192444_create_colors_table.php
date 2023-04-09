<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateColorsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create( 'colors', function( $t ) {
			$t->increments('id');
			
			$t->string('name_de', 255);
			$t->string('name_en', 255);
			$t->string('name_es', 255);
			$t->string('name_fr', 255);

			$t->integer('base_rgb');
			$t->integer('cloth_rgb');
			$t->integer('leather_rgb');
			$t->integer('metal_rgb');

			$t->text('data_de');
			$t->text('data_en');
			$t->text('data_es');
			$t->text('data_fr');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('colors');
	}

}