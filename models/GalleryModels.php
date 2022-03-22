<?php namespace Eugene3993\Gallery\Models;

use Model;

/**
 * Gallery Model
 */
class GalleryModels extends Model
{
   use \October\Rain\Database\Traits\Validation;

   public function onRun() {
      $this->addCss('assets/css/backend.css'); //?
      dd($this);
   }

   /**
    * @var string The database table used by the model.
    */
   public $table = 'eugene3993_gallery_list';

   /**
    * @var array Guarded fields
    */
   protected $guarded = ['*'];

   /**
    * @var array Fillable fields
    */
   protected $fillable = [];

   /**
    * @var array Relations
    */
   public $hasOne = [];
   public $hasMany = [];
   public $belongsTo = [];
   public $belongsToMany = [];
   public $morphTo = [];
   public $morphOne = [];
   public $morphMany = [];
   public $attachOne = [];
   public $attachMany = [
      'photos' => 'System\Models\File'
   ];

    /*Validation fields*/
   public $rules = [
      'folder_name' => 'required',
      'slug' => 'required',
      'photos' => 'required',
   ];
}
