<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDefaultSkinToItems extends Migration {
	public function up() {
		Schema::table('items', function( $t ) {
			$t->integer( 'skin_id' )->default( '0' )->unsigned()->after( 'secondary_suffix_item_id' );
		});
	}

	public function down() {
		Schema::table('items', function( $t ) {
			$t->dropColumn( 'skin_id' );
		});
	}
}