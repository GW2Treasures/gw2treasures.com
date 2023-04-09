<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewWvwTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		if(Schema::hasTable('matches')) {
			Schema::rename('matches', 'matches_old');
		}

        Schema::create('matches', function(Blueprint $table) {
            $table->increments('id');

            $table->string('match_id');
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->text('data');
            $table->timestamps();
        });

		Schema::create('match_worlds', function(Blueprint $table) {
			$table->increments('id');

			$table->integer('match_id')->unsigned();
			$table->integer('world_id')->unsigned();
			$table->enum('team', ['red', 'green', 'blue']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('match_worlds');
		Schema::drop('matches');
		
		if(Schema::hasTable('matches_old')) {
			Schema::rename('matches_old', 'matches');
		}
	}

}
