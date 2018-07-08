<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMapsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('maps', function(Blueprint $table)
		{
			$table->increments('id');

			$table->integer('region_id');
            $table->integer('continent_id');

            $table->string('name_de');
            $table->string('name_en');
            $table->string('name_es');
            $table->string('name_fr');

            $table->string('type');
            $table->integer('min_level');
            $table->integer('max_level');
            $table->integer('default_floor');

            $table->string('region_name_de')->default('');
            $table->string('region_name_en')->default('');
            $table->string('region_name_es')->default('');
            $table->string('region_name_fr')->default('');

            $table->string('continent_name_de')->default('');
            $table->string('continent_name_en')->default('');
            $table->string('continent_name_es')->default('');
            $table->string('continent_name_fr')->default('');

            $table->text('data_de');
            $table->text('data_en');
            $table->text('data_es');
            $table->text('data_fr');

            $table->boolean('removed_from_api')->default(false);

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
		Schema::drop('maps');
	}

}
