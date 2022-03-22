<?php

return [
	'plugin' => [
		'details' => [
			'name' 			=> 'Gallery',
			'description' 	=> 'Plugin for generating gallery folders with photos'
		],

		'menu' => [
			'name'	=> 'Gallery'
		]
	],

   'models' => [
      'fields' => [
         'name'      => 'Folder name',
         'hide'       => 'Hide this album from the site',
         'files'       => 'Uploaded photos',
         'use_form'     => 'Use the form to send applications in pictures in this folder',
         'sort'          => 'Sort photos by date added',
         'phone'       => 'Display the phone number in the form',
         'type'       => 'Type of form in the gallery',
         'types' => [
            'button'   => 'Button at the bottom of the photo',
            'fixed'     => 'Fixed to the right of the photo',
            'f_left'     => 'Fixed to the left of the photo',
            'f_stick'   => 'The button to the right of the photo',
         ],
         'btn_text'      => 'Text on the form submission button',
         'btn_form'     => 'Text on the button that opens the form',
         'tab1'        => 'Ggallery',
         'tab2'       => 'Ggallery Settings'
      ],

      'columns' => [
         'name'      => 'Folder name',
         'hide'       => 'Hide',
         'use_form'    => 'Use Form',
         'length'    => 'Number of photos',
         'created_at'   => 'Date of creation',
         'updated_at'    => 'Updated'
      ],
   ],

   'gallery_photo' => [
      'info' => [
         'name' 	=> 'List of photos',
         'description' 	=> 'A component for displaying a list of photos on a page'
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
         'description'   => 'Displaying photo gallery folders'
      ],

      'group_name' => 'Appearance',

      'message_text' => ' must be an integer',

      'items' => [
         'title'         => 'Quantity per page',
         'description'   => 'Determines the number of elements on the page'
      ],

      'sortorder' => [
         'title'         => 'Sort',
         'description'   => 'Sort the items to display on the page'
      ],

      'margin' => [
         'title'         => 'Margin between blocks',
      ],

      'gallerystyle' => [
         'title'         => 'Enable Styles',
         'description'   => 'To connect, you need to add the {% styles %} tag to the template'
      ],

      'galleryscripts' => [
         'title'         => 'Enable FancyBox3 Mod',
         'description'   => 'Connects the script of the Fancybox 3 library with the application form mod. To connect, you need to add the {% scripts %} tag to the template'
      ],

      'grid' => [
         'title'         => 'Grid of elements',
         'description'   => 'Defines the number of elements in one row'
      ],

      'sortlist' => [
         'new'           => 'New ones first',
         'old'           => 'Old ones first'
      ]
   ],

   'breadcrumbs' => [
      'gallery_list'      => 'Folders',
      'gallery'           => 'Folder with photos',
      'new'               => 'New Folder with photos'
   ],

   'buttons' => [
      'create'            => 'Create',
      'save'               => 'Save',
      'save_indicator'      => 'Saving...',
      'save_and_close'       => 'Save and Close',
      'or'                    => 'or',
      'cancel'                 => 'Cancel',
      'remove_indicator'      => 'Remove Folder',
      'remove_confirm'       => 'Remove this Folder with photos?',
      'new'                 => 'New Folder',
      'delete_selected'    => 'Delete selected',
      'delete_confirm'    => 'Do you want to delete the selected folders?'
   ],

   'errors' => [
      'return_list' => 'Return to the list',
   ],

   'messages' => [
      'save' => 'Folder with photos saved',
      'remove' => 'Folder with photos remove'
   ],

   'page_title' => [
      'list' => 'List of Photo Galleries',
      'create' => 'Creating a new Folder with photos',
      'edit' => 'Editing the photo folder'
   ]
];

?>