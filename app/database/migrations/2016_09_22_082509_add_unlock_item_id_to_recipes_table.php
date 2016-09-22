<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUnlockItemIdToRecipesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('recipes', function(Blueprint $table)
		{
		    $table->unsignedInteger('unlock_item_id')->after('from_item');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('recipes', function(Blueprint $table)
		{
		    $table->dropColumn('unlock_item_id');
		});
	}

}
