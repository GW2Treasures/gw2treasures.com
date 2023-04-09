<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateItemColumnsNullableTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // set default to ''
        DB::statement("ALTER TABLE `items`
            CHANGE `desc_de` `desc_de` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
            CHANGE `desc_en` `desc_en` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
            CHANGE `desc_es` `desc_es` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
            CHANGE `desc_fr` `desc_fr` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '';");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // set default to ''
        DB::statement("ALTER TABLE `items`
            CHANGE `desc_de` `desc_de` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            CHANGE `desc_en` `desc_en` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            CHANGE `desc_es` `desc_es` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
            CHANGE `desc_fr` `desc_fr` TEXT CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL;");
    }
}
