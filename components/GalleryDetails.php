<?php namespace Eugene3993\Gallery\Components;

use Lang;
use Request;
use Cms\Classes\ComponentBase;
use SystemException;
use Eugene3993\Gallery\Classes\ComponentHelper;

class GalleryDetails extends ComponentBase {
   public $record;
   public $items;
   public $margin;
   public $grid;
   public $first_image;
   public $last_image;
   public $renderPaginate;
   public $notFoundMessage;
   public $identifierValue;

   public function componentDetails() {
      return [
         'name'        => 'eugene3993.gallery::lang.gallery_photo.info.name',
         'description' => 'eugene3993.gallery::lang.gallery_photo.info.description'
      ];
   }

   public function defineProperties() {
      return [
         'items' => [
            'title'         => 'eugene3993.gallery::lang.gallery_list.items.title',
            'description'   => 'eugene3993.gallery::lang.gallery_list.items.description',
            'type'              => 'string',
            'validationPattern' => '^[0-9]*$',
            'validationMessage' => Lang::get('eugene3993.gallery::lang.gallery_list.items.title') . 'eugene3993.gallery::lang.gallery_list.group_name',
            'default'       => '30',
         ],
         'margin' => [
            'title'         => 'eugene3993.gallery::lang.gallery_list.margin.title',
            'type'              => 'string',
            'validationPattern' => '^[0-9]*$',
            'validationMessage' => Lang::get('eugene3993.gallery::lang.gallery_list.margin.title') .'eugene3993.gallery::lang.gallery_list.group_name',
            'default'       => '10',
         ],
         'grid' => [
            'title'         => 'eugene3993.gallery::lang.gallery_list.grid.title',
            'description'   => 'eugene3993.gallery::lang.gallery_list.grid.description',
            'type'          => 'dropdown',
            'options'       => [
               '2'    => '2',
               '3'    => '3',
               '4'    => '4',
               '5'    => '5'
            ],
            'default'       => '3',
         ],
         'identifierValue' => [
            'title'       => 'eugene3993.gallery::lang.gallery_photo.identifierValue.title',
            'description' => 'eugene3993.gallery::lang.gallery_photo.identifierValue.description',
            'type'        => 'string',
            'default'     => '{{ :slug }}',
            'validation'  => [
               'required' => [
                  'message' => 'eugene3993.gallery::lang.gallery_photo.identifierValue.message'
               ]
            ]
         ],
         'gallerystyle' => [
            'title'         => 'eugene3993.gallery::lang.gallery_list.gallerystyle.title',
            'description'   => 'eugene3993.gallery::lang.gallery_list.gallerystyle.description',
            'type'          => 'checkbox',
            'default'       => 1,
         ],
         'notFoundMessage' => [
            'title'       => 'eugene3993.gallery::lang.gallery_photo.notFoundMessage.title',
            'description' => 'eugene3993.gallery::lang.gallery_photo.notFoundMessage.description',
            'default'     => 'eugene3993.gallery::lang.gallery_photo.notFoundMessage.default',
            'type'        => 'string',
            'showExternalParam' => false
         ]
      ];
   }

   public function onRun() {
      $this->identifierValue = $this->property('identifierValue');
      
      if ($this->property('gallerystyle')) {
         $this->addCss('assets/css/gallery.css');
         $this->addCss('assets/css/fancybox-with-form.css');
      }
      $this->addJs('assets/js/frontscripts.js');
      
      $this->record = $this->loadRecord();
      $this->prepareVars($this->record);
      
   }

   protected function prepareVars($record) {
      $this->notFoundMessage = $this->property('notFoundMessage');
      $this->grid = $this->property('grid');
      $this->margin = $this->property('margin').'px';
      
      if((int)$this->property('items')) {
         $this->items = $this->property('items');
         $this->setPaginate($record,$this->items);
      } else {
         $this->first_image = 0;
         $this->last_image = count($record->photos);
      }
   }

   protected function setPaginate($record,$items) {
      $url_param = !empty(Request::query()) ? http_build_query(Request::query()) : null;
      $count = isset($record->photos) ? count($record->photos) : 0;

      $last_page = $items ? (int) ceil($count / $items) : 0;

      $url_param = parse_url($_SERVER['REQUEST_URI']);
      if(isset($url_param['query'])) {
         parse_str($url_param['query'], $params);
      }
      if(isset($params['page'])) {
         $current_page = (int) $params['page'];
         if($current_page>$last_page or !$current_page) {
            $current_page = 1;
         }
      } else {
         $current_page = 1;
      }

      $page_items = ($current_page*$items);

      $this->first_image = $page_items-$items;
      $this->last_image = $page_items;

      $paginateHTML = 
         '<ul class="pagination">'.
         ComponentHelper::instance()->get_pagination_item($current_page,$last_page)
         .'</ul>';

      $this->renderPaginate = $paginateHTML;

      $this->page['result'] = 
         'Items: '.$count.'<br>'.
         'Current page: '.$current_page.'<br>'.
         'Last page: '.$last_page.'<br>'. 
         ceil($count / $items);
   }

   

   protected function loadRecord() {
      if (!strlen($this->identifierValue)) {return;}

      $modelClassName = 'Eugene3993\Gallery\Models\GalleryModels';
      $model = new $modelClassName();

      return \Eugene3993\Gallery\Models\GalleryModels::
         where('slug', '=', $this->identifierValue)
         ->first();
   }
}
