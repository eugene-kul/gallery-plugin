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
         $btn_prev = '<li><a href="'. $url .'/?page='.$prev_page.'">❮ <b>prev</b></a></li>';
      } else {
         $btn_prev = '<li class="disabled"><span>❮ <b>prev</b></span></li>';
      }

      if($current_page < $last_page) {
         $btn_next = '<li><a href="'. $url .'/?page='.$next_page.'" rel="next"><b>next</b>❯</a></li>';
      } else {
         $btn_next = '<li class="disabled"><span><b>next</b>❯</span></li>';
      }

      function get_btn_list($start,$end,$current_page,$last_page) {
         $url = Request::url();
         $btn_pages = [];
         for ($i=$start; $i<=$end; $i++) {
            if($current_page === $i) {
               array_push($btn_pages,'<li class="active"><span>'. $i .'</span></li>');
            } else {
               $class = '';
               if($current_page+1 !== $i and $current_page-1 !== $i and $last_page-2 !== $i) {
                  $class = 'hide-in-mobile';
                  //if($current_page === 1 and 3 === $i) {$class = '';}
               }
               array_push($btn_pages,'<li class="'.$class.'"><a href="'. $url .'?page='. $i .'">'. $i .'</a></li>');
            }
         }
         return $btn_pages;
      }

      if($last_page<=11) {
         array_push($btn_pages, implode('', get_btn_list(1,$last_page,$current_page,$last_page)));
      } else {
         if($current_page<6) {
            array_push($btn_pages, implode('', get_btn_list(1,7,$current_page,$last_page)));
            array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
            array_push($btn_pages, implode('', get_btn_list($last_page-1,$last_page,$current_page,$last_page)));
         } else {
            if($current_page<$last_page-4) {
               array_push($btn_pages, implode('', get_btn_list(1,2,$current_page,$last_page)));
               array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
               array_push($btn_pages, implode('', get_btn_list($current_page-1,$current_page+2,$current_page,$last_page)));
               array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
               array_push($btn_pages, implode('', get_btn_list($last_page-1,$last_page,$current_page,$last_page)));
            } else {
               array_push($btn_pages, implode('', get_btn_list(1,2,$current_page,$last_page)));
               array_push($btn_pages,'<li class="disabled hide-in-mobile"><span>...</span></li>');
               array_push($btn_pages, implode('', get_btn_list($last_page-6,$last_page,$current_page,$last_page)));
            }
         }
      }
      
      return $btn_prev . implode('', $btn_pages) . $btn_next;
   }
}
