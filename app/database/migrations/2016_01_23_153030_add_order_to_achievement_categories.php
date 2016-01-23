<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOrderToAchievementCategories extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('achievement_categories', function(Blueprint $table)
		{
			$table->integer('order')->after('file_id')->default(0);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('achievement_categories', function(Blueprint $table)
		{
			$table->dropColumn('order');
		});
	}

}
