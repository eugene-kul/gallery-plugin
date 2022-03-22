<?php namespace Eugene3993\Gallery\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use Eugene3993\Gallery\Models\GalleryModels;

/**
 * Gallery Back-end Controller
 */
class Gallery extends Controller
{
   public $implement = [
      'Backend.Behaviors.FormController',
      'Backend.Behaviors.ListController'
   ];

   public $formConfig = 'config_form.yaml';
   public $listConfig = 'config_list.yaml';

   public function __construct() {
      parent::__construct();
      BackendMenu::setContext('Eugene3993.GalleryList', 'gallerylist', 'gallerylist');
   }

   public function update($recordId) {
        $record = GalleryModels::find($recordId);
        $record->save();
        $this->vars['record'] = $record;
        return $this->asExtension('FormController')->update($recordId);
   }

}