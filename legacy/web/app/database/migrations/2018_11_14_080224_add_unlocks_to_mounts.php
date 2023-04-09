<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUnlocksToMounts extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('mount_skins', function(Blueprint $table)
		{
            $table->float('unlocks', 8, 4)->nullable()->default(null);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('mount_skins', function(Blueprint $table)
		{
			$table->dropColumn('unlocks');
		});
	}

}
