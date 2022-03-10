<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGuildUpgradeTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guild_upgrades', function(Blueprint $table) {
            $table->increments('id');

            $table->string('type');

            $table->string('name_de');
            $table->string('name_en');
            $table->string('name_es');
            $table->string('name_fr');
			
            $table->string('signature', 40);
            $table->integer('file_id');

            $table->text('data_de');
            $table->text('data_en');
            $table->text('data_es');
            $table->text('data_fr');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('guild_upgrades');
    }
}
