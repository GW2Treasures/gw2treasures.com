<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSkinsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create( 'skins', function( $t )
		{
			$t->increments('id');
			
			$t->string('name_de', 255);
			$t->string('name_en', 255);
			$t->string('name_es', 255);
			$t->string('name_fr', 255);

			$t->string('type', 255);

			$t->string('signature', 40);
			$t->integer('file_id')->unsigned();

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
		Schema::drop( 'skins' );
	}

}