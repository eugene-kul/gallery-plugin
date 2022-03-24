<?php namespace Eugene3993\Gallery\Classes;

use Request;
use October\Rain\Support\Traits\Singleton;

class ComponentHelper {
   use Singleton;
   public function get_pagination_item($current_page,$last_page) {
      $url = Request::url();
      $btn_pages = [];
      $prev_page = $current_page - 1;
      $next_page = $current_page + 1;

      if($current_page > 1) {
         $btn_prev = '<li class="display-on-mobile"><a href="'. $url .'">❮❮</a></li><li><a href="'. $url .'/?page='.$prev_page.'">❮</a></li>';
      } else {
         $btn_prev = '<li class="disabled display-on-mobile"><span>❮❮</span></li><li class="disabled"><span>❮</span></li>';
      }

      if($current_page < $last_page) {
         $btn_next = '<li><a href="'. $url .'/?page='.$next_page.'" rel="next">❯</a></li>';
      } else {
         $btn_next = '<li class="disabled "><span>❯</span></li>';
      }

      function get_btn_list($start,$end,$current_page,$last_page) {
         $url = Request::url();
         $btn_pages = [];
         for ($i=$start; $i<=$end; $i++) {
            if($current_page === $i) {
               array_push($btn_pages,'<li class="active"><span>'. $i .'</span></li>');
            } else {
               $class = '';
               if($current_page+1 !== $i and $current_page-1 !== $i) {
                  $class = 'hide-in-mobile';
                  if($current_page === 1 and 3 === $i) {$class = '';}
                  if($last_page-2 === $i and $current_page === $last_page) {$class = '';}
               }
               array_push($btn_pages,'<li class="'.$class.'"><a href="'. $url .'?page='. $i .'">'. $i .'</a></li>');
            }
         }
         return $btn_pages;
      }

      if($last_page<=11) {
         array_push($btn_pages, implode('', get_btn_list(1,$last_page,$current_page,$last_page)));
      } else {
         if($current_page<5) {
            array_push($btn_pages, implode('', get_btn_list(1,6,$current_page,$last_page)));
            array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
            array_push($btn_pages, implode('', get_btn_list($last_page,$last_page,$current_page,$last_page)));
         } else {
            if($current_page<$last_page-3) {
               array_push($btn_pages, implode('', get_btn_list(1,1,$current_page,$last_page)));
               array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
               array_push($btn_pages, implode('', get_btn_list($current_page-1,$current_page+2,$current_page,$last_page)));
               array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
               array_push($btn_pages, implode('', get_btn_list($last_page,$last_page,$current_page,$last_page)));
            } else {
               array_push($btn_pages, implode('', get_btn_list(1,1,$current_page,$last_page)));
               array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
               array_push($btn_pages, implode('', get_btn_list($last_page-5,$last_page,$current_page,$last_page)));
            }
         }
      }
      
      return $btn_prev . implode('', $btn_pages) . $btn_next;
   }
}
