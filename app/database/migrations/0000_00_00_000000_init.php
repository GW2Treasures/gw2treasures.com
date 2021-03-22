<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Init extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create( 'items', function( $t ) {
			$t->integer('id')->unsigned();

			$t->string('signature', 40);
			$t->integer('file_id')->unsigned()->default(0);

			$t->enum('rarity', ['Ascended','Basic','Exotic','Fine','Junk','Legendary','Masterwork','Rare'])->default('Basic');
			$t->enum('weight', ['None','Clothing','Light','Medium','Heavy'])->default('None');
			$t->enum('type', ['None','Armor','Back','Bag','Consumable','Container','CraftingMaterial','Gathering','Gizmo','MiniPet','Tool','Trait','Trinket','Trophy','UpgradeComponent','Weapon'])->default('None');
			$t->string('subtype', 255);
			$t->string('unlock_type', 255);
			$t->smallInteger('level')->unsigned()->default(0);
			$t->integer('value')->unsigned()->default(0);
			$t->boolean('pvp')->default(false);
			$t->string('attr1');
			$t->string('attr2');
			$t->string('attr3');
			$t->string('attr_name');
			$t->integer('unlock_id')->unsigned()->default(0);
			$t->integer('suffix_item_id')->unsigned()->default(1);
			$t->integer('secondary_suffix_item_id')->unsigned()->default(0);
			$t->string('name_de', 255);
			$t->string('name_en', 255);
			$t->string('name_es', 255);
			$t->string('name_fr', 255);
			$t->text('desc_de');
			$t->text('desc_en');
			$t->text('desc_es');
			$t->text('desc_fr');
			$t->text('data_de');
			$t->text('data_en');
			$t->text('data_es');
			$t->text('data_fr');
			$t->integer('wikipage_de')->unsigned()->default(0);
			$t->integer('wikipage_en')->unsigned()->default(0);
			$t->integer('wikipage_es')->unsigned()->default(0);
			$t->integer('wikipage_fr')->unsigned()->default(0);
			$t->boolean('wiki_de')->default(false);
			$t->boolean('wiki_en')->default(false);
			$t->boolean('wiki_es')->default(false);
			$t->boolean('wiki_fr')->default(false);
			$t->boolean('wiki_checked')->default(false);
			$t->boolean('updated')->default(false);
			$t->integer('update_time')->unsigned()->default(false);
			$t->timestamp('date_added');

			$t->primary('id');
			$t->index('unlock_id');
			$t->index('suffix_item_id');
			$t->index(['type','weight','rarity','value','level'], 'similar');
			$t->index(['signature','file_id'], 'icon');
			$t->index('name_de');
			$t->index('name_en');
			$t->index('name_es');
			$t->index('name_fr');
			$t->index(['updated','date_added'],'new_items');
		});


		Schema::create('recipes', function($t) {
			$t->integer('recipe_id')->unsigned();
			$t->integer('output_id')->unsigned()->default(0);
			$t->integer('output_count')->unsigned()->default(0);
			$t->integer('disciplines')->unsigned()->default(0);
			$t->integer('rating')->unsigned()->default(0);
			$t->string('type');
			$t->boolean('from_item')->default(false);
			$t->integer('ing_id_1')->unsigned()->default(0);
			$t->integer('ing_count_1')->unsigned()->default(0);
			$t->integer('ing_id_2')->unsigned()->default(0);
			$t->integer('ing_count_2')->unsigned()->default(0);
			$t->integer('ing_id_3')->unsigned()->default(0);
			$t->integer('ing_count_3')->unsigned()->default(0);
			$t->integer('ing_id_4')->unsigned()->default(0);
			$t->integer('ing_count_4')->unsigned()->default(0);
			$t->text('data');
			$t->boolean('removed_from_api')->default(false);
			$t->boolean('updated')->default(false);
			$t->integer('update_time')->default(0);


			$t->primary('recipe_id');
			$t->index('output_id');
			$t->index('ing_id_1');
			$t->index('ing_id_2');
			$t->index('ing_id_3');
			$t->index('ing_id_4');
		});


		Schema::create('worlds', function($t) {
			$t->integer('id')->unsigned();
			$t->string('name_de', 255);
			$t->string('name_en', 255);
			$t->string('name_es', 255);
			$t->string('name_fr', 255);

			$t->primary('id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('items');
		Schema::drop('recipes');
		Schema::drop('worlds');
	}

}