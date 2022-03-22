<?php namespace Eugene3993\Gallery\Updates;

use Schema;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class CreateGalleryTable extends Migration {
   public function up() {
      Schema::create('eugene3993_gallery_list', function (Blueprint $table) {
         $table->engine = 'InnoDB';
         $table->increments('id')->unsigned();
         $table->string('folder_name');
         $table->boolean('use_form_in_gallery')->default(0);
         $table->boolean('sort_in_date')->default(0);
         $table->boolean('hide')->default(0);
         $table->string('slug');
         $table->string('form_type')->nullable();
         $table->string('form_phone')->nullable();
         $table->string('form_btn_send')->nullable();
         $table->string('form_btn')->nullable();
         $table->timestamps();
      });
   }

   public function down() {
      Schema::dropIfExists('eugene3993_gallery_list');
   }
}
