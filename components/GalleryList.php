<?php namespace Eugene3993\Gallery\Components;

use Lang;
use Cms\Classes\ComponentBase;
use Eugene3993\Gallery\Classes\ComponentHelper;

class GalleryList extends ComponentBase {
   public function componentDetails() {
      return [
         'name'        => 'eugene3993.gallery::lang.gallery_list.info.name',
         'description' => 'eugene3993.gallery::lang.gallery_list.info.description'
      ];
   }

   public function defineProperties() {
      return [
         'items' => [
               'title'         => 'eugene3993.gallery::lang.gallery_list.items.title',
               'description'   => 'eugene3993.gallery::lang.gallery_list.items.description',
               'type'              => 'string',
               'validationPattern' => '^[0-9]*$',
               'validationMessage' => Lang::get('eugene3993.gallery::lang.review_list.items.title') .'eugene3993.gallery::lang.gallery_list.group_name',
               'default'       => '30',
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
         'margin' => [
            'title'         => 'eugene3993.gallery::lang.gallery_list.margin.title',
            'type'              => 'string',
            'validationPattern' => '^[0-9]*$',
            'validationMessage' => Lang::get('eugene3993.gallery::lang.gallery_list.margin.title') .'eugene3993.gallery::lang.gallery_list.group_name',
            'default'       => '10',
         ],
         'gallerystyle' => [
               'title'         => 'eugene3993.gallery::lang.gallery_list.gallerystyle.title',
               'description'   => 'eugene3993.gallery::lang.gallery_list.gallerystyle.description',
               'type'          => 'checkbox',
               'default'       => 1,
         ],
         'sortOrder' => [
            'title'         => 'eugene3993.gallery::lang.gallery_list.sortorder.title',
            'description'   => 'eugene3993.gallery::lang.gallery_list.sortorder.description',
            'type'          => 'dropdown',
            'options'       => [
               'desc'    => 'eugene3993.gallery::lang.gallery_list.sortlist.new',
               'asc'     => 'eugene3993.gallery::lang.gallery_list.sortlist.old'
            ],
            'default'       => 'desc',
         ]
      ];
   }

   public $gallery;
   public $grid;
   public $margin;
   public $renderPaginate;

   public function onRun() {
      if ($this->property('gallerystyle')) {
         $this->addCss('assets/css/gallery.css');
      }
      
      $this->grid = $this->property('grid');
      $this->margin = $this->property('margin').'px';
      $items = $this->property('items');
      
      $this->gallery = \Eugene3993\Gallery\Models\GalleryModels::
         where('hide', 0)
         ->orderBy('created_at', $this->property('sortOrder'))
         ->paginate($items);

      $last_page = $this->gallery->lastPage();
      $current_page = $this->gallery->currentPage();

      if($last_page > 1) {
         $paginateHTML = 
            '<ul class="pagination">'.
            ComponentHelper::instance()->get_pagination_item($current_page,$last_page)
            .'</ul>';

         $this->renderPaginate = $paginateHTML;
      }
   }
}