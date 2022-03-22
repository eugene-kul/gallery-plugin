<?php

return [
	'plugin' => [
		'details' => [
			'name' 			=> 'Gallery',
			'description' 	=> 'Плагин для генерации папок галереи с фотографиями'
		],

		'menu' => [
			'name'	=> 'Галерея'
		]
	],

   'models' => [
      'fields' => [
         'name'          => 'Название папки',
         'hide'          => 'Скрыть этот альбом с сайта',
         'files'         => 'Згруженные фотографии',
         'use_form'      => 'Использовать форму для отправки заявок на картинках в этой папке',
         'sort'          => 'Сортировать фото по дате добавления',
         'phone'         => 'Отображать номер телефона в форме',
         'type'          => 'Тип формы в галереи',
         'types' => [
            'button'     => 'Кнопка внизу фото',
            'fixed'      => 'Закреплена справа от фотографии',
            'f_left'     => 'Закреплена слева от фотографии',
            'f_stick'    => 'Кнопка справа от фотографии',
         ],
         'btn_text'      => 'Тип формы в галереи',
         'btn_form'      => 'Текст на кнопке, открывающей форму',
         'tab1'          => 'Галерея',
         'tab2'          => 'Настройка галереи'
      ],

      'columns' => [
         'name'          => 'Название папки',
         'hide'       => 'Скрыто',
         'use_form'    => 'Форма заявок',
         'length'    => 'Кол-во фото',
         'created_at'    => 'Дата создания',
         'updated_at'    => 'Обновлено'
      ],
   ],

   'gallery_photo' => [
      'info' => [
         'name' 			=> 'Список фото',
         'description' 	=> 'Компонент для отображения списка фотографий'
      ],

      'identifierValue' => [
         'title'			=> 'Identifier value',
         'description'	=> 'Identifier value to load the record from the database. Specify a fixed value or URL parameter name',
         'message'		=> 'Please enter the external parameter identifierValue.'
      ],

      'notFoundMessage' => [
         'title'			=> 'Not found message',
         'description'	=> 'Message to display if the record is not found. Used in the default component\'s partial.',
         'default'		=> 'Record not found'
      ],
   ],

   'gallery_list' => [
      'info' => [
         'name'          => 'Gallery Folders',
         'description'   => 'Отображение папок фотогалереи'
      ],

      'group_name' => 'Внешний вид',

      'message_text' => ' должно быть целым числом',

      'items' => [
         'title'         => 'Количество',
         'description'   => 'Определяет количетсво элементов на странице'
      ],

      'sortorder' => [
         'title'         => 'Сортировка',
         'description'   => 'Отсортировать элементы для отображения на странице'
      ],

      'margin' => [
         'title'         => 'Отступ между блоками',
      ],

      'gallerystyle' => [
         'title'         => 'Подключить стили',
         'description'   => 'Для подключения необходимо в шаблон доавить тег {% styles %}'
      ],

      'galleryscripts' => [
         'title'         => 'Подключить FancyBox3 Mod',
         'description'   => 'Подключает скрипт библиотеки Fancybox 3 с модом формы отправки заявок. Для подключения необходимо в шаблон доавить тег {% scripts %}'
      ],

      'grid' => [
         'title'         => 'Сетка элементов',
         'description'   => 'Определяет количество элементов в одном ряду'
      ],

      'sortlist' => [
         'new'           => 'Сначала новые',
         'old'           => 'Сначала старые'
      ]
   ],

   'breadcrumbs' => [
      'gallery_list'      => 'Список',
      'gallery'           => 'Папка с фото',
      'new'               => 'Новая папка с фото'
   ],

   'buttons' => [
      'create'            => 'Создать',
      'save'              => 'Сохранить',
      'save_indicator'    => 'Сохранение...',
      'save_and_close'    => 'Сохранить и Закрыть',
      'or'                => 'или',
      'cancel'            => 'Отменить',
      'remove_indicator'  => 'Удаление папки',
      'remove_confirm'    => 'Удалить эту папку с фото?',
      'new'               => 'Новыая папка',
      'delete_selected'   => 'Удалить выбранные',
      'delete_confirm'    => 'Удалить выбранные папки с фото?'
   ],

   'errors' => [
      'return_list'       => 'Вернутсья к списку',
   ],

   'messages' => [
      'save'              => 'Папка с фото сохранена',
      'remove'            => 'Папка с фото удалена'
   ],

   'page_title' => [
      'list' => 'Список фотогалереи',
      'create' => 'Добавить новую папку',
      'edit' => 'Редактировать папку с фото'
   ]
];

?>