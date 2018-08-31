<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMinisTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('minis', function(Blueprint $table)
		{
			$table->increments('id');

            $table->integer('item_id');
            $table->string('signature', 40);
            $table->integer('file_id');
            $table->integer('order');

            $table->string('name_de');
            $table->string('name_en');
            $table->string('name_es');
            $table->string('name_fr');

            $table->text('unlock_de');
            $table->text('unlock_en');
            $table->text('unlock_es');
            $table->text('unlock_fr');

            $table->text('data_de');
            $table->text('data_en');
            $table->text('data_es');
            $table->text('data_fr');

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('minis');
	}

}
