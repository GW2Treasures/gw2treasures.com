<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRecipeIngredientType extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('recipes', function(Blueprint $table)
		{
            $table->string('ing_type_1')->nullable()->default(null)->after('ing_id_1');
            $table->string('ing_type_2')->nullable()->default(null)->after('ing_id_2');
            $table->string('ing_type_3')->nullable()->default(null)->after('ing_id_3');
            $table->string('ing_type_4')->nullable()->default(null)->after('ing_id_4');
		});

		DB::table('recipes')->where('ing_id_1', '!=', 0)->update(['ing_type_1' => 'Item']);
		DB::table('recipes')->where('ing_id_2', '!=', 0)->update(['ing_type_2' => 'Item']);
		DB::table('recipes')->where('ing_id_3', '!=', 0)->update(['ing_type_3' => 'Item']);
		DB::table('recipes')->where('ing_id_4', '!=', 0)->update(['ing_type_4' => 'Item']);
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
			$table->dropColumn(['ing_type_1', 'ing_type_2', 'ing_type_3', 'ing_type_4']);
		});
	}

}
