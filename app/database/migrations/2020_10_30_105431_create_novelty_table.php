<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNoveltyTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('novelties', function(Blueprint $table) {
		    $table->increments('id');

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

            $table->float('unlocks', 8, 4)->nullable()->default(null);

            $table->timestamps();
		});

		Schema::create('novelty_unlock_items', function(Blueprint $table) {
            $table->integer('novelty_id')->unsigned();
            $table->integer('item_id')->unsigned();

		    $table->primary(['novelty_id', 'item_id']);
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('novelties');
        Schema::drop('novelty_unlock_items');
	}

}
