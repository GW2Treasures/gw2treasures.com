<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemViewTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create( 'item_views', function( $t )
		{
			$t->increments('id');
			
			$t->integer('item_id')->unsigned();
			$t->enum('language', array( 'de', 'en', 'es', 'fr' ));
			$t->timestamp('time')->default( DB::raw('CURRENT_TIMESTAMP') );;
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop( 'item_views' );
	}

}