// gbox v3.5.71 whith forms
(function(window, document, $, undefined) {
	"use strict";
	window.console = window.console || {info: function(stuff) {}};
	// Если нет jQuery, gbox не может работать
	if (!$) {return;}
	// Проверьте, инициализирован ли gBox
	if ($.fn.gbox) {return;}
	// Частные настройки по умолчанию
	var defaults = {
		closeExisting: false, // Close existing modals. Set this to false if you do not need to stack multiple instances		
		loop: true, // Включить бесконечную навигацию по галерее
		gutter: 50, // Горизонтальное пространство между слайдами
		keyboard: true, // Включить навигацию с клавиатуры		
		preventCaptionOverlap: true, // Должны позволить заголовок перекрывать содержимое
		arrows: true, // Должны отображать стрелки навигации по краям экрана
		infobar: true, // Должен отображать счетчик в верхнем левом углу
		smallBtn: "auto", // Должен отображать кнопку закрытия (используйте `btnTpl.smallBtn` шаблон). может быть true, false, "auto"
		toolbar: "auto", // Должна отображаться панель инструментов (кнопки вверху). может быть true, false, "auto"
		buttons: [ // Какие кнопки должны появиться в верхнем правом углу. Кнопки будут создаваться с использованием шаблонов из опции `btnTpl` и они будут помещены в панель инструментов (class="gbox-toolbar"` element)
			"zoom",
			"share",
			//"fullScreen",
			//"download",
			"thumbs", "close"
		],
		idleTime: 3, // Определить время простоя в секундах
		protect: false, // Отключить щелчок правой кнопкой мыши и использовать простую защиту изображений для изображений
		modal: false, // Ярлык, чтобы сделать содержимое «модальным» - отключить навигацию с клавиатуры, скрыть кнопки и т. Д.
		image: {
			// Подождите, пока изображения загрузятся перед отображением
			// true- дождитесь загрузки изображения и затем отобразите;
			// false - показать эскиз и загрузить полноразмерное изображение поверх,
			// требует предварительно определенных размеров изображения (`data-width` and `data-height` attributes)
			preload: true
		},
		ajax: { // Объект, содержащий настройки для запроса ajax
			settings: {
				// Это помогает указать, что запрос исходит от модального. Не стесняйтесь менять название
				data: {gbox: true}
			}
		},
		iframe: { // Шаблон iframe
			tpl: '<iframe id="gbox-frame{rnd}" name="gbox-frame{rnd}" class="gbox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',
			preload: true, // Предварительная загрузка iframe перед его отображением. Это позволяет рассчитать ширину и высоту содержимого iframe
			css: {}, // Пользовательский CSS-стиль для элемента обтекания iframe. Вы можете использовать это для установки пользовательских размеров iframe
			attr: {
				scrolling: "auto"
			} // Атрибуты тега iframe
		},
		video: { // Только для видео HTML5
			tpl: '<video class="gbox-video" controls controlsList="nodownload" poster="{{poster}}">' + '<source src="{{src}}" type="{{format}}" />' + 'Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!' + "</video>",
			format: "", // пользовательский формат видео
			autoStart: true
		},
		defaultType: "image", // Тип контента по умолчанию, если не может быть обнаружен автоматически
		animationEffect: "zoom", // Открыть / закрыть тип анимации. Возможные значения: "false" "zoom" "fade" "zoom-in-out"
		animationDuration: 366, // Продолжительность в мс для анимации открытия / закрытия
		zoomOpacity: "auto", // Должно ли изображение изменять непрозрачность при масштабировании? Если непрозрачность "auto", непрозрачность будет изменена, если изображение и миниатюра имеют разные пропорции
		transitionEffect: "fade", // Эффект перехода между слайдами. Возможные значения: 'false' 'fade' 'slide' 'circular' 'tube' 'zoom-in-out' 'rotate'
		transitionDuration: 400, // Продолжительность в мс для анимации перехода
		slideClass: "", // Пользовательский класс CSS для элемента слайда
		baseClass: "", // Пользовательский класс CSS для макета
		// Базовый шаблон для макета
		baseTpl: '<div class="gbox-container" role="dialog" tabindex="-1">' + '<div class="gbox-settings noselect"></div>' + '<div class="gbox-bg"></div>' + '<div class="gbox-inner">' + '<div class="gbox-infobar"><span data-gbox-index></span>&nbsp;/&nbsp;<span data-gbox-count></span></div>' + '<div class="gbox-toolbar">{{buttons}}</div>' + '<div class="gbox-navigation">{{arrows}}</div>' + '<div class="gbox-stage"></div>' + '<div class="gbox-caption"><div class="gbox-caption__body"></div></div>' + "</div>" + "</div>",
		spinnerTpl: '<div class="gbox-loading"></div>', // Шаблон индикатора загрузки
		errorTpl: '<div class="gbox-error"><p>{{ERROR}}</p></div>', // Шаблон сообщения об ошибке
		btnTpl: {
			download: '<a download data-gbox-download class="gbox-button gbox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg>' + "</a>",
			zoom: '<button data-gbox-zoom class="gbox-button gbox-button--zoom" title="{{ZOOM}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>' + "</button>",
			close: '<button data-gbox-close class="gbox-button gbox-button--close" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg>' + "</button>",
			arrowLeft: '<button data-gbox-prev class="gbox-button gbox-button--arrow_left" title="{{PREV}}">' + '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div>' + "</button>",
			arrowRight: '<button data-gbox-next class="gbox-button gbox-button--arrow_right" title="{{NEXT}}">' + '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div>' + "</button>", // Эта маленькая кнопка закрытия будет добавлена ​​к вашему html / inline / ajax контенту по умолчанию,
			// если опция "smallBtn" не установлена ​​в false
			smallBtn: '<button type="button" data-gbox-close class="gbox-button gbox-close-small" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg>' + "</button>"
		},
		parentEl: "body", // Контейнер вводится в этот элемент
		hideScrollbar: false, // Скрыть браузер вертикальной полосы прокрутки; Используйте на свой риск
		autoFocus: true, // Фокусировка. Попробуйте сфокусироваться на первом фокусируемом элементе после открытия
		backFocus: false, // Поместить фокус обратно на активный элемент после закрытия
		trapFocus: true, // Не позволяйте пользователю сосредоточиться на элементе вне модального содержимого
		fullScreen: {
			autoStart: false
		}, // Специальные параметры модуля
		touch: { // установить `touch: false` чтобы отключить панорамирование/смахивание
			vertical: true, // Разрешить перетаскивать содержимое по вертикали
			momentum: true // Продолжайте движение после отпускания мыши/касания при панорамировании
		},
		hash: null, // Значение хеша при инициализации вручную, установите `false` чтобы отключить изменение хеша
		media: {}, // Настройте или добавьте новые типы медиа
		thumbs: {
			autoStart: false, // Отображать миниатюры при открытии
			hideOnClose: true, // Скрыть сетку миниатюр при закрытии анимации
			parentEl: ".gbox-container", // Контейнер вводится в этот элемент
			axis: "y" // Вертикальная (у) или горизонтальная (х) прокрутка
		},
		wheel: "auto", // Используйте колесико мыши для навигации по галерее. Если 'auto' - включено только для изображений
		onInit: $.noop, // Когда экземпляр был инициализирован
		beforeLoad: $.noop, // Перед загрузкой содержимого слайда
		afterLoad: $.noop, // Когда содержимое слайда будет загружено
		beforeShow: $.noop, // Перед началом открытой анимации
		afterShow: $.noop, // Когда контент загружен и анимирован
		beforeClose: $.noop, // Прежде чем экземпляр пытается закрыть. Верните false, чтобы отменить закрытие.
		afterClose: $.noop, // После того, как экземпляр был закрыт
		onActivate: $.noop, // Когда экземпляр вынесен на фронт
		onDeactivate: $.noop, // Когда другой экземпляр был активирован
		// Взаимодействие. Используйте параметры ниже, чтобы настроить предпринятые действия, когда пользователь нажимает или дважды щелкает область gbox, каждая опция может быть строкой или методом, который возвращает значение.
		// Возможные значения:
		// "close" - закрыть экземпляр
		// "next"- перейти к следующему элементу галереи
		// "nextOrClose" - перейти к следующему элементу галереи или закрыть, если в галерее есть только один элемент
		// "toggleControls"- показать / скрыть элементы управления
		// "zoom"- увеличить изображение (если загружено)
		// false - ничего не делать
		// Нажал на содержание
		clickContent: function(current, event) {
			return current.type === "image" ? "zoom" : false;
		},
		clickSlide: "close", // Нажал на слайде
		clickOutside: "close", // Щелкнул по элементу background (background); если вы не изменили макет, то, скорее всего, вам нужно использовать опцию `clickSlide`
		dblclickContent: false, // То же, что и предыдущие два, но для двойного щелчка
		dblclickSlide: false,
		dblclickOutside: false, // Пользовательские параметры при обнаружении мобильного устройства
		mobile: {
			preventCaptionOverlap: false,
			idleTime: false,
			clickContent: function(current, event) {
				return current.type === "image" ? "toggleControls" : false;
			},
			clickSlide: function(current, event) {
				return current.type === "image" ? "toggleControls" : "close";
			},
			dblclickContent: function(current, event) {
				return current.type === "image" ? "zoom" : false;
			},
			dblclickSlide: function(current, event) {
				return current.type === "image" ? "zoom" : false;
			}
		}, // интернационализация
		lang: "ru",
		i18n: {
			ru: {
				CLOSE: "Закрыть",
				NEXT: "Следующее фото",
				PREV: "Предыдущее фото",
				ERROR: "<svg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 512.022 512.022' viewBox='0 0 512.022 512.022'><g transform='matrix(1 0 0 1 0 0)'><g><path d='m374.47 182.01c-4.034-.941-8.066 1.566-9.008 5.6-.941 4.034 1.566 8.067 5.6 9.008 13.117 3.061 36.506 19.637 41.321 24.453 1.465 1.464 3.385 2.197 5.304 2.197s3.839-.732 5.304-2.197c2.929-2.929 2.929-7.678 0-10.606-5.743-5.744-31.347-24.448-48.521-28.455zm-236.897 0c-17.174 4.007-42.777 22.71-48.521 28.454-2.929 2.929-2.929 7.678 0 10.606 1.465 1.464 3.385 2.197 5.304 2.197s3.839-.732 5.304-2.197c4.815-4.816 28.204-21.392 41.321-24.453 4.034-.941 6.541-4.974 5.6-9.008-.942-4.033-4.975-6.54-9.008-5.599zm266.058 260.249c-75.749 57.46-174.5 63.118-253.322 25.495 16.789-12.169 27.74-31.924 27.74-54.199 0-34.058-30.277-66.658-49.855-96.491-8.218-12.525-26.211-12.049-34.118 0-13.15 20.042-31.702 42.031-42 64.507-60.162-93.062-46.606-216.888 36.917-295.413 3.018-2.837 3.164-7.584.326-10.602-2.837-3.018-7.584-3.164-10.602-.327-91.911 86.413-103.988 224.079-32.793 323.963-11.724 50.941 38.496 95.444 88.197 77.208 85.426 45.348 195.227 41.034 278.573-22.192 3.301-2.503 3.946-7.208 1.443-10.508-2.502-3.298-7.207-3.945-10.506-1.441zm-292.497 23.21c-28.626 0-51.915-23.289-51.915-51.914 0-28.286 28.608-59.624 47.396-88.262 2.132-3.25 6.904-3.249 9.036 0 18.795 28.646 47.396 59.978 47.396 88.262.002 28.626-23.287 51.914-51.913 51.914zm4.7-216.476c-2.722-3.123-7.46-3.448-10.582-.726-3.123 2.721-3.447 7.459-.727 10.582 9.104 10.444 22.255 16.435 36.083 16.435s26.98-5.99 36.082-16.435c2.722-3.123 2.395-7.86-.727-10.582-3.125-2.721-7.86-2.396-10.582.727-6.253 7.175-15.282 11.29-24.774 11.29-9.49-.001-18.52-4.116-24.773-11.291zm140.188-243.6c-53.894 0-105.45 16.205-149.096 46.865-3.389 2.381-4.206 7.059-1.825 10.448 2.382 3.39 7.059 4.208 10.448 1.826 41.105-28.876 89.681-44.14 140.473-44.14 131.773 0 241 104.093 241 235.607 0 61.191-23.883 119.175-67.25 163.271-2.904 2.953-2.864 7.702.089 10.606 2.95 2.9 7.696 2.869 10.606-.088 46.143-46.919 71.555-108.639 71.555-173.789 0-138.901-114.944-250.606-256-250.606zm-41.152 314.985c10.514-15.114 25.513-23.782 41.152-23.782 15.64 0 30.639 8.668 41.152 23.782 2.36 3.391 7.032 4.245 10.44 1.874 3.4-2.365 4.239-7.04 1.874-10.44-13.359-19.202-32.847-30.215-53.467-30.215s-40.107 11.013-53.467 30.215c-2.365 3.4-1.526 8.075 1.874 10.44 3.404 2.366 8.077 1.525 10.442-1.874zm156.566-45.095c13.828 0 26.979-5.99 36.083-16.435 2.721-3.123 2.397-7.86-.727-10.582-3.123-2.723-7.859-2.397-10.582.726-6.253 7.175-15.283 11.29-24.774 11.29s-18.522-4.115-24.775-11.29c-2.723-3.123-7.46-3.448-10.582-.726-3.123 2.721-3.447 7.459-.727 10.582 9.105 10.445 22.256 16.435 36.084 16.435z' class='active-path'/></g></g> </svg> <br/> <br/> Упс... Что-то пошло не так... <br/>",
				FULL_SCREEN: "На весь экран",
				THUMBS: "Список",
				DOWNLOAD: "Скачать",
				SHARE: "Поделиться",
				ZOOM: "Масштаб"
			}
		}, //lppdef
		formDoneFailHTML: `
			<div class='gbox-content__form-done js-form-gallery-done'>
				<div class='gbox-content__form-done--content'>
					<div class='gbox-content__form-done--title'>Спасибо!</div>
					<div class='gbox-content__form-done--sub-title'>Ваша заявка успешно отправлена.</div>
					<div class='gbox-content__form-done--text'>Мы свяжемся с Вами для подтверждения и уточнения всех деталей</div>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 76 76" style="enable-background:new 0 0 76 76;" xml:space="preserve"><style type="text/css">.st0{fill:none;stroke:#4BB81D;stroke-width:5;stroke-linecap:round;stroke-miterlimit:10;}.st1{fill:none;stroke:#4BB81D;stroke-width:6;stroke-linecap:round;stroke-miterlimit:10;}</style><path class="st0" d="M72,38c0,18.8-15.2,34-34,34S4,56.8,4,38S19.2,4,38,4"/><path class="st1" d="M20,34l14.3,15.2c0.9,1,2.5,1,3.5,0L72,14"/></svg>
				</div>
			</div>
			<div class='gbox-content__form-fail js-form-gallery-fail'>
				<div class="gbox-content__form-fail--content">Oops! Что-то пошло не так. <br> Ошибка отправки формы. Пожалуйста, обновите страницу и попробуйте еще раз.
					<span class="gbox-content__form-fail--btn" onclick="location.reload(false);">Обновить</span>
				</div>
			</div>`,
		formAttr: [
			'action="#"',
			'method="POST"',
			'data-request="onSend"',
			'data-request-success="sendGalleryMsg(this);"',
			'data-request-error="noSendGalleryMsg(this);"',
			'class="gbox-content__form-body gbox-content__form-modal"',
			'data-metrika-goal="gallery-form"',
		],
		formSubTitle: 'Мы поможем рассчитать стоимость этого проекта, индивидуально для Вас!',
		formTitleBottom: 'Хотите такой же проект?',
		formSubTitle2: 'Укажите контактный номер для обратной связи и мы Вам перезвоним',

	};
	// Несколько полезных переменных и методов
	var $W = $(window);
	var $D = $(document);
	var called = 0;
	// Проверьте, является ли объект объектом jQuery, а не нативным объектом JavaScript
	var isQuery = function(obj) {
		return obj && obj.hasOwnProperty && obj instanceof $;
	};
	// Обрабатывать несколько браузеров для «requestAnimationFrame» и «cancelAnimationFrame»
	var requestAFrame = (function() {
		return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
			// if all else fails, use setTimeout
			function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			});
	})();
	var cancelAFrame = (function() {
		return (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
			window.clearTimeout(id);
		});
	})();
	// Определить поддерживаемое имя свойства конечного события перехода
	var transitionEnd = (function() {
		var el = document.createElement("fakeelement"),
			t;
		var transitions = {
			transition: "transitionend",
			OTransition: "oTransitionEnd",
			MozTransition: "transitionend",
			WebkitTransition: "webkitTransitionEnd"
		};
		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
		return "transitionend";
	})();
	// Принудительно перерисовать элемент. Это помогает в случаях, когда браузер неправильно перерисовывает обновленный элемент
	var forceRedraw = function($el) {
		return $el && $el.length && $el[0].offsetHeight;
	};
	// Исключить опции массива (`buttons`) из глубокого слияния
	var mergeOpts = function(opts1, opts2) {
		var rez = $.extend(true, {}, opts1, opts2);
		$.each(opts2, function(key, value) {
			if ($.isArray(value)) {
				rez[key] = value;
			}
		});
		return rez;
	};
	// Сколько элементов видно в окне просмотра
	var inViewport = function(elem) {
		var elemCenter, rez;
		if (!elem || elem.ownerDocument !== document) {return false;}
		$(".gbox-container").css("pointer-events", "none");
		elemCenter = {
			x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
			y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
		};
		rez = document.elementFromPoint(elemCenter.x, elemCenter.y) === elem;
		$(".gbox-container").css("pointer-events", "");
		return rez;
	};
	// Определение класса
	class Gbox {
		constructor(content, opts, index) {
			var self = this;
			self.opts = mergeOpts({
				index: index
			}, $.gbox.defaults);
			if ($.isPlainObject(opts)) {
				self.opts = mergeOpts(self.opts, opts);
			}
			if ($.gbox.isMobile) {
				self.opts = mergeOpts(self.opts, self.opts.mobile);
			}
			self.id = self.opts.id || ++called;
			self.currIndex = parseInt(self.opts.index, 10) || 0;
			self.prevIndex = null;
			self.prevPos = null;
			self.currPos = 0;
			self.firstRun = true;
			self.group = [];
			// Существующие слайды (для текущего, следующего и предыдущего элементов галереи)
			self.slides = {};
			// Создать элементы группы
			self.addContent(content);
			if (!self.group.length) {return;}
			self.init();
		}
	}
	$.extend(Gbox.prototype, {
		// Создать структуру DOM
		init: function() {
			var self = this,
				firstItem = self.group[self.currIndex],
				firstItemOpts = firstItem.opts,
				$container, buttonStr;
			if (firstItemOpts.closeExisting) {
				$.gbox.close(true);
			}
			// Hide scrollbars
			$("body").addClass("gbox-active");
			if (!$.gbox.getInstance() && firstItemOpts.hideScrollbar !== false && $.gbox.isMobile && document.body.scrollHeight > window.innerHeight) {
				$("head").append('<style id="gbox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (window.innerWidth - document.documentElement.clientWidth) + "px;}</style>");
				$("body").addClass("compensate-for-scrollbar");
			}
			// Build html markup and set references Build html code for buttons and insert into main template
			buttonStr = "";
			$.each(firstItemOpts.buttons, function(index, value) {
				buttonStr += firstItemOpts.btnTpl[value] || "";
			});
			// Create markup from base template, it will be initially hidden to avoid unnecessary work like painting while initializing is not complete
			$container = $(self.translate(self, firstItemOpts.baseTpl.replace("{{buttons}}", buttonStr).replace("{{arrows}}", firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight))).attr("id", "gbox-container-" + self.id).addClass(firstItemOpts.baseClass).data("gbox", self).appendTo(firstItemOpts.parentEl);
			// Create object holding references to jQuery wrapped nodes
			self.$refs = {
				container: $container
			};
			["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function(item) {
				self.$refs[item] = $container.find(".gbox-" + item);
			});
			self.trigger("onInit");
			// Enable events, deactive previous instances
			self.activate();
			// Build slides, load and reveal content
			self.jumpTo(self.currIndex);
			if (self.current.opts.opacity_overflow) {
				self.$refs.container.addClass('gbox-slide--overflow');
			}
		}, // Simple i18n support - replaces object keys found in template with corresponding values
		translate: function(obj, str) {
			var arr = obj.opts.i18n[obj.opts.lang] || obj.opts.i18n.en;
			return str.replace(/\{\{(\w+)\}\}/g, function(match, n) {
				return arr[n] === undefined ? match : arr[n];
			});
		}, // Populate current group with fresh content. Check if each object has valid type and content
		addContent: function(content) {
			var self = this,
				items = $.makeArray(content),
				thumbs;
			$.each(items, function(i, item) {
				var obj = {},
					opts = {},
					$item, type, found, src, srcParts;
				// Step 1 - Make sure we have an object
				if ($.isPlainObject(item)) {
					// We probably have manual usage here, something like $.gbox.open( [ { src : "image.jpg", type : "image" } ] )
					obj = item;
					opts = item.opts || item;
				} else if ($.type(item) === "object" && $(item).length) {
					// Here we probably have jQuery collection returned by some selector
					$item = $(item);
					// Support attributes like `data-options='{"touch" : false}'` and `data-touch='false'`
					opts = $item.data() || {};
					opts = $.extend(true, {}, opts, opts.options);
					// Здесь мы храним нажатый элемент
					opts.$orig = $item;
					obj.src = self.opts.src || opts.src || $item.attr("href");
					// Assume that simple syntax is used, for example: `$.gbox.open( $("#test"), {} );`
					if (!obj.type && !obj.src) {
						obj.type = "inline";
						obj.src = item;
					}
				} else {
					// Assume we have a simple html code, for example: $.gbox.open( '<div><h1>Hi!</h1></div>' );
					obj = {
						type: "html",
						src: item + ""
					};
				}
				// Each gallery object has full collection of options
				obj.opts = $.extend(true, {}, self.opts, opts);
				// Do not merge buttons array
				if ($.isArray(opts.buttons)) {
					obj.opts.buttons = opts.buttons;
				}
				if ($.gbox.isMobile && obj.opts.mobile) {
					obj.opts = mergeOpts(obj.opts, obj.opts.mobile);
				}
				// Step 2 - Make sure we have content type, if not - try to guess
				type = obj.type || obj.opts.type;
				src = obj.src || "";
				if (!type && src) {
					if ((found = src.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))) {
						type = "video";
						if (!obj.opts.video.format) {
							obj.opts.video.format = "video/" + (found[1] === "ogv" ? "ogg" : found[1]);
						}
					} else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
						type = "image";
					} else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
						type = "iframe";
						obj = $.extend(true, obj, {
							contentType: "pdf",
							opts: {
								iframe: {
									preload: false
								}
							}
						});
					} else if (src.charAt(0) === "#") {
						type = "inline";
					}
				}
				if (type) {
					obj.type = type;
				} else {
					self.trigger("objectNeedsType", obj);
				}
				if (!obj.contentType) {
					obj.contentType = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1 ? "html" : obj.type;
				}
				// Step 3 - Some adjustments
				obj.index = self.group.length;
				if (obj.opts.smallBtn == "auto") {
					obj.opts.smallBtn = $.inArray(obj.type, ["html", "inline", "ajax"]) > -1;
				}
				if (obj.opts.toolbar === "auto") {
					obj.opts.toolbar = !obj.opts.smallBtn;
				}
				// Find thumbnail image, check if exists and if is in the viewport
				obj.$thumb = obj.opts.$thumb || null;
				if (obj.opts.$trigger && obj.index === self.opts.index) {
					obj.$thumb = obj.opts.$trigger.find("img:first");
					if (obj.$thumb.length) {
						obj.opts.$orig = obj.opts.$trigger;
					}
				}
				if (!(obj.$thumb && obj.$thumb.length) && obj.opts.$orig) {
					obj.$thumb = obj.opts.$orig.find("img:first");
				}
				if (obj.$thumb && !obj.$thumb.length) {
					obj.$thumb = null;
				}
				obj.thumb = obj.opts.thumb || (obj.$thumb ? obj.$thumb[0].src : null);
				// «caption» - это «специальный» параметр, его можно использовать для настройки заголовка для каждого элемента галереи.
				if ($.type(obj.opts.caption) === "function") {
					obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
				}
				if ($.type(self.opts.caption) === "function") {
					obj.opts.caption = self.opts.caption.apply(item, [self, obj]);
				}
				// Make sure we have caption as a string or jQuery object
				if (!(obj.opts.caption instanceof $)) {
					obj.opts.caption = obj.opts.caption === undefined ? "" : obj.opts.caption + "";
				}
				// data-form lpp0
				if (!obj.opts.form_btn || obj.opts.form_btn == "") {
					obj.opts.form_btn = "Заказать"
				};
				if (!obj.opts.personal_url || obj.opts.personal_url == "") {
					obj.opts.personal_url = "../../personal"
				};
				if (!obj.opts.form_btn_send || obj.opts.form_btn_send == "") {
					obj.opts.form_btn_send = "Отправить заявку"
				};
				if (!obj.opts.formtype || obj.opts.formtype == "") {
					obj.opts.formtype = "button"
				};
				if (obj.opts.form == "") {
					obj.opts.form = "Затрудняетесь с выбором?"
				};
				if (!obj.opts.m_caption) {
					obj.opts.m_caption = ""
				};
				if (!obj.opts.price) {
					obj.opts.price = ""
				};
				// Check if url contains "filter" used to filter the content. Example: "ajax.html #something"
				if (obj.type === "ajax") {
					srcParts = src.split(/\s+/, 2);
					if (srcParts.length > 1) {
						obj.src = srcParts.shift();
						obj.opts.filter = srcParts.shift();
					}
				}
				// Hide all buttons and disable interactivity for modal items
				if (obj.opts.modal) {
					obj.opts = $.extend(true, obj.opts, {
						trapFocus: true, // Remove buttons
						infobar: 0,
						toolbar: 0,
						smallBtn: 0, // Disable keyboard navigation
						keyboard: 0, // Disable some modules
						fullScreen: 0,
						thumbs: 0,
						touch: 0, // Disable click event handlers
						clickContent: false,
						clickSlide: false,
						clickOutside: false,
						dblclickContent: false,
						dblclickSlide: false,
						dblclickOutside: false
					});
				}
				// Step 4 - Add processed object to group
				self.group.push(obj);
			});
			// Update controls if gallery is already opened
			if (Object.keys(self.slides).length) {
				self.updateControls();
				// Update thumbnails, if needed
				thumbs = self.Thumbs;
				if (thumbs && thumbs.isActive) {
					thumbs.create();
					thumbs.focus();
				}
			}
		}, // Прикрепите функции обработчика событий для:
		// - navigation buttons
		// - browser scrolling, resizing;
		// - focusing
		// - keyboard
		// - detecting inactivity
		addEvents: function() {
			var self = this;
			self.removeEvents();
			// Make navigation elements clickable
			self.$refs.container.on("click.fb-close", "[data-gbox-close]", function(e) {
				e.stopPropagation();
				e.preventDefault();
				self.close(e);
			}).on("touchstart.fb-prev click.fb-prev", "[data-gbox-prev]", function(e) {
				e.stopPropagation();
				e.preventDefault();
				self.previous();
			}).on("touchstart.fb-next click.fb-next", "[data-gbox-next]", function(e) {
				e.stopPropagation();
				e.preventDefault();
				self.next();
			}).on("click.fb", "[data-gbox-zoom]", function(e) {
				// Click handler for zoom button
				self[self.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
			});
			// Handle page scrolling and browser resizing
			$W.on("orientationchange.fb resize.fb", function(e) {
				if (e && e.originalEvent && e.originalEvent.type === "resize") {
					if (self.requestId) {
						cancelAFrame(self.requestId);
					}
					self.requestId = requestAFrame(function() {
						self.update(e);
					});
				} else {
					if (self.current && self.current.type === "iframe") {
						self.$refs.stage.hide();
					}
					setTimeout(function() {
						self.$refs.stage.show();
						self.update(e);
					}, $.gbox.isMobile ? 600 : 250);
				}
			});
			$D.on("keydown.fb", function(e) {
				var instance = $.gbox ? $.gbox.getInstance() : null,
					current = instance.current,
					keycode = e.keyCode || e.which;
				if (keycode == 9) {				// Trap keyboard focus inside of the modal
					if (current.opts.trapFocus) {
						self.focus(e);
					}
					return;
				}
				// Enable keyboard navigation
				if (!current.opts.keyboard || e.ctrlKey || e.altKey || e.shiftKey || $(e.target).is("input,textarea,video,audio,select")) {return;}
				if (keycode === 8 || keycode === 27) {				// Backspace and Esc keys
					e.preventDefault();
					self.close(e);
					return;
				}
				if (keycode === 37 || keycode === 38) {				// Left arrow and Up arrow
					e.preventDefault();
					self.previous();
					return;
				}
				if (keycode === 39 || keycode === 40) {				// Righ arrow and Down arrow
					e.preventDefault();
					self.next();
					return;
				}
				self.trigger("afterKeydown", e, keycode);
			});
			// Hide controls after some inactivity period
			if (self.group[self.currIndex].opts.idleTime) {
				self.idleSecondsCounter = 0;
				$D.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function(e) {
					self.idleSecondsCounter = 0;
					if (self.isIdle) {
						self.showControls();
					}
					self.isIdle = false;
				});
				self.idleInterval = window.setInterval(function() {
					self.idleSecondsCounter++;
					if (self.idleSecondsCounter >= self.group[self.currIndex].opts.idleTime && !self.isDragging) {
						self.isIdle = true;
						self.idleSecondsCounter = 0;
						self.hideControls();
					}
				}, 1000);
			}
		}, // Remove events added by the core
		removeEvents: function() {
			var self = this;
			$W.off("orientationchange.fb resize.fb");
			$D.off("keydown.fb .fb-idle");
			this.$refs.container.off(".fb-close .fb-prev .fb-next");
			if (self.idleInterval) {
				window.clearInterval(self.idleInterval);
				self.idleInterval = null;
			}
		}, // Change to previous gallery item
		previous: function(duration) {
			return this.jumpTo(this.currPos - 1, duration);
		}, // Change to next gallery item
		next: function(duration) {
			return this.jumpTo(this.currPos + 1, duration);
		}, // Switch to selected gallery item
		jumpTo: function(pos, duration) {
			var self = this,
				groupLen = self.group.length,
				firstRun, isMoved, loop, current, previous, slidePos, stagePos, prop, diff;
			if (self.isDragging || self.isClosing || (self.isAnimating && self.firstRun)) {return;}
			// Should loop?
			pos = parseInt(pos, 10);
			loop = self.current ? self.current.opts.loop : self.opts.loop;
			if (!loop && (pos < 0 || pos >= groupLen)) {return false;}
			// Check if opening for the first time; this helps to speed things up
			firstRun = self.firstRun = !Object.keys(self.slides).length;
			// Create slides
			previous = self.current;
			self.prevIndex = self.currIndex;
			self.prevPos = self.currPos;
			current = self.createSlide(pos);
			if (groupLen > 1) {
				if (loop || current.index < groupLen - 1) {
					self.createSlide(pos + 1);
				}
				if (loop || current.index > 0) {
					self.createSlide(pos - 1);
				}
			}
			self.current = current;
			self.currIndex = current.index;
			self.currPos = current.pos;
			self.trigger("beforeShow", firstRun);
			self.updateControls();
			// Validate duration length
			current.forcedDuration = undefined;
			if ($.isNumeric(duration)) {
				current.forcedDuration = duration;
			} else {
				duration = current.opts[firstRun ? "animationDuration" : "transitionDuration"];
			}
			duration = parseInt(duration, 10);
			// Check if user has swiped the slides or if still animating
			isMoved = self.isMoved(current);
			// Make sure current slide is visible
			current.$slide.addClass("gbox-slide--current");
			// Fresh start - reveal container, current slide and start loading content
			if (firstRun) {
				if (current.opts.animationEffect && duration) {
					self.$refs.container.css("transition-duration", duration + "ms");
				}
				self.$refs.container.addClass("gbox-is-open").trigger("focus");
				// Attempt to load content into slide. This will later call `afterLoad` -> `revealContent`
				self.loadSlide(current);
				self.preload("image");
				return;
			}
			// Get actual slide/stage positions (before cleaning up)
			slidePos = $.gbox.getTranslate(previous.$slide);
			stagePos = $.gbox.getTranslate(self.$refs.stage);
			// Clean up all slides
			$.each(self.slides, function(index, slide) {
				$.gbox.stop(slide.$slide, true);
			});
			if (previous.pos !== current.pos) {
				previous.isComplete = false;
			}
			previous.$slide.removeClass("gbox-slide--complete gbox-slide--current");
			//lpp4
			if (previous.opts.form) {
				if (previous.opts.formtype == 'fixed-stick') {
					previous.$forms.removeClass("gbox-active");
					previous.$forms_btn.removeClass("gbox-active");
				}
				if (previous.opts.formtype == 'fixed' || previous.opts.formtype == 'fixed-left') {
					previous.$forms.removeClass('gbox-hide-form');
				}
			}
			// If slides are out of place, then animate them to correct position
			if (isMoved) {
				// Calculate horizontal swipe distance
				diff = slidePos.left - (previous.pos * slidePos.width + previous.pos * previous.opts.gutter);
				$.each(self.slides, function(index, slide) {
					slide.$slide.removeClass("gbox-animated").removeClass(function(index, className) {
						return (className.match(/(^|\s)gbox-fx-\S+/g) || []).join(" ");
					});
					// Make sure that each slide is in equal distance
					// This is mostly needed for freshly added slides, because they are not yet positioned
					var leftPos = slide.pos * slidePos.width + slide.pos * slide.opts.gutter;
					$.gbox.setTranslate(slide.$slide, {
						top: 0,
						left: leftPos - stagePos.left + diff
					});
					if (slide.pos !== current.pos) {
						slide.$slide.addClass("gbox-slide--" + (slide.pos > current.pos ? "next" : "previous"));
					}
					// Redraw to make sure that transition will start
					forceRedraw(slide.$slide);
					// Animate the slide
					$.gbox.animate(slide.$slide, {
						top: 0,
						left: (slide.pos - current.pos) * slidePos.width + (slide.pos - current.pos) * slide.opts.gutter
					}, duration, function() {
						slide.$slide.css({
							transform: "",
							opacity: ""
						}).removeClass("gbox-slide--next gbox-slide--previous");
						if (slide.pos === self.currPos) {
							self.complete();
						}
					});
				});
			} else if (duration && current.opts.transitionEffect) {
				// Set transition effect for previously active slide
				prop = "gbox-animated gbox-fx-" + current.opts.transitionEffect;
				previous.$slide.addClass("gbox-slide--" + (previous.pos > current.pos ? "next" : "previous"));
				$.gbox.animate(previous.$slide, prop, duration, function() {
					previous.$slide.removeClass(prop).removeClass("gbox-slide--next gbox-slide--previous");
				}, false);
			}
			if (current.isLoaded) {
				self.revealContent(current);
			} else {
				self.loadSlide(current);
			}
			self.preload("image");
		}, // Create new "slide" element. These are gallery itemsthat are actually added to DOM
		createSlide: function(pos) {
			var self = this,
				$slide, index;
			index = pos % self.group.length;
			index = index < 0 ? self.group.length + index : index;
			if (!self.slides[pos] && self.group[index]) {
				$slide = $('<div class="gbox-slide"></div>').appendTo(self.$refs.stage);
				self.slides[pos] = $.extend(true, {}, self.group[index], {
					pos: pos,
					$slide: $slide,
					isLoaded: false
				});
				self.updateSlide(self.slides[pos]);
			}
			return self.slides[pos];
		}, // Scale image to the actual size of the image; x and y values should be relative to the slide
		scaleToActual: function(x, y, duration) {
			var self = this,
				current = self.current,
				$content = current.$content,
				canvasWidth = $.gbox.getTranslate(current.$slide).width,
				canvasHeight = $.gbox.getTranslate(current.$slide).height,
				newImgWidth = current.width,
				newImgHeight = current.height,
				imgPos, posX, posY, scaleX, scaleY;
			if (self.isAnimating || self.isMoved() || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
				return
			}
			self.isAnimating = true;
			$.gbox.stop($content);
			x = x === undefined ? canvasWidth * 0.5 : x;
			y = y === undefined ? canvasHeight * 0.5 : y;
			imgPos = $.gbox.getTranslate($content);
			imgPos.top -= $.gbox.getTranslate(current.$slide).top;
			imgPos.left -= $.gbox.getTranslate(current.$slide).left;
			scaleX = newImgWidth / imgPos.width;
			scaleY = newImgHeight / imgPos.height;
			// Get center position for original image
			posX = canvasWidth * 0.5 - newImgWidth * 0.5;
			posY = canvasHeight * 0.5 - newImgHeight * 0.5;
			// Make sure image does not move away from edges
			if (newImgWidth > canvasWidth) {
				posX = imgPos.left * scaleX - (x * scaleX - x);
				if (posX > 0) {
					posX = 0;
				}
				if (posX < canvasWidth - newImgWidth) {
					posX = canvasWidth - newImgWidth;
				}
			}
			if (newImgHeight > canvasHeight) {
				posY = imgPos.top * scaleY - (y * scaleY - y);
				if (posY > 0) {
					posY = 0;
				}
				if (posY < canvasHeight - newImgHeight) {
					posY = canvasHeight - newImgHeight;
				}
			}
			self.updateCursor(newImgWidth, newImgHeight);
			$.gbox.animate($content, {
				top: posY,
				left: posX,
				scaleX: scaleX,
				scaleY: scaleY
			}, duration || 366, function() {
				self.isAnimating = false;
			});
			//lppz
			if (self.current.opts.form && self.current.opts.formtype == "fixed") {
				self.$refs.toolbar.removeClass("gbox-slide--toolbar-right");
				self.$refs.navigation.removeClass("gbox-slide--navigation-right");
				self.current.$forms.addClass('gbox-hide-form');
			}
			if (self.current.opts.form && self.current.opts.formtype == "fixed-left") {
				self.$refs.navigation.removeClass("gbox-slide--navigation-left");
				self.$refs.infobar.removeClass("gbox-slide--infobar-left");
				self.current.$forms.addClass('gbox-hide-form');
			}
			if (self.current.opts.form && self.current.opts.formtype == "fixed-stick") {
				self.$refs.toolbar.removeClass("gbox-slide--toolbar-right");
				self.$refs.navigation.removeClass("gbox-slide--navigation-right");
				self.current.$slide.removeClass("gbox-slide--form-fixed");
				self.current.$forms.removeClass('gbox-active');
				self.current.$forms_btn.removeClass('gbox-active');
			}
		}, // Scale image to fit inside parent element
		scaleToFit: function(duration) {
			var self = this,
				current = self.current,
				$content = current.$content,
				end;
			if (self.current.opts.form && self.current.opts.formtype == "fixed") {
				self.current.$slide.addClass("gbox-slide--form-fixed");
				self.$refs.toolbar.addClass("gbox-slide--toolbar-right");
				self.$refs.navigation.addClass("gbox-slide--navigation-right");
				self.current.$forms.removeClass('gbox-hide-form');
			};
			if (self.current.opts.form && self.current.opts.formtype == "fixed-left") {
				self.$refs.navigation.addClass("gbox-slide--navigation-left");
				self.$refs.infobar.addClass("gbox-slide--infobar-left");
				self.current.$forms.removeClass('gbox-hide-form');
			}
			if (self.isAnimating || self.isMoved() || !$content || !(current.type == "image" && current.isLoaded && !current.hasError)) {
				return
			}
			self.isAnimating = true;
			$.gbox.stop($content);
			end = self.getFitPos(current);
			self.updateCursor(end.width, end.height);
			$.gbox.animate($content, {
				top: end.top,
				left: end.left,
				scaleX: end.width / $content.width(),
				scaleY: end.height / $content.height()
			}, duration || 366, function() {
				self.isAnimating = false;
			});
		}, // Calculate image size to fit inside viewport
		getFitPos: function(slide) {
			var self = this,
				$content = slide.$content,
				$slide = slide.$slide,
				width = slide.width || slide.opts.width,
				height = slide.height || slide.opts.height,
				maxWidth, maxHeight, minRatio, aspectRatio, rez = {};
			if (!slide.isLoaded || !$content || !$content.length) {
				return false
			}
			maxWidth = $.gbox.getTranslate(self.$refs.stage).width;
			maxHeight = $.gbox.getTranslate(self.$refs.stage).height;
			maxWidth -= parseFloat($slide.css("paddingLeft")) + parseFloat($slide.css("paddingRight")) + parseFloat($content.css("marginLeft")) + parseFloat($content.css("marginRight"));
			maxHeight -= parseFloat($slide.css("paddingTop")) + parseFloat($slide.css("paddingBottom")) + parseFloat($content.css("marginTop")) + parseFloat($content.css("marginBottom"));
			if (!width || !height) {
				width = maxWidth;
				height = maxHeight;
			}
			minRatio = Math.min(1, maxWidth / width, maxHeight / height);
			width = minRatio * width;
			height = minRatio * height;
			// Adjust width/height to precisely fit into container
			if (width > maxWidth - 0.5) {
				width = maxWidth;
			}
			if (height > maxHeight - 0.5) {
				height = maxHeight;
			}
			if (slide.type === "image") {
				rez.top = Math.floor((maxHeight - height) * 0.5) + parseFloat($slide.css("paddingTop"));
				rez.left = Math.floor((maxWidth - width) * 0.5) + parseFloat($slide.css("paddingLeft"));
			} else if (slide.contentType === "video") {
				// Force aspect ratio for the video
				// "I say the whole world must learn of our peaceful ways… by force!"
				aspectRatio = slide.opts.width && slide.opts.height ? width / height : slide.opts.ratio || 16 / 9;
				if (height > width / aspectRatio) {
					height = width / aspectRatio;
				} else if (width > height * aspectRatio) {
					width = height * aspectRatio;
				}
			}
			rez.width = width;
			rez.height = height;
			return rez;
		}, // Update content size and position for all slides
		update: function(e) {
			var self = this;
			$.each(self.slides, function(key, slide) {
				self.updateSlide(slide, e);
				//lpp5
				if ($.gbox.getInstance().current.opts.form) {
					if ($.gbox.getInstance().current.opts.formtype == "fixed" && $.gbox.getInstance().current.$forms.hasClass('gbox-hide-form')) {
						$.gbox.getInstance().current.$slide.addClass("gbox-slide--form-fixed");
						$.gbox.getInstance().$refs.toolbar.addClass("gbox-slide--toolbar-right");
						$.gbox.getInstance().$refs.navigation.addClass("gbox-slide--navigation-right");
						$.gbox.getInstance().current.$forms.removeClass('gbox-hide-form');
					}
					if ($.gbox.getInstance().current.opts.formtype == "fixed-left" && $.gbox.getInstance().current.$forms.hasClass('gbox-hide-form')) {
						$.gbox.getInstance().$refs.infobar.addClass("gbox-slide--infobar-left");
						$.gbox.getInstance().$refs.navigation.addClass("gbox-slide--navigation-left");
						$.gbox.getInstance().current.$forms.removeClass('gbox-hide-form');
					}
				}
			});
		}, // Update slide content position and size
		updateSlide: function(slide, e) {
			var self = this,
				$content = slide && slide.$content,
				width = slide.width || slide.opts.width,
				height = slide.height || slide.opts.height,
				$slide = slide.$slide;
			// First, prevent caption overlap, if needed
			self.adjustCaption(slide);
			// Then resize content to fit inside the slide
			if ($content && (width || height || slide.contentType === "video") && !slide.hasError) {
				$.gbox.stop($content);
				$.gbox.setTranslate($content, self.getFitPos(slide));
				if (slide.pos === self.currPos) {
					self.isAnimating = false;
					self.updateCursor();
				}
			}
			// Then some adjustments
			self.adjustLayout(slide);
			if ($slide.length) {
				$slide.trigger("refresh");
				if (slide.pos === self.currPos) {
					self.$refs.toolbar.add(self.$refs.navigation.find(".gbox-button--arrow_right")).toggleClass("compensate-for-scrollbar", $slide.get(0).scrollHeight > $slide.get(0).clientHeight);
				}
			}
			self.trigger("onUpdate", slide, e);
		}, // Horizontally center slide
		centerSlide: function(duration) {
			var self = this,
				current = self.current,
				$slide = current.$slide;
			if (self.isClosing || !current) {return;}
			$slide.siblings().css({
				transform: "",
				opacity: ""
			});
			$slide.parent().children().removeClass("gbox-slide--previous gbox-slide--next");
			$.gbox.animate($slide, {
				top: 0,
				left: 0,
				opacity: 1
			}, duration === undefined ? 0 : duration, function() {
				// Clean up
				$slide.css({
					transform: "",
					opacity: ""
				});
				if (!current.isComplete) {
					self.complete();
				}
			}, false);
		}, // Check if current slide is moved (swiped)
		isMoved: function(slide) {
			var current = slide || this.current,
				slidePos, stagePos;
			if (!current) {return false;}
			stagePos = $.gbox.getTranslate(this.$refs.stage);
			slidePos = $.gbox.getTranslate(current.$slide);
			return (!current.$slide.hasClass("gbox-animated") && (Math.abs(slidePos.top - stagePos.top) > 0.5 || Math.abs(slidePos.left - stagePos.left) > 0.5));
		}, // Update cursor style depending if content can be zoomed
		updateCursor: function(nextWidth, nextHeight) {
			var self = this,
				current = self.current,
				$container = self.$refs.container,
				canPan, isZoomable;
			if (!current || self.isClosing || !self.Guestures) {return;}
			$container.removeClass("gbox-is-zoomable gbox-can-zoomIn gbox-can-zoomOut gbox-can-swipe gbox-can-pan");
			canPan = self.canPan(nextWidth, nextHeight);
			isZoomable = canPan ? true : self.isZoomable();
			$container.toggleClass("gbox-is-zoomable", isZoomable);
			$("[data-gbox-zoom]").prop("disabled", !isZoomable);
			if (canPan) {
				$container.addClass("gbox-can-pan");
			} else if (isZoomable && (current.opts.clickContent === "zoom" || ($.isFunction(current.opts.clickContent) && current.opts.clickContent(current) == "zoom"))) {
				$container.addClass("gbox-can-zoomIn");
			} else if (current.opts.touch && (current.opts.touch.vertical || self.group.length > 1) && current.contentType !== "video") {
				$container.addClass("gbox-can-swipe");
			}
		}, // Check if current slide is zoomable
		isZoomable: function() {
			var self = this,
				current = self.current,
				fitPos;
			// Assume that slide is zoomable if:
			// - image is still loading
			// - actual size of the image is smaller than available area
			if (current && !self.isClosing && current.type === "image" && !current.hasError) {
				if (!current.isLoaded) {return true;}
				fitPos = self.getFitPos(current);
				if (fitPos && (current.width > fitPos.width || current.height > fitPos.height)) {return true;}
			}
			return false;
		}, // Check if current image dimensions are smaller than actual
		isScaledDown: function(nextWidth, nextHeight) {
			var self = this,
				rez = false,
				current = self.current,
				$content = current.$content;
			if (nextWidth !== undefined && nextHeight !== undefined) {
				rez = nextWidth < current.width && nextHeight < current.height;
			} else if ($content) {
				rez = $.gbox.getTranslate($content);
				rez = rez.width < current.width && rez.height < current.height;
			}
			return rez;
		}, // Check if image dimensions exceed parent element
		canPan: function(nextWidth, nextHeight) {
			var self = this,
				current = self.current,
				pos = null,
				rez = false;
			if (current.type === "image" && (current.isComplete || (nextWidth && nextHeight)) && !current.hasError) {
				rez = self.getFitPos(current);
				if (nextWidth !== undefined && nextHeight !== undefined) {
					pos = {
						width: nextWidth,
						height: nextHeight
					};
				} else if (current.isComplete) {
					pos = $.gbox.getTranslate(current.$content);
				}
				if (pos && rez) {
					rez = Math.abs(pos.width - rez.width) > 1.5 || Math.abs(pos.height - rez.height) > 1.5;
				}
			}
			return rez;
		}, // Load content into the slide
		loadSlide: function(slide) {
			var self = this,
				type, $slide, ajaxLoad;
			if (slide.isLoading || slide.isLoaded) {return;}
			slide.isLoading = true;
			if (self.trigger("beforeLoad", slide) === false) {
				slide.isLoading = false;
				return false;
			}
			type = slide.type;
			$slide = slide.$slide;
			$slide.off("refresh").trigger("onReset").addClass(slide.opts.slideClass);
			// Create content depending on the type
			switch (type) {
				case "image":
					self.setImage(slide);
					break;
				case "iframe":
					self.setIframe(slide);
					break;
				case "html":
					self.setContent(slide, slide.src || slide.content);
					break;
				case "video":
					self.setContent(slide, slide.opts.video.tpl.replace(/\{\{src\}\}/gi, slide.src).replace("{{format}}", slide.opts.videoFormat || slide.opts.video.format || "").replace("{{poster}}", slide.thumb || ""));
					break;
				case "inline":
					if ($(slide.src).length) {
						self.setContent(slide, $(slide.src));
					} else {
						self.setError(slide);
					}
					break;
				case "ajax":
					self.showLoading(slide);
					ajaxLoad = $.ajax($.extend({}, slide.opts.ajax.settings, {
						url: slide.src,
						success: function(data, textStatus) {
							if (textStatus === "success") {
								self.setContent(slide, data);
							}
						},
						error: function(jqXHR, textStatus) {
							if (jqXHR && textStatus !== "abort") {
								self.setError(slide);
							}
						}
					}));
					$slide.one("onReset", function() {
						ajaxLoad.abort();
					});
					break;
				default:
					self.setError(slide);
					break;
			}
			return true;
		}, // Use thumbnail image, if possible
		setImage: function(slide) {
			var self = this,
				ghost;
			// Check if need to show loading icon
			setTimeout(function() {
				var $img = slide.$image;
				if (!self.isClosing && slide.isLoading && (!$img || !$img.length || !$img[0].complete) && !slide.hasError) {
					self.showLoading(slide);
				}
			}, 50);
			//Проверьте, есть ли у изображения srcset
			self.checkSrcset(slide);
			// Это будет оболочка, содержащая как призрак, так и реальное изображение.
			slide.$content = $('<div class="gbox-content"></div>').addClass("gbox-is-hidden").appendTo(slide.$slide.addClass("gbox-slide--image"));

			// lpp1
			//console.log(self);
			if (slide.opts.form) {
				let getPhone = function() {
					if (slide.opts.phone) {
						return `<span class="gbox-content__form-tel--text">Или позвоните по номеру</span>
							<a href="tel:8${String(slide.opts.phone).replace(/\D/g, '')}" class="callibri-phone" class="gbox-content__form-tel--number">+7 ${slide.opts.phone}</a>`
					} else return '';
				};
				slide.$forms = $(`
					<form ${self.opts.formAttr.join(' ')} id="gbox-modal${slide.index}">${self.opts.formDoneFailHTML}
						<div class="gbox-content__form-title">${slide.opts.form}</div>
						<div class="gbox-content__form-sub-title">${self.opts.formSubTitle}</div>
						<div class="gbox-content__form-price">${slide.opts.price}</div>
						<div class="gbox-content__form-title-v2">${self.opts.formTitleBottom}</div>
						<div class="gbox-content__form-sub-title-v2">${self.opts.formSubTitle2}</div>
						<input type="hidden" name="Форма" value="Галлерея фото">
						<input type="hidden" name="URL фотографии" value="${window.location.origin}${window.location.pathname}#${self.currentHash}"></input>
						<div class="gbox-content__form-inputs">
							<span class="gbox-content__form-inputs--placeholder js-gbox-placeholder">Ваше имя</span>
							<input autocomplete="off" type="text" title="Ваше имя" name="Имя">
							<div class="gbox-content__form-input-icon"><svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg"><path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/><path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/></svg></div>
						</div>
						<div class="gbox-content__form-inputs input-required">
							<span class="gbox-content__form-inputs--placeholder gbox-content__form-inputs--placeholder-hidden js-gbox-placeholder">Номер телефона</span>
							<input autocomplete="off" type="tel" required="" title="Номер телефона" name="Телефон" pattern="[+][7][ ][(][0-9]{3,4}[)][ ][0-9]{2,3}[-][0-9]{2}[-][0-9]{2}" placeholder="+7 (XXX) XXX XX-XX" class="js-gbox-tel">
							<div class="gbox-content__form-input-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 513.64 513.64" style="enable-background:new 0 0 513.64 513.64;" xml:space="preserve"><path d="M499.66,376.96l-71.68-71.68c-25.6-25.6-69.12-15.359-79.36,17.92c-7.68,23.041-33.28,35.841-56.32,30.72c-51.2-12.8-120.32-79.36-133.12-133.12c-7.68-23.041,7.68-48.641,30.72-56.32c33.28-10.24,43.52-53.76,17.92-79.36l-71.68-71.68c-20.48-17.92-51.2-17.92-69.12,0l-48.64,48.64c-48.64,51.2,5.12,186.88,125.44,307.2c120.32,120.32,256,176.641,307.2,125.44l48.64-48.64C517.581,425.6,517.581,394.88,499.66,376.96z"/></svg></div>
						</div>
						<button type="submit" class="gbox-content__form-btn">${slide.opts.form_btn_send}</button>
						<div class="gbox-content__form-tel">${getPhone()}</div>
						<span class="gbox-content__form-personal-data">Нажимая на кнопку, я даю свое согласие на <a href="${slide.opts.personal_url}" title="согласие на обработку персональных данных" target="_blank">обработку персональных данных</a></span>
					</form>`).appendTo(slide.$slide);
				self.refreshFormMask();
			}
			if (slide.opts.form && (slide.opts.formtype == 'fixed' || slide.opts.formtype == 'fixed-left')) {
				slide.$slide.addClass("gbox-slide--form-fixed");
				slide.$forms.removeClass("gbox-content__form-modal").addClass("gbox-content__form-fixed");
				if (slide.opts.formtype == 'fixed-left') {
					slide.$slide.addClass("gbox-slide--form-fixed--left");
					slide.$forms.addClass("gbox-content__form-fixed--left");
				}
			}
			if (slide.opts.form && slide.opts.formtype == 'fixed-stick') {
				slide.$forms.removeClass("gbox-content__form-modal").removeClass("gbox-content__form-fixed").addClass("gbox-content__form-fixed-stick");
				$('<button data-gbox="#skip" type="button" class="gbox-content__close-form-slick-btn" title="Закрыть"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg></button>').appendTo(slide.$forms);
				slide.$forms_btn = $(`<span data-gbox="#skip" data-skip="1" data-src="#modal${slide.index}" data-touch="0" class="gbox-content__open-form-slick-btn">${slide.opts.form_btn}<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="638.062px" height="638.062px" viewBox="0 0 638.062 638.062" style="enable-background:new 0 0 638.062 638.062;" xml:space="preserve"><path d="M303.4,319.03c0.585-7.521-1.701-15.203-7.469-20.944L58.786,61.339c-10.472-10.445-27.43-10.445-37.902,0c-10.473,10.446-10.473,27.378,0,37.85L241.098,319.03L20.884,538.872c-10.473,10.445-10.473,27.377,0,37.823c10.473,10.445,27.431,10.445,37.902,0l237.146-236.747C301.699,334.207,303.959,326.553,303.4,319.03z M617.521,298.086L326.765,7.834c-10.473-10.445-27.431-10.445-37.903,0c-10.473,10.446-10.473,27.404,0,37.823L562.687,319.03L288.861,592.377c-10.473,10.446-10.473,27.377,0,37.85c10.473,10.446,27.431,10.446,37.903,0l290.729-290.251c5.768-5.741,8.027-13.423,7.442-20.945C625.548,311.509,623.262,303.827,617.521,298.086z"/></svg></span>`).appendTo(slide.$slide);
			}

			// Если у нас есть миниатюра, мы можем отображать ее, пока загружается фактическое изображение.
			// Пользователи не будут смотреть на черный экран, и фактическое изображение будет появляться постепенно.
			if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && slide.thumb) {
				slide.width = slide.opts.width;
				slide.height = slide.opts.height;
				ghost = document.createElement("img");
				ghost.onerror = function() {
					$(this).remove();
					slide.$ghost = null;
				};
				ghost.onload = function() {
					self.afterLoad(slide);
				};
				slide.$ghost = $(ghost).addClass("gbox-image").appendTo(slide.$content).attr("src", slide.thumb);
			}
			// Start loading actual image
			self.setBigImage(slide);
		}, // Check if image has srcset and get the source
		checkSrcset: function(slide) {
			var srcset = slide.opts.srcset || slide.opts.image.srcset,
				found, temp, pxRatio, windowWidth;
			// If we have "srcset", then we need to find first matching "src" value.
			// This is necessary, because when you set an src attribute, the browser will preload the image
			// before any javascript or even CSS is applied.
			if (srcset) {
				pxRatio = window.devicePixelRatio || 1;
				windowWidth = window.innerWidth * pxRatio;
				temp = srcset.split(",").map(function(el) {
					var ret = {};
					el.trim().split(/\s+/).forEach(function(el, i) {
						var value = parseInt(el.substring(0, el.length - 1), 10);
						if (i === 0) {
							return (ret.url = el);
						}
						if (value) {
							ret.value = value;
							ret.postfix = el[el.length - 1];
						}
					});
					return ret;
				});
				// Sort by value
				temp.sort(function(a, b) {
					return a.value - b.value;
				});
				// Ok, now we have an array of all srcset values
				for (var j = 0; j < temp.length; j++) {
					var el = temp[j];
					if ((el.postfix === "w" && el.value >= windowWidth) || (el.postfix === "x" && el.value >= pxRatio)) {
						found = el;
						break;
					}
				}
				// If not found, take the last one
				if (!found && temp.length) {
					found = temp[temp.length - 1];
				}
				if (found) {
					slide.src = found.url;
					// If we have default width/height values, we can calculate height for matching source
					if (slide.width && slide.height && found.postfix == "w") {
						slide.height = (slide.width / slide.height) * found.value;
						slide.width = found.value;
					}
					slide.opts.srcset = srcset;
				}
			}
		}, // Create full-size image
		setBigImage: function(slide) {
			var self = this,
				img = document.createElement("img"),
				$img = $(img);
			slide.$image = $img.one("error", function() {
				self.setError(slide);
			}).one("load", function() {
				var sizes;
				if (!slide.$ghost) {
					self.resolveImageSlideSize(slide, this.naturalWidth, this.naturalHeight);
					self.afterLoad(slide);
				}
				if (self.isClosing) {return;}
				if (slide.opts.srcset) {
					sizes = slide.opts.sizes;
					if (!sizes || sizes === "auto") {
						sizes = (slide.width / slide.height > 1 && $W.width() / $W.height() > 1 ? "100" : Math.round((slide.width / slide.height) * 100)) + "vw";
					}
					$img.attr("sizes", sizes).attr("srcset", slide.opts.srcset);
				}
				// Hide temporary image after some delay
				if (slide.$ghost) {
					setTimeout(function() {
						if (slide.$ghost && !self.isClosing) {
							slide.$ghost.hide();
						}
					}, Math.min(300, Math.max(1000, slide.height / 1600)));
				}
				self.hideLoading(slide);
			}).addClass("gbox-image").attr("src", slide.src).appendTo(slide.$content);
			if ((img.complete || img.readyState == "complete") && $img.naturalWidth && $img.naturalHeight) {
				$img.trigger("load");
			} else if (img.error) {
				$img.trigger("error");
			}
		}, // Computes the slide size from image size and maxWidth/maxHeight
		resolveImageSlideSize: function(slide, imgWidth, imgHeight) {
			var maxWidth = parseInt(slide.opts.width, 10),
				maxHeight = parseInt(slide.opts.height, 10);
			// Sets the default values from the image
			slide.width = imgWidth;
			slide.height = imgHeight;
			if (maxWidth > 0) {
				slide.width = maxWidth;
				slide.height = Math.floor((maxWidth * imgHeight) / imgWidth);
			}
			if (maxHeight > 0) {
				slide.width = Math.floor((maxHeight * imgWidth) / imgHeight);
				slide.height = maxHeight;
			}
		}, // Create iframe wrapper, iframe and bindings
		setIframe: function(slide) {
			var self = this,
				opts = slide.opts.iframe,
				$slide = slide.$slide,
				$iframe;
			slide.$content = $('<div class="gbox-content' + (opts.preload ? " gbox-is-hidden" : "") + '"></div>').css(opts.css).appendTo($slide);
			$slide.addClass("gbox-slide--" + slide.contentType);
			slide.$iframe = $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime())).attr(opts.attr).appendTo(slide.$content);
			if (opts.preload) {
				self.showLoading(slide);
				// Unfortunately, it is not always possible to determine if iframe is successfully loaded
				// (due to browser security policy)
				$iframe.on("load.fb error.fb", function(e) {
					this.isReady = 1;
					slide.$slide.trigger("refresh");
					self.afterLoad(slide);
				});
				// Recalculate iframe content size
				$slide.on("refresh.fb", function() {
					var $content = slide.$content,
						frameWidth = opts.css.width,
						frameHeight = opts.css.height,
						$contents, $body;
					if ($iframe[0].isReady !== 1) {return;}
					try {
						$contents = $iframe.contents();
						$body = $contents.find("body");
					} catch (ignore) {}
					// Calculate content dimensions, if it is accessible
					if ($body && $body.length && $body.children().length) {
						// Avoid scrolling to top (if multiple instances)
						$slide.css("overflow", "visible");
						$content.css({
							width: "100%",
							"max-width": "100%",
							height: "9999px"
						});
						if (frameWidth === undefined) {
							frameWidth = Math.ceil(Math.max($body[0].clientWidth, $body.outerWidth(true)));
						}
						$content.css("width", frameWidth ? frameWidth : "").css("max-width", "");
						if (frameHeight === undefined) {
							frameHeight = Math.ceil(Math.max($body[0].clientHeight, $body.outerHeight(true)));
						}
						$content.css("height", frameHeight ? frameHeight : "");
						$slide.css("overflow", "auto");
					}
					$content.removeClass("gbox-is-hidden");
				});
			} else {
				self.afterLoad(slide);
			}
			$iframe.attr("src", slide.src);
			// Remove iframe if closing or changing gallery item
			$slide.one("onReset", function() {
				// This helps IE not to throw errors when closing
				try {
					$(this).find("iframe").hide().unbind().attr("src", "//about:blank");
				} catch (ignore) {}
				$(this).off("refresh.fb").empty();
				slide.isLoaded = false;
				slide.isRevealed = false;
			});
		}, // Wrap and append content to the slide
		setContent: function(slide, content) {
			var self = this;
			if (self.isClosing) {return;}
			self.hideLoading(slide);
			if (slide.$content) {
				$.gbox.stop(slide.$content);
			}
			slide.$slide.empty();
			// If content is a jQuery object, then it will be moved to the slide.
			// The placeholder is created so we will know where to put it back.
			if (isQuery(content) && content.parent().length) {
				// Make sure content is not already moved to gbox
				if (content.hasClass("gbox-content") || content.parent().hasClass("gbox-content")) {
					content.parents(".gbox-slide").trigger("onReset");
				}
				// Create temporary element marking original place of the content
				slide.$placeholder = $("<div>").hide().insertAfter(content);
				// Make sure content is visible
				content.css("display", "inline-block");
			} else if (!slide.hasError) {
				// If content is just a plain text, try to convert it to html
				if ($.type(content) === "string") {
					content = $("<div>").append($.trim(content)).contents();
				}
				// If "filter" option is provided, then filter content
				if (slide.opts.filter) {
					content = $("<div>").html(content).find(slide.opts.filter);
				}
			}
			slide.$slide.one("onReset", function() {
				// Pause all html5 video/audio
				$(this).find("video,audio").trigger("pause");
				// Put content back
				if (slide.$placeholder) {
					slide.$placeholder.after(content.removeClass("gbox-content").hide()).remove();
					slide.$placeholder = null;
				}
				// Remove custom close button
				if (slide.$smallBtn) {
					slide.$smallBtn.remove();
					slide.$smallBtn = null;
				}
				// Remove content and mark slide as not loaded
				if (!slide.hasError) {
					$(this).empty();
					slide.isLoaded = false;
					slide.isRevealed = false;
				}
			});
			$(content).appendTo(slide.$slide);
			if ($(content).is("video,audio")) {
				$(content).addClass("gbox-video");
				$(content).wrap("<div></div>");
				slide.contentType = "video";
				slide.opts.width = slide.opts.width || $(content).attr("width");
				slide.opts.height = slide.opts.height || $(content).attr("height");
			}
			slide.$content = slide.$slide.children().filter("div,form,main,video,audio,article,.gbox-content").first();
			slide.$content.siblings().hide();
			// Re-check if there is a valid content
			// (in some cases, ajax response can contain various elements or plain text)
			if (!slide.$content.length) {
				slide.$content = slide.$slide.wrapInner("<div></div>").children().first();
			}
			slide.$content.addClass("gbox-content");
			slide.$slide.addClass("gbox-slide--" + slide.contentType);
			self.afterLoad(slide);
		}, // Display error message
		setError: function(slide) {
			slide.hasError = true;
			slide.$slide.trigger("onReset").removeClass("gbox-slide--" + slide.contentType).addClass("gbox-slide--error");
			slide.contentType = "html";
			this.setContent(slide, this.translate(slide, slide.opts.errorTpl));
			if (slide.pos === this.currPos) {
				this.isAnimating = false;
			}
		}, // Show loading icon inside the slide
		showLoading: function(slide) {
			var self = this;
			slide = slide || self.current;
			if (slide && !slide.$spinner) {
				slide.$spinner = $(self.translate(self, self.opts.spinnerTpl)).appendTo(slide.$slide).hide().fadeIn("fast");
			}
		}, // Remove loading icon from the slide
		hideLoading: function(slide) {
			var self = this;
			slide = slide || self.current;
			if (slide && slide.$spinner) {
				slide.$spinner.stop().remove();
				delete slide.$spinner;
			}
		}, // Adjustments after slide content has been loaded
		afterLoad: function(slide) {
			var self = this;
			if (self.isClosing) {return;}
			slide.isLoading = false;
			slide.isLoaded = true;
			self.trigger("afterLoad", slide);
			self.hideLoading(slide);
			// Add small close button
			if (slide.opts.smallBtn && (!slide.$smallBtn || !slide.$smallBtn.length)) {
				slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).appendTo(slide.$content);
			}
			// Disable right click
			if (slide.opts.protect && slide.$content && !slide.hasError) {
				slide.$content.on("contextmenu.fb", function(e) {
					if (e.button == 2) {
						e.preventDefault();
					}
					return true;
				});
				// Add fake element on top of the image
				// This makes a bit harder for user to select image
				if (slide.type === "image") {
					$('<div class="gbox-spaceball"></div>').appendTo(slide.$content);
				}
			}
			self.adjustCaption(slide);
			self.adjustLayout(slide);
			if (slide.pos === self.currPos) {
				self.updateCursor();
			}
			self.revealContent(slide);
		}, // Prevent caption overlap, fix css inconsistency across browsers
		adjustCaption: function(slide) {
			var self = this,
				current = slide || self.current,
				caption = current.opts.caption,
				preventOverlap = current.opts.preventCaptionOverlap,
				$caption = self.$refs.caption,
				$clone, captionH = false;
			$caption.toggleClass("gbox-caption--separate", preventOverlap);
			if (preventOverlap && caption && caption.length) {
				if (current.pos !== self.currPos) {
					$clone = $caption.clone().appendTo($caption.parent());
					$clone.children().eq(0).empty().html(caption);
					captionH = $clone.outerHeight(true);
					$clone.empty().remove();
				} else if (self.$caption) {
					captionH = self.$caption.outerHeight(true);
				}
				current.$slide.css("padding-bottom", captionH || "");
			}
		}, // Simple hack to fix inconsistency across browsers, described here (affects Edge, too): https://bugzilla.mozilla.org/show_bug.cgi?id=748518
		adjustLayout: function(slide) {
			var self = this,
				current = slide || self.current,
				scrollHeight, marginBottom, inlinePadding, actualPadding;
			if (current.isLoaded && current.opts.disableLayoutFix !== true) {
				current.$content.css("margin-bottom", "");
				// If we would always set margin-bottom for the content, then it would potentially break vertical align
				if (current.$content.outerHeight() > current.$slide.height() + 0.5) {
					inlinePadding = current.$slide[0].style["padding-bottom"];
					actualPadding = current.$slide.css("padding-bottom");
					if (parseFloat(actualPadding) > 0) {
						scrollHeight = current.$slide[0].scrollHeight;
						current.$slide.css("padding-bottom", 0);
						if (Math.abs(scrollHeight - current.$slide[0].scrollHeight) < 1) {
							marginBottom = actualPadding;
						}
						current.$slide.css("padding-bottom", inlinePadding);
					}
				}
				current.$content.css("margin-bottom", marginBottom);
			}
		}, // Make content visible. This method is called right after content has been loaded or user navigates gallery and transition should start
		revealContent: function(slide) {
			var self = this,
				$slide = slide.$slide,
				end = false,
				start = false,
				isMoved = self.isMoved(slide),
				isRevealed = slide.isRevealed,
				effect, effectClassName, duration, opacity;
			slide.isRevealed = true;
			effect = slide.opts[self.firstRun ? "animationEffect" : "transitionEffect"];
			duration = slide.opts[self.firstRun ? "animationDuration" : "transitionDuration"];
			duration = parseInt(slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10);
			if (isMoved || slide.pos !== self.currPos || !duration) {
				effect = false;
			}
			// Check if can zoom
			if (effect === "zoom") {
				if (slide.pos === self.currPos && duration && slide.type === "image" && !slide.hasError && (start = self.getThumbPos(slide))) {
					end = self.getFitPos(slide);
				} else {
					effect = "fade";
				}
			}
			// Zoom animation
			if (effect === "zoom") {
				self.isAnimating = true;
				end.scaleX = end.width / start.width;
				end.scaleY = end.height / start.height;
				// Check if we need to animate opacity
				opacity = slide.opts.zoomOpacity;
				if (opacity == "auto") {
					opacity = Math.abs(slide.width / slide.height - start.width / start.height) > 0.1;
				}
				if (opacity) {
					start.opacity = 0.1;
					end.opacity = 1;
				}
				// Draw image at start position
				$.gbox.setTranslate(slide.$content.removeClass("gbox-is-hidden"), start);
				forceRedraw(slide.$content);
				// Start animation
				$.gbox.animate(slide.$content, end, duration, function() {
					self.isAnimating = false;
					self.complete();
				});
				return;
			}
			self.updateSlide(slide);
			// Simply show content if no effect
			if (!effect) {
				slide.$content.removeClass("gbox-is-hidden");
				if (!isRevealed && isMoved && slide.type === "image" && !slide.hasError) {
					slide.$content.hide().fadeIn("fast");
				}
				if (slide.pos === self.currPos) {
					self.complete();
				}
				return;
			}
			// Prepare for CSS transiton
			$.gbox.stop($slide);
			//effectClassName = "gbox-animated gbox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " gbox-fx-" + effect;
			effectClassName = "gbox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " gbox-animated gbox-fx-" + effect;
			$slide.addClass(effectClassName).removeClass("gbox-slide--current"); //.addClass(effectClassName);
			slide.$content.removeClass("gbox-is-hidden");
			// Force reflow
			forceRedraw($slide);
			if (slide.type !== "image") {
				slide.$content.hide().show(0);
			}
			$.gbox.animate($slide, "gbox-slide--current", duration, function() {
				$slide.removeClass(effectClassName).css({
					transform: "",
					opacity: ""
				});
				if (slide.pos === self.currPos) {
					self.complete();
				}
			}, true);
		}, // Check if we can and have to zoom from thumbnail
		getThumbPos: function(slide) {
			var rez = false,
				$thumb = slide.$thumb,
				thumbPos, btw, brw, bbw, blw;
			if (!$thumb || !inViewport($thumb[0])) {return false;}
			thumbPos = $.gbox.getTranslate($thumb);
			btw = parseFloat($thumb.css("border-top-width") || 0);
			brw = parseFloat($thumb.css("border-right-width") || 0);
			bbw = parseFloat($thumb.css("border-bottom-width") || 0);
			blw = parseFloat($thumb.css("border-left-width") || 0);
			rez = {
				top: thumbPos.top + btw,
				left: thumbPos.left + blw,
				width: thumbPos.width - brw - blw,
				height: thumbPos.height - btw - bbw,
				scaleX: 1,
				scaleY: 1
			};
			return thumbPos.width > 0 && thumbPos.height > 0 ? rez : false;
		}, // Final adjustments after current gallery item is moved to position and it`s content is loaded
		complete: function() {
			var self = this,
				current = self.current,
				slides = {},
				$el;
			if (self.isMoved() || !current.isLoaded) {return;}
			if (!current.isComplete) {
				current.isComplete = true;
				current.$slide.siblings().trigger("onReset");
				self.preload("inline");
				// Trigger any CSS transiton inside the slide
				forceRedraw(current.$slide);
				current.$slide.addClass("gbox-slide--complete");
				// Remove unnecessary slides
				$.each(self.slides, function(key, slide) {
					if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
						slides[slide.pos] = slide;
					} else if (slide) {
						$.gbox.stop(slide.$slide);
						slide.$slide.off().remove();
					}
				});
				self.slides = slides;
			}
			self.isAnimating = false;
			self.updateCursor();
			self.trigger("afterShow");
			// Autoplay first html5 video/audio
			if (!!current.opts.video.autoStart) {
				current.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function() {
					if (Document.exitFullscreen) {
						Document.exitFullscreen();
					} else if (this.webkitExitFullscreen) {
						this.webkitExitFullscreen();
					}
					self.next();
				});
			}
			// Try to focus on the first focusable element
			if (current.opts.autoFocus && current.contentType === "html") {
				// Look for the first input with autofocus attribute
				$el = current.$content.find("input[autofocus]:enabled:visible:first");
				if ($el.length) {
					$el.trigger("focus");
				} else {
					self.focus(null, true);
				}
			}
			// Avoid jumping
			current.$slide.scrollTop(0).scrollLeft(0);
		}, // Preload next and previous slides
		preload: function(type) {
			var self = this,
				prev, next;
			if (self.group.length < 2) {return;}
			next = self.slides[self.currPos + 1];
			prev = self.slides[self.currPos - 1];
			if (prev && prev.type === type) {
				self.loadSlide(prev);
			}
			if (next && next.type === type) {
				self.loadSlide(next);
			}
		}, // Try to find and focus on the first focusable element
		focus: function(e, firstRun) {
			var self = this,
				focusableStr = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'].join(","),
				focusableItems, focusedItemIndex;
			if (self.isClosing) {return;}
			if (e || !self.current || !self.current.isComplete) {
				// Focus on any element inside gbox
				focusableItems = self.$refs.container.find("*:visible");
			} else {
				// Focus inside current slide
				focusableItems = self.current.$slide.find("*:visible" + (firstRun ? ":not(.gbox-close-small)" : ""));
			}
			focusableItems = focusableItems.filter(focusableStr).filter(function() {
				return $(this).css("visibility") !== "hidden" && !$(this).hasClass("disabled");
			});
			if (focusableItems.length) {
				focusedItemIndex = focusableItems.index(document.activeElement);
				if (e && e.shiftKey) {
					// Back tab
					if (focusedItemIndex < 0 || focusedItemIndex == 0) {
						e.preventDefault();
						focusableItems.eq(focusableItems.length - 1).trigger("focus");
					}
				} else {
					// Outside or Forward tab
					if (focusedItemIndex < 0 || focusedItemIndex == focusableItems.length - 1) {
						if (e) {
							e.preventDefault();
						}
						focusableItems.eq(0).trigger("focus");
					}
				}
			} else {
				self.$refs.container.trigger("focus");
			}
		}, // Activates current instance - brings container to the front and enables keyboard, notifies other instances about deactivating
		activate: function() {
			var self = this;
			// Deactivate all instances
			$(".gbox-container").each(function() {
				var instance = $(this).data("gbox");
				// Skip self and closing instances
				if (instance && instance.id !== self.id && !instance.isClosing) {
					instance.trigger("onDeactivate");
					instance.removeEvents();
					instance.isVisible = false;
				}
			});
			self.isVisible = true;
			if (self.current || self.isIdle) {
				self.update();
				self.updateControls();
			}
			self.trigger("onActivate");
			self.addEvents();
		}, // Start closing procedure. This will start "zoom-out" animation if needed and clean everything up afterwards
		close: function(e, d) {
			var self = this,
				current = self.current,
				effect, duration, $content, domRect, opacity, start, end;
			var done = function() {
				self.cleanUp(e);
			};
			if (self.isClosing) {return false;}
			self.isClosing = true;
			// If beforeClose callback prevents closing, make sure content is centered
			if (self.trigger("beforeClose", e) === false) {
				self.isClosing = false;
				requestAFrame(function() {
					self.update();
				});
				return false;
			}
			// Remove all events
			// If there are multiple instances, they will be set again by "activate" method
			self.removeEvents();
			$content = current.$content;
			effect = current.opts.animationEffect;
			duration = $.isNumeric(d) ? d : effect ? current.opts.animationDuration : 0;
			current.$slide.removeClass("gbox-slide--complete gbox-slide--next gbox-slide--previous gbox-animated");
			if (e !== true) {
				$.gbox.stop(current.$slide);
			} else {
				effect = false;
			}
			// Remove other slides
			current.$slide.siblings().trigger("onReset").remove();
			// Trigger animations
			if (duration) {
				self.$refs.container.removeClass("gbox-is-open").addClass("gbox-is-closing").css("transition-duration", duration + "ms");
			}
			// Clean up
			self.hideLoading(current);
			self.hideControls(true);
			self.updateCursor();
			// Check if possible to zoom-out
			if (effect === "zoom" && !($content && duration && current.type === "image" && !self.isMoved() && !current.hasError && (end = self.getThumbPos(current)))) {
				effect = "fade";
			}
			if (effect === "zoom") {
				$.gbox.stop($content);
				domRect = $.gbox.getTranslate($content);
				start = {
					top: domRect.top,
					left: domRect.left,
					scaleX: domRect.width / end.width,
					scaleY: domRect.height / end.height,
					width: end.width,
					height: end.height
				};
				// Check if we need to animate opacity
				opacity = current.opts.zoomOpacity;
				if (opacity == "auto") {
					opacity = Math.abs(current.width / current.height - end.width / end.height) > 0.1;
				}
				if (opacity) {
					end.opacity = 0;
				}
				$.gbox.setTranslate($content, start);
				forceRedraw($content);
				$.gbox.animate($content, end, duration, done);
				return true;
			}
			if (effect && duration) {
				$.gbox.animate(current.$slide.addClass("gbox-slide--previous").removeClass("gbox-slide--current"), "gbox-animated gbox-fx-" + effect, duration, done);
			} else {
				// If skip animation
				if (e === true) {
					setTimeout(done, duration);
				} else {
					done();
				}
			}
			return true;
		}, // Final adjustments after removing the instance
		cleanUp: function(e) {
			var self = this,
				instance, $focus = self.current.opts.$orig,
				x, y;
			self.current.$slide.trigger("onReset");
			self.$refs.container.empty().remove();
			self.trigger("afterClose", e);
			// Place back focus
			if (!!self.current.opts.backFocus) {
				if (!$focus || !$focus.length || !$focus.is(":visible")) {
					$focus = self.$trigger;
				}
				if ($focus && $focus.length) {
					x = window.scrollX;
					y = window.scrollY;
					$focus.trigger("focus");
					$("html, body").scrollTop(y).scrollLeft(x);
				}
			}
			self.current = null;
			// Check if there are other instances
			instance = $.gbox.getInstance();
			if (instance) {
				instance.activate();
			} else {
				$("body").removeClass("gbox-active compensate-for-scrollbar");
				$("#gbox-style-noscroll").remove();
			}
		}, // Call callback and trigger an event
		trigger: function(name, slide) {
			var args = Array.prototype.slice.call(arguments, 1),
				self = this,
				obj = slide && slide.opts ? slide : self.current,
				rez;
			if (obj) {
				args.unshift(obj);
			} else {
				obj = self;
			}
			args.unshift(self);
			if ($.isFunction(obj.opts[name])) {
				rez = obj.opts[name].apply(obj, args);
			}
			if (rez === false) {return rez;}
			if (name === "afterClose" || !self.$refs) {
				$D.trigger(name + ".fb", args);
			} else {
				self.$refs.container.trigger(name + ".fb", args);
			}
		}, // Update infobar values, navigation button states and reveal caption lpp2
		updateControls: function() {
			var self = this,
				current = self.current,
				index = current.index,
				$container = self.$refs.container,
				$caption = self.$refs.caption,
				caption = !$.gbox.isMobile ? !current.opts.caption ? current.opts.m_caption : current.opts.caption : !current.opts.m_caption ? current.opts.caption : current.opts.m_caption;
			if (current.opts.formtype == 'button' || !current.opts.formtype) {
				var caption_btn = `${caption}<span data-gbox="" data-src="#gbox-modal${current.index}" data-opacity_overflow="1" data-touch="0" class="gbox-content__open-form-btn">${current.opts.form_btn}</span>`;
			} else if (current.opts.formtype == 'fixed' || current.opts.formtype == 'fixed-stick' || current.opts.formtype == 'fixed-left') {
				var caption_btn = `${caption}<span data-gbox="" data-src="#gbox-modal${current.index}" data-opacity_overflow="1" data-touch="0" class="gbox-content__open-form-btn gbox-content__open-form-btn--hide">${current.opts.form_btn}</span>`;
			}
			//console.log(self);
			if (current.opts.form && current.opts.formtype == 'fixed') {
				self.$refs.toolbar.addClass("gbox-slide--toolbar-right");
				self.$refs.navigation.addClass("gbox-slide--navigation-right");
				self.$refs.navigation.removeClass("gbox-slide--navigation-left");
				self.$refs.infobar.removeClass("gbox-slide--infobar-left");
			} else if (current.opts.form && current.opts.formtype == 'fixed-left') {
				self.$refs.toolbar.removeClass("gbox-slide--toolbar-right");
				self.$refs.navigation.removeClass("gbox-slide--navigation-right");
				self.$refs.navigation.addClass("gbox-slide--navigation-left");
				self.$refs.infobar.addClass("gbox-slide--infobar-left");
			} else {
				self.current.$slide.removeClass("gbox-slide--form-fixed");
				self.$refs.toolbar.removeClass("gbox-slide--toolbar-right");
				self.$refs.navigation.removeClass("gbox-slide--navigation-right");
				self.$refs.navigation.removeClass("gbox-slide--navigation-left");
				self.$refs.infobar.removeClass("gbox-slide--infobar-left");
			}

			// Recalculate content dimensions
			current.$slide.trigger("refresh");
			// Set caption and form-btn
			if (caption && caption.length || current.opts.form || current.opts.form == "") {
				self.$caption = $caption;
				if (current.opts.form || current.opts.form == "") {
					$caption.children().eq(0).html(caption_btn);
				} else {
					$caption.children().eq(0).html(caption);
				}
			} else {
				self.$caption = null;
			}
			if (!self.hasHiddenControls && !self.isIdle) {
				self.showControls();
			}
			// Update info and navigation elements
			$container.find("[data-gbox-count]").html(self.group.length);
			$container.find("[data-gbox-index]").html(index + 1);
			$container.find("[data-gbox-prev]").prop("disabled", !current.opts.loop && index <= 0);
			$container.find("[data-gbox-next]").prop("disabled", !current.opts.loop && index >= self.group.length - 1);
			if (current.type === "image") {
				// Re-enable buttons; update download button source
				$container.find("[data-gbox-zoom]").show().end().find("[data-gbox-download]").attr("href", current.opts.image.src || current.src).show();
			} else if (current.opts.toolbar) {
				$container.find("[data-gbox-download],[data-gbox-zoom]").hide();
			}
			// Make sure focus is not on disabled button/element
			if ($(document.activeElement).is(":hidden,[disabled]")) {
				self.$refs.container.trigger("focus");
			}
		}, // Hide toolbar and caption
		hideControls: function(andCaption) {
			var self = this,
				arr = ["infobar", "toolbar", "nav"];
			if (andCaption || !self.current.opts.preventCaptionOverlap) {
				arr.push("caption");
			}
			this.$refs.container.removeClass(arr.map(function(i) {
				return "gbox-show-" + i;
			}).join(" "));
			this.hasHiddenControls = true;
		},
		showControls: function() {
			var self = this,
				opts = self.current ? self.current.opts : self.opts,
				$container = self.$refs.container;
			self.hasHiddenControls = false;
			self.idleSecondsCounter = 0;
			$container.toggleClass("gbox-show-toolbar", !!(opts.toolbar && opts.buttons)).toggleClass("gbox-show-infobar", !!(opts.infobar && self.group.length > 1)).toggleClass("gbox-show-caption", !!self.$caption).toggleClass("gbox-show-nav", !!(opts.arrows && self.group.length > 1)).toggleClass("gbox-is-modal", !!opts.modal);
		}, // Toggle toolbar and caption
		toggleControls: function() {
			if (this.hasHiddenControls) {
				this.showControls();
			} else {
				this.hideControls();
			}
		}, //gbox mask and inputs in form //lppm
		refreshFormMask: function() {
         let inputList = document.querySelectorAll(".js-gbox-tel");
         let matrix = "+7 (___) ___-__-__";

         const replaceAt = function(string, index, replacement) {
            return string.substr(0, index) + replacement + string.substr(index + replacement.length);
         }
         
         for (let input of inputList) {
            input.addEventListener("input", mask, false);
            input.addEventListener("focus", mask, false);
            input.addEventListener("blur", mask, false);
         }
         let placeholders = document.querySelectorAll(".js-gbox-placeholder");
			if (placeholders != null) {
				for (let pls of placeholders) {
					let input = pls.nextElementSibling;
					input.addEventListener('focus', function() {
						pls.classList.add('gbox-active');
						pls.parentElement.classList.add('gbox-active');
					});
					pls.nextElementSibling.addEventListener('blur', function() {
						if (input.getAttribute('type') == 'tel' && input.value == "+7" || input.value === "Не выбрано") {input.value = "";}
						if (input.value == "") {
							pls.classList.remove('gbox-active');
							pls.parentElement.classList.remove('gbox-active');
						}
					});
				}
			}
         function mask(event) {
            let val = this.value.replace(/\D/g, ""),
               def = matrix.replace(/\D/g, ""),
               i = 0;
            if (
               (def.length >= val.length && (val = def),
               (this.value = matrix.replace(/./g, function (e) {
                  return /[_\d]/.test(e) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : e;
               })),
               "788" !== val || 3 !== i || ((val = replaceAt(val, 0, "78")), (this.value = "+7 (8")),
               ("789" !== val && "779" !== val) || 3 !== i || ((val = replaceAt(val, 0, "79")), (this.value = "+7 (9")),
               "blur" == event.type)
            )
               2 == this.value.length && (this.value = "");
            else if ((this.focus(), this.setSelectionRange)) this.setSelectionRange(this.value.length, this.value.length);
            else if (this.createTextRange) {
               var range = this.createTextRange();
               range.collapse(!0), range.moveEnd("character", this.value.length), range.moveStart("character", this.value.length), range.select();
            }
         }
		}
	});
	$.gbox = {
		version: "3.5.7",
		defaults: defaults, // Get current instance and execute a command.
		// $instance = $.gbox.getInstance();
		// $.gbox.getInstance().jumpTo( 1 );
		// $.gbox.getInstance( 'jumpTo', 1 );
		// $.gbox.getInstance( function() {console.info( this.currIndex );});
		getInstance: function(command) {
			var instance = $('.gbox-container:not(".gbox-is-closing"):last').data("gbox"),
				args = Array.prototype.slice.call(arguments, 1);
			if (instance instanceof Gbox) {
				if ($.type(command) === "string") {
					instance[command].apply(instance, args);
				} else if ($.type(command) === "function") {
					command.apply(instance, args);
				}
				return instance;
			}
			return false;
		}, // Create new instance
		open: function(items, opts, index) {
			return new Gbox(items, opts, index);
		}, // Close current or all instances
		close: function(all) {
			var instance = this.getInstance();
			if (instance) {
				instance.close();
				// Try to find and close next instance
				if (all === true) {
					this.close(all);
				}
			}
		}, // Close all instances and unbind all events
		destroy: function() {
			this.close(true);
			$D.add("body").off("click.fb-start", "**");
		}, // Try to detect mobile devices
		isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), // Detect if 'translate3d' support is available
		use3d: (function() {
			var div = document.createElement("div");
			return (window.getComputedStyle && window.getComputedStyle(div) && window.getComputedStyle(div).getPropertyValue("transform") && !(document.documentMode && document.documentMode < 11));
		})(), // Helper function to get current visual state of an element returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
		getTranslate: function($el) {
			var domRect;
			if (!$el || !$el.length) {return false;}
			domRect = $el[0].getBoundingClientRect();
			return {
				top: domRect.top || 0,
				left: domRect.left || 0,
				width: domRect.width,
				height: domRect.height,
				opacity: parseFloat($el.css("opacity"))
			};
		}, // Shortcut for setting "translate3d" properties for element. Can set be used to set opacity, too
		setTranslate: function($el, props) {
			var str = "",
				css = {};
			if (!$el || !props) {return;}
			if (props.left !== undefined || props.top !== undefined) {
				str = (props.left === undefined ? $el.position().left : props.left) + "px, " + (props.top === undefined ? $el.position().top : props.top) + "px";
				if (this.use3d) {
					str = "translate3d(" + str + ", 0px)";
				} else {
					str = "translate(" + str + ")";
				}
			}
			if (props.scaleX !== undefined && props.scaleY !== undefined) {
				str += " scale(" + props.scaleX + ", " + props.scaleY + ")";
			} else if (props.scaleX !== undefined) {
				str += " scaleX(" + props.scaleX + ")";
			}
			if (str.length) {
				css.transform = str;
			}
			if (props.opacity !== undefined) {
				css.opacity = props.opacity;
			}
			if (props.width !== undefined) {
				css.width = props.width;
			}
			if (props.height !== undefined) {
				css.height = props.height;
			}
			return $el.css(css);
		}, // Simple CSS transition handler
		animate: function($el, to, duration, callback, leaveAnimationName) {
			var self = this,
				from;
			if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}
			self.stop($el);
			from = self.getTranslate($el);
			$el.on(transitionEnd, function(e) {
				// Skip events from child elements and z-index change
				if (e && e.originalEvent && (!$el.is(e.originalEvent.target) || e.originalEvent.propertyName == "z-index")) {return;}
				self.stop($el);
				if ($.isNumeric(duration)) {
					$el.css("transition-duration", "");
				}
				if ($.isPlainObject(to)) {
					if (to.scaleX !== undefined && to.scaleY !== undefined) {
						self.setTranslate($el, {
							top: to.top,
							left: to.left,
							width: from.width * to.scaleX,
							height: from.height * to.scaleY,
							scaleX: 1,
							scaleY: 1
						});
					}
				} else if (leaveAnimationName !== true) {
					$el.removeClass(to);
				}
				if ($.isFunction(callback)) {
					callback(e);
				}
			});
			if ($.isNumeric(duration)) {
				$el.css("transition-duration", duration + "ms");
			}
			// Start animation by changing CSS properties or class name
			if ($.isPlainObject(to)) {
				if (to.scaleX !== undefined && to.scaleY !== undefined) {
					delete to.width;
					delete to.height;
					if ($el.parent().hasClass("gbox-slide--image")) {
						$el.parent().addClass("gbox-is-scaling");
					}
				}
				$.gbox.setTranslate($el, to);
			} else {
				$el.addClass(to);
			}
			// Make sure that `transitionend` callback gets fired
			$el.data("timer", setTimeout(function() {
				$el.trigger(transitionEnd);
			}, duration + 33));
		},
		stop: function($el, callCallback) {
			if ($el && $el.length) {
				clearTimeout($el.data("timer"));
				if (callCallback) {
					$el.trigger(transitionEnd);
				}
				$el.off(transitionEnd).css("transition-duration", "");
				$el.parent().removeClass("gbox-is-scaling");
			}
		}
	};
	// Default click handler for "gboxed" links
	function _run(e, opts) {
		var items = [],
			index = 0,
			$target, value, instance;
		// Avoid opening multiple times
		if (e && e.isDefaultPrevented()) {return;}
		e.preventDefault();
		opts = opts || {};
		if (e && e.data) {
			opts = mergeOpts(e.data.options, opts);
		}
		$target = opts.$target || $(e.currentTarget).trigger("blur");
		instance = $.gbox.getInstance();

		//lpp3
		if ($target.attr("data-gbox") == '#skip') {
			instance.current.$forms.toggleClass("gbox-active");
			instance.current.$forms_btn.toggleClass("gbox-active");
			if (instance.current.opts.formtype == 'fixed-stick') {
				instance.current.$slide.toggleClass("gbox-slide--form-fixed");
				instance.current.$forms.removeClass("gbox-hide-form");
				instance.$refs.toolbar.toggleClass("gbox-slide--toolbar-right");
				instance.$refs.navigation.toggleClass("gbox-slide--navigation-right");
			}
			instance.update();
			return;
		}
		if (instance && instance.current.opts.formtype == "fixed-stick") {
			instance.current.$forms.removeClass("gbox-active");
			instance.current.$forms_btn.removeClass("gbox-active");
		}

		if (instance && instance.$trigger && instance.$trigger.is($target)) {return;}
		if (opts.selector) {
			items = $(opts.selector);
		} else {
			// Get all related items and find index for clicked one
			value = $target.attr("data-gbox") || "";
			if (value) {
				items = e.data ? e.data.items : [];
				items = items.length ? items.filter('[data-gbox="' + value + '"]') : $('[data-gbox="' + value + '"]');
			} else {
				items = [$target];
			}
		}
		index = $(items).index($target);
		// Sometimes current item can not be found
		if (index < 0) {
			index = 0;
		}
		instance = $.gbox.open(items, opts, index);
		// Save last active element
		instance.$trigger = $target;
	}
	// Create a jQuery plugin
	$.fn.gbox = function(options) {
		var selector;
		options = options || {};
		selector = options.selector || false;
		if (selector) {
			// Use body element instead of document so it executes first
			$("body").off("click.fb-start", selector).on("click.fb-start", selector, {
				options: options
			}, _run);
		} else {
			this.off("click.fb-start").on("click.fb-start", {
				items: this,
				options: options
			}, _run);
		}
		return this;
	};
	// Self initializing plugin for all elements having `data-gbox` attribute
	$D.on("click.fb-start", "[data-gbox]", _run);
	// Enable "trigger elements"
	$D.on("click.fb-start", "[data-gbox-trigger]", function(e) {
		$('[data-gbox="' + $(this).attr("data-gbox-trigger") + '"]').eq($(this).attr("data-gbox-index") || 0).trigger("click.fb-start", {
			$trigger: $(this)
		});
	});
	// Track focus event for better accessibility styling
	(function() {
		var buttonStr = ".gbox-button",
			focusStr = "gbox-focus",
			$pressed = null;
		$D.on("mousedown mouseup focus blur", buttonStr, function(e) {
			switch (e.type) {
				case "mousedown":
					$pressed = $(this);
					break;
				case "mouseup":
					$pressed = null;
					break;
				case "focusin":
					$(buttonStr).removeClass(focusStr);
					if (!$(this).is($pressed) && !$(this).is("[disabled]")) {
						$(this).addClass(focusStr);
					}
					break;
				case "focusout":
					$(buttonStr).removeClass(focusStr);
					break;
			}
		});
	})();
})(window, document, jQuery);

// Media. Adds additional media type support
(function($) {
	"use strict";
	// Object containing properties for each media type
	var defaults = {
		youtube: {
			matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
			params: {
				autoplay: 1,
				autohide: 1,
				fs: 1,
				rel: 0,
				hd: 1,
				wmode: "transparent",
				enablejsapi: 1,
				html5: 1
			},
			paramPlace: 8,
			type: "iframe",
			url: "https://www.youtube-nocookie.com/embed/$4",
			thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg"
		},
		vimeo: {
			matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
			params: {
				autoplay: 1,
				hd: 1,
				show_title: 1,
				show_byline: 1,
				show_portrait: 0,
				fullscreen: 1
			},
			paramPlace: 3,
			type: "iframe",
			url: "//player.vimeo.com/video/$2"
		},
		instagram: {
			matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
			type: "image",
			url: "//$1/p/$2/media/?size=l"
		},
		gmap_place: {
			matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
			type: "iframe",
			url: function(rez) {
				return ("//maps.google." + rez[2] + "/?ll=" + (rez[9] ? rez[9] + "&z=" + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : "") : rez[12] + "").replace(/\?/, "&") + "&output=" + (rez[12] && rez[12].indexOf("layer=c") > 0 ? "svembed" : "embed"));
			}
		},
		gmap_search: {
			matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
			type: "iframe",
			url: function(rez) {
				return "//maps.google." + rez[2] + "/maps?q=" + rez[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
			}
		}
	};
	// Formats matching url to final form
	var format = function(url, rez, params) {
		if (!url) {return;}
		params = params || "";
		if ($.type(params) === "object") {
			params = $.param(params, true);
		}
		$.each(rez, function(key, value) {
			url = url.replace("$" + key, value || "");
		});
		if (params.length) {
			url += (url.indexOf("?") > 0 ? "&" : "?") + params;
		}
		return url;
	};
	$(document).on("objectNeedsType.fb", function(e, instance, item) {
		var url = item.src || "",
			type = false,
			media, thumb, rez, params, urlParams, paramObj, provider;
		media = $.extend(true, {}, defaults, item.opts.media);
		// Look for any matching media type
		$.each(media, function(providerName, providerOpts) {
			rez = url.match(providerOpts.matcher);
			if (!rez) {return;}
			type = providerOpts.type;
			provider = providerName;
			paramObj = {};
			if (providerOpts.paramPlace && rez[providerOpts.paramPlace]) {
				urlParams = rez[providerOpts.paramPlace];
				if (urlParams[0] == "?") {
					urlParams = urlParams.substring(1);
				}
				urlParams = urlParams.split("&");
				for (var m = 0; m < urlParams.length; ++m) {
					var p = urlParams[m].split("=", 2);
					if (p.length == 2) {
						paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
					}
				}
			}
			params = $.extend(true, {}, providerOpts.params, item.opts[providerName], paramObj);
			url = $.type(providerOpts.url) === "function" ? providerOpts.url.call(this, rez, params, item) : format(providerOpts.url, rez, params);
			thumb = $.type(providerOpts.thumb) === "function" ? providerOpts.thumb.call(this, rez, params, item) : format(providerOpts.thumb, rez);
			if (providerName === "youtube") {
				url = url.replace(/&t=((\d+)m)?(\d+)s/, function(match, p1, m, s) {
					return "&start=" + ((m ? parseInt(m, 10) * 60 : 0) + parseInt(s, 10));
				});
			} else if (providerName === "vimeo") {
				url = url.replace("&%23", "#");
			}
			return false;
		});
		// If it is found, then change content type and update the url
		if (type) {
			if (!item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length)) {
				item.opts.thumb = thumb;
			}
			if (type === "iframe") {
				item.opts = $.extend(true, item.opts, {
					iframe: {
						preload: false,
						attr: {
							scrolling: "no"
						}
					}
				});
			}
			$.extend(item, {
				type: type,
				src: url,
				origSrc: item.src,
				contentSource: provider,
				contentType: type === "image" ? "image" : provider == "gmap_place" || provider == "gmap_search" ? "map" : "video"
			});
		} else if (url) {
			item.type = item.opts.defaultType;
		}
	});
	// Load YouTube/Video API on request to detect when video finished playing
	var VideoAPILoader = {
		youtube: {
			src: "https://www.youtube.com/iframe_api",
			class: "YT",
			loading: false,
			loaded: false
		},
		vimeo: {
			src: "https://player.vimeo.com/api/player.js",
			class: "Vimeo",
			loading: false,
			loaded: false
		},
		load: function(vendor) {
			var _this = this,
				script;
			if (this[vendor].loaded) {
				setTimeout(function() {
					_this.done(vendor);
				});
				return;
			}
			if (this[vendor].loading) {return;}
			this[vendor].loading = true;
			script = document.createElement("script");
			script.type = "text/javascript";
			script.src = this[vendor].src;
			if (vendor === "youtube") {
				window.onYouTubeIframeAPIReady = function() {
					_this[vendor].loaded = true;
					_this.done(vendor);
				};
			} else {
				script.onload = function() {
					_this[vendor].loaded = true;
					_this.done(vendor);
				};
			}
			document.body.appendChild(script);
		},
		done: function(vendor) {
			var instance, $el, player;
			if (vendor === "youtube") {
				delete window.onYouTubeIframeAPIReady;
			}
			instance = $.gbox.getInstance();
			if (instance) {
				$el = instance.current.$content.find("iframe");
				if (vendor === "youtube" && YT !== undefined && YT) {
					player = new YT.Player($el.attr("id"), {
						events: {
							onStateChange: function(e) {
								if (e.data == 0) {
									instance.next();
								}
							}
						}
					});
				} else if (vendor === "vimeo" && Vimeo !== undefined && Vimeo) {
					player = new Vimeo.Player($el);
					player.on("ended", function() {
						instance.next();
					});
				}
			}
		}
	};
	$(document).on({
		"afterShow.fb": function(e, instance, current) {
			if (instance.group.length > 1 && (current.contentSource === "youtube" || current.contentSource === "vimeo")) {
				VideoAPILoader.load(current.contentSource);
			}
		}
	});
})(jQuery);

// Guestures. Adds touch guestures, handles click and tap events
(function(window, document, $) {
	"use strict";
	var requestAFrame = (function() {
		return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
			// if all else fails, use setTimeout
			function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			});
	})();
	var cancelAFrame = (function() {
		return (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
			window.clearTimeout(id);
		});
	})();
	var getPointerXY = function(e) {
		var result = [];
		e = e.originalEvent || e || window.e;
		e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];
		for (var key in e) {
			if (e[key].pageX) {
				result.push({
					x: e[key].pageX,
					y: e[key].pageY
				});
			} else if (e[key].clientX) {
				result.push({
					x: e[key].clientX,
					y: e[key].clientY
				});
			}
		}
		return result;
	};
	var distance = function(point2, point1, what) {
		if (!point1 || !point2) {return 0;}
		if (what === "x") {return point2.x - point1.x;}
		else if (what === "y") {return point2.y - point1.y;}
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
	};
	var isClickable = function($el) {
		if ($el.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || $.isFunction($el.get(0).onclick) || $el.data("selectable")) {return true;}
		// Check for attributes like data-gbox-next or data-gbox-close
		for (var i = 0, atts = $el[0].attributes, n = atts.length; i < n; i++) {
			if (atts[i].nodeName.substr(0, 14) === "data-gbox-") {return true;}
		}
		return false;
	};
	var hasScrollbars = function(el) {
		var overflowY = window.getComputedStyle(el)["overflow-y"],
			overflowX = window.getComputedStyle(el)["overflow-x"],
			vertical = (overflowY === "scroll" || overflowY === "auto") && el.scrollHeight > el.clientHeight,
			horizontal = (overflowX === "scroll" || overflowX === "auto") && el.scrollWidth > el.clientWidth;
		return vertical || horizontal;
	};
	var isScrollable = function($el) {
		var rez = false;
		while (true) {
			rez = hasScrollbars($el.get(0));
			if (rez) {
				break;
			}
			$el = $el.parent();
			if (!$el.length || $el.hasClass("gbox-stage") || $el.is("body")) {
				break;
			}
		}
		return rez;
	};
	var Guestures = function(instance) {
		var self = this;
		self.instance = instance;
		self.$bg = instance.$refs.bg;
		self.$stage = instance.$refs.stage;
		self.$container = instance.$refs.container;
		self.destroy();
		self.$container.on("touchstart.fb.touch mousedown.fb.touch", $.proxy(self, "ontouchstart"));
	};
	Guestures.prototype.destroy = function() {
		var self = this;
		self.$container.off(".fb.touch");
		$(document).off(".fb.touch");
		if (self.requestId) {
			cancelAFrame(self.requestId);
			self.requestId = null;
		}
		if (self.tapped) {
			clearTimeout(self.tapped);
			self.tapped = null;
		}
	};
	Guestures.prototype.ontouchstart = function(e) {
		var self = this,
			$target = $(e.target),
			instance = self.instance,
			current = instance.current,
			$slide = current.$slide,
			$content = current.$content,
			isTouchDevice = e.type == "touchstart";
		// Do not respond to both (touch and mouse) events
		if (isTouchDevice) {
			self.$container.off("mousedown.fb.touch");
		}
		// Ignore right click
		if (e.originalEvent && e.originalEvent.button == 2) {return;}
		// Ignore taping on links, buttons, input elements
		if (!$slide.length || !$target.length || isClickable($target) || isClickable($target.parent())) {return;}
		// Ignore clicks on the scrollbar
		if (!$target.is("img") && e.originalEvent.clientX > $target[0].clientWidth + $target.offset().left) {return;}
		// Ignore clicks while zooming or closing
		if (!current || instance.isAnimating || current.$slide.hasClass("gbox-animated")) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}
		self.realPoints = self.startPoints = getPointerXY(e);
		if (!self.startPoints.length) {return;}
		// Allow other scripts to catch touch event if "touch" is set to false
		if (current.touch) {
			e.stopPropagation();
		}
		self.startEvent = e;
		self.canTap = true;
		self.$target = $target;
		self.$content = $content;
		self.opts = current.opts.touch;
		self.isPanning = false;
		self.isSwiping = false;
		self.isZooming = false;
		self.isScrolling = false;
		self.canPan = instance.canPan();
		self.startTime = new Date().getTime();
		self.distanceX = self.distanceY = self.distance = 0;
		self.canvasWidth = Math.round($slide[0].clientWidth);
		self.canvasHeight = Math.round($slide[0].clientHeight);
		self.contentLastPos = null;
		self.contentStartPos = $.gbox.getTranslate(self.$content) || {
			top: 0,
			left: 0
		};
		self.sliderStartPos = $.gbox.getTranslate($slide);
		// Since position will be absolute, but we need to make it relative to the stage
		self.stagePos = $.gbox.getTranslate(instance.$refs.stage);
		self.sliderStartPos.top -= self.stagePos.top;
		self.sliderStartPos.left -= self.stagePos.left;
		self.contentStartPos.top -= self.stagePos.top;
		self.contentStartPos.left -= self.stagePos.left;
		$(document).off(".fb.touch").on(isTouchDevice ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", $.proxy(self, "ontouchend")).on(isTouchDevice ? "touchmove.fb.touch" : "mousemove.fb.touch", $.proxy(self, "ontouchmove"));
		if ($.gbox.isMobile) {
			document.addEventListener("scroll", self.onscroll, true);
		}
		// Пропустить, если щелкнуть за пределами скользящей области
		if (!(self.opts || self.canPan) || !($target.is(self.$stage) || self.$stage.find($target).length)) {
			if ($target.is(".gbox-image")) {
				e.preventDefault();
			}
			if (($.gbox.isMobile && $target.parents(".gbox-caption").length)) {return;}
		}
		self.isScrollable = isScrollable($target) || isScrollable($target.parent());
		// Проверьте, прокручивается ли элемент, и попытайтесь предотвратить поведение по умолчанию (прокрутка)
		if (!($.gbox.isMobile && self.isScrollable) && $target.attr("data-gbox") != '#skip') {
			e.preventDefault();
		}
		// One finger or mouse click - swipe or pan an image
		if (self.startPoints.length === 1 || current.hasError) {
			if (self.canPan) {
				$.gbox.stop(self.$content);
				self.isPanning = true;
			} else {
				self.isSwiping = true;
			}
			self.$container.addClass("gbox-is-grabbing");
		}
		// Two fingers - zoom image
		if (self.startPoints.length === 2 && current.type === "image" && (current.isLoaded || current.$ghost)) {
			self.canTap = false;
			self.isSwiping = false;
			self.isPanning = false;
			self.isZooming = true;
			$.gbox.stop(self.$content);
			self.centerPointStartX = (self.startPoints[0].x + self.startPoints[1].x) * 0.5 - $(window).scrollLeft();
			self.centerPointStartY = (self.startPoints[0].y + self.startPoints[1].y) * 0.5 - $(window).scrollTop();
			self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
			self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;
			self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
		}
	};
	Guestures.prototype.onscroll = function(e) {
		var self = this;
		self.isScrolling = true;
		document.removeEventListener("scroll", self.onscroll, true);
	};
	Guestures.prototype.ontouchmove = function(e) {
		var self = this;
		// Make sure user has not released over iframe or disabled element
		if (e.originalEvent.buttons !== undefined && e.originalEvent.buttons === 0) {
			self.ontouchend(e);
			return;
		}
		if (self.isScrolling) {
			self.canTap = false;
			return;
		}
		self.newPoints = getPointerXY(e);
		if (!(self.opts || self.canPan) || !self.newPoints.length || !self.newPoints.length) {return;}
		if (!(self.isSwiping && self.isSwiping === true)) {
			e.preventDefault();
		}
		self.distanceX = distance(self.newPoints[0], self.startPoints[0], "x");
		self.distanceY = distance(self.newPoints[0], self.startPoints[0], "y");
		self.distance = distance(self.newPoints[0], self.startPoints[0]);
		// Skip false ontouchmove events (Chrome)
		if (self.distance > 0) {
			if (self.isSwiping) {
				self.onSwipe(e);
			} else if (self.isPanning) {
				self.onPan();
			} else if (self.isZooming) {
				self.onZoom();
			}
		}
	};
	Guestures.prototype.onSwipe = function(e) {
		var self = this,
			instance = self.instance,
			swiping = self.isSwiping,
			left = self.sliderStartPos.left || 0,
			angle;
		// If direction is not yet determined
		if (swiping === true) {
			// We need at least 10px distance to correctly calculate an angle
			if (Math.abs(self.distance) > 10) {
				self.canTap = false;
				if (instance.group.length < 2 && self.opts.vertical) {
					self.isSwiping = "y";
				} else if (instance.isDragging || self.opts.vertical === false || (self.opts.vertical === "auto" && $(window).width() > 800)) {
					self.isSwiping = "x";
				} else {
					angle = Math.abs((Math.atan2(self.distanceY, self.distanceX) * 180) / Math.PI);
					self.isSwiping = angle > 45 && angle < 135 ? "y" : "x";
				}
				if (self.isSwiping === "y" && $.gbox.isMobile && self.isScrollable) {
					self.isScrolling = true;
					return;
				}
				instance.isDragging = self.isSwiping;
				// Reset points to avoid jumping, because we dropped first swipes to calculate the angle
				self.startPoints = self.newPoints;
				$.each(instance.slides, function(index, slide) {
					var slidePos, stagePos;
					$.gbox.stop(slide.$slide);
					slidePos = $.gbox.getTranslate(slide.$slide);
					stagePos = $.gbox.getTranslate(instance.$refs.stage);
					slide.$slide.css({
						transform: "",
						opacity: "",
						"transition-duration": ""
					}).removeClass("gbox-animated").removeClass(function(index, className) {
						return (className.match(/(^|\s)gbox-fx-\S+/g) || []).join(" ");
					});
					if (slide.pos === instance.current.pos) {
						self.sliderStartPos.top = slidePos.top - stagePos.top;
						self.sliderStartPos.left = slidePos.left - stagePos.left;
					}
					$.gbox.setTranslate(slide.$slide, {
						top: slidePos.top - stagePos.top,
						left: slidePos.left - stagePos.left
					});
				});
			}
			return;
		}
		// Sticky edges
		if (swiping == "x") {
			if (self.distanceX > 0 && (self.instance.group.length < 2 || (self.instance.current.index === 0 && !self.instance.current.opts.loop))) {
				left = left + Math.pow(self.distanceX, 0.8);
			} else if (self.distanceX < 0 && (self.instance.group.length < 2 || (self.instance.current.index === self.instance.group.length - 1 && !self.instance.current.opts.loop))) {
				left = left - Math.pow(-self.distanceX, 0.8);
			} else {
				left = left + self.distanceX;
			}
		}
		self.sliderLastPos = {
			top: swiping == "x" ? 0 : self.sliderStartPos.top + self.distanceY,
			left: left
		};
		if (self.requestId) {
			cancelAFrame(self.requestId);
			self.requestId = null;
		}
		self.requestId = requestAFrame(function() {
			if (self.sliderLastPos) {
				$.each(self.instance.slides, function(index, slide) {
					var pos = slide.pos - self.instance.currPos;
					$.gbox.setTranslate(slide.$slide, {
						top: self.sliderLastPos.top,
						left: self.sliderLastPos.left + pos * self.canvasWidth + pos * slide.opts.gutter
					});
				});
				self.$container.addClass("gbox-is-sliding");
			}
		});
	};
	Guestures.prototype.onPan = function() {
		var self = this;
		// Prevent accidental movement (sometimes, when tapping casually, finger can move a bit)
		if (distance(self.newPoints[0], self.realPoints[0]) < ($.gbox.isMobile ? 10 : 5)) {
			self.startPoints = self.newPoints;
			return;
		}
		self.canTap = false;
		self.contentLastPos = self.limitMovement();
		if (self.requestId) {
			cancelAFrame(self.requestId);
		}
		self.requestId = requestAFrame(function() {
			$.gbox.setTranslate(self.$content, self.contentLastPos);
		});
	};
	// Make panning sticky to the edges
	Guestures.prototype.limitMovement = function() {
		var self = this;
		var canvasWidth = self.canvasWidth;
		var canvasHeight = self.canvasHeight;
		var distanceX = self.distanceX;
		var distanceY = self.distanceY;
		var contentStartPos = self.contentStartPos;
		var currentOffsetX = contentStartPos.left;
		var currentOffsetY = contentStartPos.top;
		var currentWidth = contentStartPos.width;
		var currentHeight = contentStartPos.height;
		var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY, newOffsetX, newOffsetY;
		if (currentWidth > canvasWidth) {
			newOffsetX = currentOffsetX + distanceX;
		} else {
			newOffsetX = currentOffsetX;
		}
		newOffsetY = currentOffsetY + distanceY;
		// Slow down proportionally to traveled distance
		minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
		minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);
		maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
		maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5);
		// ->
		if (distanceX > 0 && newOffsetX > minTranslateX) {
			newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
		}
		//<-
		if (distanceX < 0 && newOffsetX < maxTranslateX) {
			newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
		}
		// \/
		if (distanceY > 0 && newOffsetY > minTranslateY) {
			newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
		}
		// /\
		if (distanceY < 0 && newOffsetY < maxTranslateY) {
			newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
		}
		return {
			top: newOffsetY,
			left: newOffsetX
		};
	};
	Guestures.prototype.limitPosition = function(newOffsetX, newOffsetY, newWidth, newHeight) {
		var self = this;
		var canvasWidth = self.canvasWidth;
		var canvasHeight = self.canvasHeight;
		if (newWidth > canvasWidth) {
			newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
			newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
		} else {
			// Center horizontally
			newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
		}
		if (newHeight > canvasHeight) {
			newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
			newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
		} else {
			// Center vertically
			newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
		}
		return {
			top: newOffsetY,
			left: newOffsetX
		};
	};
	Guestures.prototype.onZoom = function() {
		var self = this;
		// Calculate current distance between points to get pinch ratio and new width and height
		var contentStartPos = self.contentStartPos;
		var currentWidth = contentStartPos.width;
		var currentHeight = contentStartPos.height;
		var currentOffsetX = contentStartPos.left;
		var currentOffsetY = contentStartPos.top;
		var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);
		var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;
		var newWidth = Math.floor(currentWidth * pinchRatio);
		var newHeight = Math.floor(currentHeight * pinchRatio);
		// This is the translation due to pinch-zooming
		var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
		var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;
		// Point between the two touches
		var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - $(window).scrollLeft();
		var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - $(window).scrollTop();
		// And this is the translation due to translation of the centerpoint
		// between the two fingers
		var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
		var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;
		// The new offset is the old/current one plus the total translation
		var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
		var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);
		var newPos = {
			top: newOffsetY,
			left: newOffsetX,
			scaleX: pinchRatio,
			scaleY: pinchRatio
		};
		self.canTap = false;
		self.newWidth = newWidth;
		self.newHeight = newHeight;
		self.contentLastPos = newPos;
		if (self.requestId) {
			cancelAFrame(self.requestId);
		}
		self.requestId = requestAFrame(function() {
			$.gbox.setTranslate(self.$content, self.contentLastPos);
		});
	};
	Guestures.prototype.ontouchend = function(e) {
		var self = this;
		var swiping = self.isSwiping;
		var panning = self.isPanning;
		var zooming = self.isZooming;
		var scrolling = self.isScrolling;
		self.endPoints = getPointerXY(e);
		self.dMs = Math.max(new Date().getTime() - self.startTime, 1);
		self.$container.removeClass("gbox-is-grabbing");
		$(document).off(".fb.touch");
		document.removeEventListener("scroll", self.onscroll, true);
		if (self.requestId) {
			cancelAFrame(self.requestId);
			self.requestId = null;
		}
		self.isSwiping = false;
		self.isPanning = false;
		self.isZooming = false;
		self.isScrolling = false;
		self.instance.isDragging = false;
		if (self.canTap) {
			return self.onTap(e);
		}
		self.speed = 100;
		// Speed in px/ms
		self.velocityX = (self.distanceX / self.dMs) * 0.5;
		self.velocityY = (self.distanceY / self.dMs) * 0.5;
		if (panning) {
			self.endPanning();
		} else if (zooming) {
			self.endZooming();
		} else {
			self.endSwiping(swiping, scrolling);
		}
		return;
	};
	Guestures.prototype.endSwiping = function(swiping, scrolling) {
		var self = this,
			ret = false,
			len = self.instance.group.length,
			distanceX = Math.abs(self.distanceX),
			canAdvance = swiping == "x" && len > 1 && ((self.dMs > 130 && distanceX > 10) || distanceX > 50),
			speedX = 300;
		self.sliderLastPos = null;
		// Close if swiped vertically / navigate if horizontally
		if (swiping == "y" && !scrolling && Math.abs(self.distanceY) > 50) {
			// Continue vertical movement
			$.gbox.animate(self.instance.current.$slide, {
				top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
				opacity: 0
			}, 200);
			ret = self.instance.close(true, 250);
		} else if (canAdvance && self.distanceX > 0) {
			ret = self.instance.previous(speedX);
		} else if (canAdvance && self.distanceX < 0) {
			ret = self.instance.next(speedX);
		}
		if (ret === false && (swiping == "x" || swiping == "y")) {
			self.instance.centerSlide(200);
		}
		self.$container.removeClass("gbox-is-sliding");
	};
	// Limit panning from edges
	Guestures.prototype.endPanning = function() {
		var self = this,
			newOffsetX, newOffsetY, newPos;
		if (!self.contentLastPos) {return;}
		if (self.opts.momentum === false || self.dMs > 350) {
			newOffsetX = self.contentLastPos.left;
			newOffsetY = self.contentLastPos.top;
		} else {
			// Continue movement
			newOffsetX = self.contentLastPos.left + self.velocityX * 500;
			newOffsetY = self.contentLastPos.top + self.velocityY * 500;
		}
		newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);
		newPos.width = self.contentStartPos.width;
		newPos.height = self.contentStartPos.height;
		$.gbox.animate(self.$content, newPos, 366);
	};
	Guestures.prototype.endZooming = function() {
		var self = this;
		var current = self.instance.current;
		var newOffsetX, newOffsetY, newPos, reset;
		var newWidth = self.newWidth;
		var newHeight = self.newHeight;
		if (!self.contentLastPos) {return;}
		newOffsetX = self.contentLastPos.left;
		newOffsetY = self.contentLastPos.top;
		reset = {
			top: newOffsetY,
			left: newOffsetX,
			width: newWidth,
			height: newHeight,
			scaleX: 1,
			scaleY: 1
		};
		// Reset scalex/scaleY values; this helps for perfomance and does not break animation
		$.gbox.setTranslate(self.$content, reset);
		if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
			self.instance.scaleToFit(150);
		} else if (newWidth > current.width || newHeight > current.height) {
			self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);
		} else {
			newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);
			$.gbox.animate(self.$content, newPos, 150);
		}
	};
	Guestures.prototype.onTap = function(e) {
		var self = this;
		var $target = $(e.target);
		var instance = self.instance;
		var current = instance.current;
		var endPoints = (e && getPointerXY(e)) || self.startPoints;
		var tapX = endPoints[0] ? endPoints[0].x - $(window).scrollLeft() - self.stagePos.left : 0;
		var tapY = endPoints[0] ? endPoints[0].y - $(window).scrollTop() - self.stagePos.top : 0;
		var where;
		var process = function(prefix) {
			var action = current.opts[prefix];
			if ($.isFunction(action)) {
				action = action.apply(instance, [current, e]);
			}
			if (!action) {return;}
			switch (action) {
				case "close":
					instance.close(self.startEvent);
					break;
				case "toggleControls":
					instance.toggleControls();
					break;
				case "next":
					instance.next();
					break;
				case "nextOrClose":
					if (instance.group.length > 1) {
						instance.next();
					} else {
						instance.close(self.startEvent);
					}
					break;
				case "zoom":
					if (current.type == "image" && (current.isLoaded || current.$ghost)) {
						if (instance.canPan()) {
							instance.scaleToFit();
						} else if (instance.isScaledDown()) {
							instance.scaleToActual(tapX, tapY);
						} else if (instance.group.length < 2) {
							instance.close(self.startEvent);
						}
					}
					break;
			}
		};
		// Ignore right click
		if (e.originalEvent && e.originalEvent.button == 2) {return;}
		// Skip if clicked on the scrollbar
		if (!$target.is("img") && tapX > $target[0].clientWidth + $target.offset().left) {return;}
		// Check where is clicked
		if ($target.is(".gbox-bg,.gbox-inner,.gbox-outer,.gbox-container")) {
			where = "Outside";
		} else if ($target.is(".gbox-slide")) {
			where = "Slide";
		} else if (instance.current.$content && instance.current.$content.find($target).addBack().filter($target).length) {
			where = "Content";
		} else {
			return;
		}
		// Check if this is a double tap
		if (self.tapped) {
			// Stop previously created single tap
			clearTimeout(self.tapped);
			self.tapped = null;
			// Skip if distance between taps is too big
			if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50) {return this;}
			// OK, now we assume that this is a double-tap
			process("dblclick" + where);
		} else {
			// Single tap will be processed if user has not clicked second time within 300ms
			// or there is no need to wait for double-tap
			self.tapX = tapX;
			self.tapY = tapY;
			if (current.opts["dblclick" + where] && current.opts["dblclick" + where] !== current.opts["click" + where]) {
				self.tapped = setTimeout(function() {
					self.tapped = null;
					if (!instance.isAnimating) {
						process("click" + where);
					}
				}, 500);
			} else {
				process("click" + where);
			}
		}
		return this;
	};
	$(document).on("onActivate.fb", function(e, instance) {
		if (instance && !instance.Guestures) {
			instance.Guestures = new Guestures(instance);
		}
	}).on("beforeClose.fb", function(e, instance) {
		if (instance && instance.Guestures) {
			instance.Guestures.destroy();
		}
	});
})(window, document, jQuery);

// FullScreen. Adds fullscreen functionality
(function(document, $) {
	"use strict";
	// Collection of methods supported by user browser
	var fn = (function() {
		var fnMap = [
			["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], // new WebKit
			["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], // old WebKit (Safari 5.1)
			["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
			["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
			["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
		];
		var ret = {};
		for (var i = 0; i < fnMap.length; i++) {
			var val = fnMap[i];
			if (val && val[1] in document) {
				for (var j = 0; j < val.length; j++) {
					ret[fnMap[0][j]] = val[j];
				}
				return ret;
			}
		}
		return false;
	})();
	if (fn) {
		var FullScreen = {
			request: function(elem) {
				elem = elem || document.documentElement;
				elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
			},
			exit: function() {
				document[fn.exitFullscreen]();
			},
			toggle: function(elem) {
				elem = elem || document.documentElement;
				if (this.isFullscreen()) {
					this.exit();
				} else {
					this.request(elem);
				}
			},
			isFullscreen: function() {
				return Boolean(document[fn.fullscreenElement]);
			},
			enabled: function() {
				return Boolean(document[fn.fullscreenEnabled]);
			}
		};
		$.extend(true, $.gbox.defaults, {
			btnTpl: {
				fullScreen: '<button data-gbox-fullscreen class="gbox-button gbox-button--fsenter" title="{{FULL_SCREEN}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>' + "</button>"
			},
			fullScreen: {
				autoStart: false
			}
		});
		$(document).on(fn.fullscreenchange, function() {
			var isFullscreen = FullScreen.isFullscreen(),
				instance = $.gbox.getInstance();
			if (instance) {
				// If image is zooming, then force to stop and reposition properly
				if (instance.current && instance.current.type === "image" && instance.isAnimating) {
					instance.isAnimating = false;
					instance.update(true, true, 0);
					if (!instance.isComplete) {
						instance.complete();
					}
				}
				instance.trigger("onFullscreenChange", isFullscreen);
				instance.$refs.container.toggleClass("gbox-is-fullscreen", isFullscreen);
				instance.$refs.toolbar.find("[data-gbox-fullscreen]").toggleClass("gbox-button--fsenter", !isFullscreen).toggleClass("gbox-button--fsexit", isFullscreen);
			}
		});
	}
	$(document).on({
		"onInit.fb": function(e, instance) {
			var $container;
			if (!fn) {
				instance.$refs.toolbar.find("[data-gbox-fullscreen]").remove();
				return;
			}
			if (instance && instance.group[instance.currIndex].opts.fullScreen) {
				$container = instance.$refs.container;
				$container.on("click.fb-fullscreen", "[data-gbox-fullscreen]", function(e) {
					e.stopPropagation();
					e.preventDefault();
					FullScreen.toggle();
				});
				if (instance.opts.fullScreen && instance.opts.fullScreen.autoStart === true) {
					FullScreen.request();
				}
				// Expose API
				instance.FullScreen = FullScreen;
			} else if (instance) {
				instance.$refs.toolbar.find("[data-gbox-fullscreen]").hide();
			}
		},
		"afterKeydown.fb": function(e, instance, current, keypress, keycode) {
			// "F"
			if (instance && instance.FullScreen && keycode === 70) {
				keypress.preventDefault();
				instance.FullScreen.toggle();
			}
		},
		"beforeClose.fb": function(e, instance) {
			if (instance && instance.FullScreen && instance.$refs.container.hasClass("gbox-is-fullscreen")) {
				FullScreen.exit();
			}
		}
	});
})(document, jQuery);

// Thumbs. Displays thumbnails in a grid
(function(document, $) {
	"use strict";
	var CLASS = "gbox-thumbs",
		CLASS_ACTIVE = CLASS + "-active";
	// Make sure there are default values
	$.gbox.defaults = $.extend(true, {
		btnTpl: {
			thumbs: '<button data-gbox-thumbs class="gbox-button gbox-button--thumbs" title="{{THUMBS}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg>' + "</button>"
		},
		thumbs: {
			autoStart: false, // Display thumbnails on opening
			hideOnClose: true, // Hide thumbnail grid when closing animation starts
			parentEl: ".gbox-container", // Container is injected into this element
			axis: "y" // Vertical (y) or horizontal (x) scrolling
		}
	}, $.gbox.defaults);
	var FancyThumbs = function(instance) {
		this.init(instance);
	};
	$.extend(FancyThumbs.prototype, {
		$button: null,
		$grid: null,
		$list: null,
		isVisible: false,
		isActive: false,
		init: function(instance) {
			var self = this,
				group = instance.group,
				enabled = 0;
			self.instance = instance;
			self.opts = group[instance.currIndex].opts.thumbs;
			instance.Thumbs = self;
			self.$button = instance.$refs.toolbar.find("[data-gbox-thumbs]");
			// Enable thumbs if at least two group items have thumbnails
			for (var i = 0, len = group.length; i < len; i++) {
				if (group[i].thumb) {
					enabled++;
				}
				if (enabled > 1) {
					break;
				}
			}
			if (enabled > 1 && !!self.opts) {
				self.$button.removeAttr("style").on("click", function() {
					self.toggle();
				});
				self.isActive = true;
			} else {
				self.$button.hide();
			}
		},
		create: function() {
			var self = this,
				instance = self.instance,
				parentEl = self.opts.parentEl,
				list = [],
				src;
			if (!self.$grid) {
				// Create main element
				self.$grid = $('<div class="' + CLASS + " " + CLASS + "-" + self.opts.axis + '"></div>').appendTo(instance.$refs.container.find(parentEl).addBack().filter(parentEl));
				// Add "click" event that performs gallery navigation
				self.$grid.on("click", "a", function() {
					instance.jumpTo($(this).attr("data-index"));
				});
			}
			// Build the list
			if (!self.$list) {
				self.$list = $('<div class="' + CLASS + '__list">').appendTo(self.$grid);
			}
			$.each(instance.group, function(i, item) {
				src = item.thumb;
				if (!src && item.type === "image") {
					src = item.src;
				}
				list.push('<a href="javascript:;" tabindex="0" data-index="' + i + '"' + (src && src.length ? ' style="background-image:url(' + src + ')"' : 'class="gbox-thumbs-missing"') + "></a>");
			});
			self.$list[0].innerHTML = list.join("");
			if (self.opts.axis === "x") {
				// Set fixed width for list element to enable horizontal scrolling
				self.$list.width(parseInt(self.$grid.css("padding-right"), 10) + instance.group.length * self.$list.children().eq(0).outerWidth(true));
			}
		},
		focus: function(duration) {
			var self = this,
				$list = self.$list,
				$grid = self.$grid,
				thumb, thumbPos;
			if (!self.instance.current) {
				return
			}
			thumb = $list.children().removeClass(CLASS_ACTIVE).filter('[data-index="' + self.instance.current.index + '"]').addClass(CLASS_ACTIVE);
			thumbPos = thumb.position();
			// Check if need to scroll to make current thumb visible
			if (self.opts.axis === "y" && (thumbPos.top < 0 || thumbPos.top > $list.height() - thumb.outerHeight())) {
				$list.stop().animate({
					scrollTop: $list.scrollTop() + thumbPos.top
				}, duration);
			} else if (self.opts.axis === "x" && (thumbPos.left < $grid.scrollLeft() || thumbPos.left > $grid.scrollLeft() + ($grid.width() - thumb.outerWidth()))) {
				$list.parent().stop().animate({
					scrollLeft: thumbPos.left
				}, duration);
			}
		},
		update: function() {
			var that = this;
			that.instance.$refs.container.toggleClass("gbox-show-thumbs", this.isVisible);
			if (that.isVisible) {
				if (!that.$grid) {
					that.create();
				}
				that.instance.trigger("onThumbsShow");
				that.focus(0);
			} else if (that.$grid) {
				that.instance.trigger("onThumbsHide");
			}
			// обновить позицию слайда
			that.instance.update();
		},
		hide: function() {
			this.isVisible = false;
			this.update();
		},
		show: function() {
			this.isVisible = true;
			this.update();
		},
		toggle: function() {
			this.isVisible = !this.isVisible;
			this.update();
		}
	});
	$(document).on({
		"onInit.fb": function(e, instance) {
			var Thumbs;
			if (instance && !instance.Thumbs) {
				Thumbs = new FancyThumbs(instance);
				if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
					Thumbs.show();
				}
			}
		},
		"beforeShow.fb": function(e, instance, item, firstRun) {
			var Thumbs = instance && instance.Thumbs;
			if (Thumbs && Thumbs.isVisible) {
				Thumbs.focus(firstRun ? 0 : 250);
			}
		},
		"afterKeydown.fb": function(e, instance, current, keypress, keycode) {
			var Thumbs = instance && instance.Thumbs;
			// "G"
			if (Thumbs && Thumbs.isActive && keycode === 71) {
				keypress.preventDefault();
				Thumbs.toggle();
			}
		},
		"beforeClose.fb": function(e, instance) {
			var Thumbs = instance && instance.Thumbs;
			if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
				Thumbs.$grid.hide();
			}
		}
	});
})(document, jQuery);

// Share. Displays simple form for sharing current url
(function(document, $) {
	"use strict";
	$.extend(true, $.gbox.defaults, {
		btnTpl: {
			share: '<button data-gbox-share class="gbox-button gbox-button--share" title="{{SHARE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg>' + "</button>"
		},
		share: {
			url: function(instance, item) {
				return (
					(!instance.currentHash && !(item.type === "inline" || item.type === "html") ? item.origSrc || item.src : false) || window.location);
			},
			tpl: '<div class="gbox-share">' + "<h1>{{SHARE}}</h1>" + "<p>" + '<a class="gbox-share__button gbox-share__button--vk" href="https://vk.com/share.php?url={{url}}&title={{descr}}&image={{media}}">' + '<svg viewBox="0 0 96.496 96.496" xmlns="http://www.w3.org/2000/svg"><path d="M92.499,65.178c-2.873-3.446-6.254-6.387-9.453-9.51c-2.886-2.815-3.068-4.448-0.748-7.697c2.532-3.546,5.255-6.956,7.81-10.486c2.385-3.299,4.823-6.589,6.078-10.539c0.796-2.513,0.092-3.623-2.485-4.063c-0.444-0.077-0.903-0.081-1.355-0.081l-15.289-0.018c-1.883-0.028-2.924,0.793-3.59,2.462c-0.899,2.256-1.826,4.51-2.897,6.687c-2.43,4.936-5.144,9.707-8.949,13.747c-0.839,0.891-1.767,2.017-3.169,1.553c-1.754-0.64-2.271-3.53-2.242-4.507l-0.015-17.647c-0.34-2.521-0.899-3.645-3.402-4.135l-15.882,0.003c-2.12,0-3.183,0.819-4.315,2.145c-0.653,0.766-0.85,1.263,0.492,1.517c2.636,0.5,4.121,2.206,4.515,4.849c0.632,4.223,0.588,8.463,0.224,12.703c-0.107,1.238-0.32,2.473-0.811,3.629c-0.768,1.817-2.008,2.187-3.637,1.069c-1.475-1.012-2.511-2.44-3.525-3.874c-3.809-5.382-6.848-11.186-9.326-17.285c-0.716-1.762-1.951-2.83-3.818-2.859c-4.587-0.073-9.175-0.085-13.762,0.004c-2.76,0.052-3.583,1.392-2.459,3.894c4.996,11.113,10.557,21.917,17.816,31.759c3.727,5.051,8.006,9.51,13.534,12.67c6.265,3.582,13.009,4.66,20.112,4.328c3.326-0.156,4.325-1.021,4.479-4.336c0.104-2.268,0.361-4.523,1.48-6.561c1.098-2,2.761-2.381,4.678-1.137c0.959,0.623,1.767,1.416,2.53,2.252c1.872,2.048,3.677,4.158,5.62,6.137c2.437,2.48,5.324,3.945,8.954,3.646L93.744,75.5c2.264-0.148,3.438-2.924,2.138-5.451C94.969,68.279,93.771,66.703,92.499,65.178z"/></svg>' + "<span>Вконтакте</span>" + "</a>" + '<a class="gbox-share__button gbox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}&picture={{media}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>' + "<span>Facebook</span>" + "</a>" + '<a class="gbox-share__button gbox-share__button--tg" href="https://telegram.me/share/url?url={{url}}&text={{descr}}">' + '<svg enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z"/></svg>' + "<span>Телеграм</span>" + "</a>" + '<a class="gbox-share__button gbox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}">' + '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>' + "<span>Twitter</span>" + "</a>" + '<a class="gbox-share__button gbox-share__button--viber" href="viber://forward?text={{descr}} {{url}}">' + '<svg enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><g fill="#fff"><path d="m23.155 13.893c.716-6.027-.344-9.832-2.256-11.553l.001-.001c-3.086-2.939-13.508-3.374-17.2.132-1.658 1.715-2.242 4.232-2.306 7.348-.064 3.117-.14 8.956 5.301 10.54h.005l-.005 2.419s-.037.98.589 1.177c.716.232 1.04-.223 3.267-2.883 3.724.323 6.584-.417 6.909-.525.752-.252 5.007-.815 5.695-6.654zm-12.237 5.477s-2.357 2.939-3.09 3.702c-.24.248-.503.225-.499-.267 0-.323.018-4.016.018-4.016-4.613-1.322-4.341-6.294-4.291-8.895.05-2.602.526-4.733 1.93-6.168 3.239-3.037 12.376-2.358 14.704-.17 2.846 2.523 1.833 9.651 1.839 9.894-.585 4.874-4.033 5.183-4.667 5.394-.271.09-2.786.737-5.944.526z"/><path d="m12.222 4.297c-.385 0-.385.6 0 .605 2.987.023 5.447 2.105 5.474 5.924 0 .403.59.398.585-.005h-.001c-.032-4.115-2.718-6.501-6.058-6.524z"/><path d="m16.151 10.193c-.009.398.58.417.585.014.049-2.269-1.35-4.138-3.979-4.335-.385-.028-.425.577-.041.605 2.28.173 3.481 1.729 3.435 3.716z"/><path d="m15.521 12.774c-.494-.286-.997-.108-1.205.173l-.435.563c-.221.286-.634.248-.634.248-3.014-.797-3.82-3.951-3.82-3.951s-.037-.427.239-.656l.544-.45c.272-.216.444-.736.167-1.247-.74-1.337-1.237-1.798-1.49-2.152-.266-.333-.666-.408-1.082-.183h-.009c-.865.506-1.812 1.453-1.509 2.428.517 1.028 1.467 4.305 4.495 6.781 1.423 1.171 3.675 2.371 4.631 2.648l.009.014c.942.314 1.858-.67 2.347-1.561v-.007c.217-.431.145-.839-.172-1.106-.562-.548-1.41-1.153-2.076-1.542z"/><path d="m13.169 8.104c.961.056 1.427.558 1.477 1.589.018.403.603.375.585-.028-.064-1.346-.766-2.096-2.03-2.166-.385-.023-.421.582-.032.605z"/></g></svg>' + "<span>Viber</span>" + "</a>" + '<a class="gbox-share__button gbox-share__button--wa" href="whatsapp://send?text={{descr}} {{url}}">' + '<svg height="682pt" viewBox="-23 -21 682 682.66669" width="682pt" xmlns="http://www.w3.org/2000/svg"><path d="m544.386719 93.007812c-59.875-59.945312-139.503907-92.9726558-224.335938-93.007812-174.804687 0-317.070312 142.261719-317.140625 317.113281-.023437 55.894531 14.578125 110.457031 42.332032 158.550781l-44.992188 164.335938 168.121094-44.101562c46.324218 25.269531 98.476562 38.585937 151.550781 38.601562h.132813c174.785156 0 317.066406-142.273438 317.132812-317.132812.035156-84.742188-32.921875-164.417969-92.800781-224.359376zm-224.335938 487.933594h-.109375c-47.296875-.019531-93.683594-12.730468-134.160156-36.742187l-9.621094-5.714844-99.765625 26.171875 26.628907-97.269531-6.269532-9.972657c-26.386718-41.96875-40.320312-90.476562-40.296875-140.28125.054688-145.332031 118.304688-263.570312 263.699219-263.570312 70.40625.023438 136.589844 27.476562 186.355469 77.300781s77.15625 116.050781 77.132812 186.484375c-.0625 145.34375-118.304687 263.59375-263.59375 263.59375zm144.585938-197.417968c-7.921875-3.96875-46.882813-23.132813-54.148438-25.78125-7.257812-2.644532-12.546875-3.960938-17.824219 3.96875-5.285156 7.929687-20.46875 25.78125-25.09375 31.066406-4.625 5.289062-9.242187 5.953125-17.167968 1.984375-7.925782-3.964844-33.457032-12.335938-63.726563-39.332031-23.554687-21.011719-39.457031-46.960938-44.082031-54.890626-4.617188-7.9375-.039062-11.8125 3.476562-16.171874 8.578126-10.652344 17.167969-21.820313 19.808594-27.105469 2.644532-5.289063 1.320313-9.917969-.664062-13.882813-1.976563-3.964844-17.824219-42.96875-24.425782-58.839844-6.4375-15.445312-12.964843-13.359374-17.832031-13.601562-4.617187-.230469-9.902343-.277344-15.1875-.277344-5.28125 0-13.867187 1.980469-21.132812 9.917969-7.261719 7.933594-27.730469 27.101563-27.730469 66.105469s28.394531 76.683594 32.355469 81.972656c3.960937 5.289062 55.878906 85.328125 135.367187 119.648438 18.90625 8.171874 33.664063 13.042968 45.175782 16.695312 18.984374 6.03125 36.253906 5.179688 49.910156 3.140625 15.226562-2.277344 46.878906-19.171875 53.488281-37.679687 6.601563-18.511719 6.601563-34.375 4.617187-37.683594-1.976562-3.304688-7.261718-5.285156-15.183593-9.253906zm0 0" fill-rule="evenodd"/></svg>' + "<span>WhatsApp</span>" + "</a>" + "</p>" + '<p><input class="gbox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p>' + "</div>"
		}
	});

	function escapeHtml(string) {
		var entityMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
			"/": "&#x2F;",
			"`": "&#x60;",
			"=": "&#x3D;"
		};
		return String(string).replace(/[&<>"'`=\/]/g, function(s) {
			return entityMap[s];
		});
	}
	$(document).on("click", "[data-gbox-share]", function() {
		var instance = $.gbox.getInstance(),
			current = instance.current || null,
			url, tpl;
		if (!current) {return;}
		if ($.type(current.opts.share.url) === "function") {
			url = current.opts.share.url.apply(current, [instance, current]);
		}
		tpl = current.opts.share.tpl.replace(/\{\{media\}\}/g, current.type === "image" ? encodeURIComponent(current.src) : "").replace(/\{\{url\}\}/g, encodeURIComponent(url)).replace(/\{\{url_raw\}\}/g, escapeHtml(url)).replace(/\{\{descr\}\}/g, current.opts.caption ? current.opts.caption : current.opts.m_caption ? current.opts.m_caption : '');
		$.gbox.open({
			src: instance.translate(instance, tpl),
			type: "html",
			opts: {
				touch: false,
				animationEffect: false,
				afterLoad: function(shareInstance, shareCurrent) {
					// Close self if parent instance is closing
					instance.$refs.container.one("beforeClose.fb", function() {
						shareInstance.close(null, 0);
					});
					// Opening links in a popup window
					shareCurrent.$content.find(".gbox-share__button").click(function() {
						window.open(this.href, "Share", "width=550, height=450");
						return false;
					});
				},
				mobile: {
					autoFocus: false
				}
			}
		});
	});
})(document, jQuery);

// Hash. Enables linking to each modal
(function(window, document, $) {
	"use strict";
	// Simple $.escapeSelector polyfill (for jQuery prior v3)
	if (!$.escapeSelector) {
		$.escapeSelector = function(sel) {
			var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
			var fcssescape = function(ch, asCodePoint) {
				if (asCodePoint) {
					// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
					if (ch === "\0") {
						return "\uFFFD";
					}
					// Control characters and (dependent upon position) numbers get escaped as code points
					return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
				}
				// Other potentially-special ASCII characters get backslash-escaped
				return "\\" + ch;
			};
			return (sel + "").replace(rcssescape, fcssescape);
		};
	}
	// Get info about gallery name and current index from url
	function parseUrl() {
		var hash = window.location.hash.substr(1),
			rez = hash.split("-"),
			index = rez.length > 1 && /^\+?\d+$/.test(rez[rez.length - 1]) ? parseInt(rez.pop(-1), 10) || 1 : 1,
			gallery = rez.join("-");
		return {
			hash: hash,
			/* Index is starting from 1 */
			index: index < 1 ? 1 : index,
			gallery: gallery
		};
	}
	// Trigger click evnt on links to open new gbox instance
	function triggerFromUrl(url) {
		if (url.gallery !== "") {
			// If we can find element matching 'data-gbox' atribute, then triggering click event should start gbox
			$("[data-gbox='" + $.escapeSelector(url.gallery) + "']").eq(url.index - 1).focus().trigger("click.fb-start");
		}
	}
	// Get gallery name from current instance
	function getGalleryID(instance) {
		var opts, ret;
		if (!instance) {return false;}
		opts = instance.current ? instance.current.opts : instance.opts;
		ret = opts.hash || (opts.$orig ? opts.$orig.data("gbox") || opts.$orig.data("gbox-trigger") : "");
		return ret === "" ? false : ret;
	}
	// Start when DOM becomes ready
	$(function() {
		// Check if user has disabled this module
		if ($.gbox.defaults.hash === false) {return;}
		// Update hash when opening/closing gbox
		$(document).on({
			"onInit.fb": function(e, instance) {
				var url, gallery;
				if (instance.group[instance.currIndex].opts.hash === false) {return;}
				url = parseUrl();
				gallery = getGalleryID(instance);
				// Make sure gallery start index matches index from hash
				if (gallery && url.gallery && gallery == url.gallery) {
					instance.currIndex = url.index - 1;
				}
			},
			"beforeShow.fb": function(e, instance, current, firstRun) {
				var gallery;
				if (!current || current.opts.hash === false) {return;}
				// Check if need to update window hash
				gallery = getGalleryID(instance);
				if (!gallery) {return;}
				// Variable containing last hash value set by gbox. It will be used to determine if gbox needs to close after hash change is detected
				instance.currentHash = gallery + (instance.group.length > 1 ? "-" + (current.index + 1) : "");
				// If current hash is the same (this instance most likely is opened by hashchange), then do nothing
				if (window.location.hash === "#" + instance.currentHash) {return;}
				if (firstRun && !instance.origHash) {
					instance.origHash = window.location.hash;
				}
				if (instance.hashTimer) {
					clearTimeout(instance.hashTimer);
				}
				// Update hash
				instance.hashTimer = setTimeout(function() {
					if ("replaceState" in window.history) {
						window.history[firstRun ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + "#" + instance.currentHash);
						if (firstRun) {
							instance.hasCreatedHistory = true;
						}
					} else {
						window.location.hash = instance.currentHash;
					}
					instance.hashTimer = null;
				}, 300);
			},
			"beforeClose.fb": function(e, instance, current) {
				if (!current || current.opts.hash === false) {return;}
				clearTimeout(instance.hashTimer);
				// Goto previous history entry
				if (instance.currentHash && instance.hasCreatedHistory) {
					window.history.back();
				} else if (instance.currentHash) {
					if ("replaceState" in window.history) {
						window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (instance.origHash || ""));
					} else {
						window.location.hash = instance.origHash;
					}
				}
				instance.currentHash = null;
			}
		});
		// Check if need to start/close after url has changed
		$(window).on("hashchange.fb", function() {
			var url = parseUrl(),
				fb = null;
			// Find last gbox instance that has "hash"
			$.each($(".gbox-container").get().reverse(), function(index, value) {
				var tmp = $(value).data("gbox");
				if (tmp && tmp.currentHash) {
					fb = tmp;
					return false;
				}
			});
			if (fb) {
				// Now, compare hash values
				if (fb.currentHash !== url.gallery + "-" + url.index && !(url.index === 1 && fb.currentHash == url.gallery)) {
					fb.currentHash = null;
					fb.close();
				}
			} else if (url.gallery !== "") {
				triggerFromUrl(url);
			}
		});
		// Check current hash and trigger click event on matching element to start gbox, if needed
		setTimeout(function() {
			if (!$.gbox.getInstance()) {
				triggerFromUrl(parseUrl());
			}
		}, 50);
	});
})(window, document, jQuery);

// Wheel. Basic mouse weheel support for gallery navigation
(function(document, $) {
	"use strict";
	var prevTime = new Date().getTime();
	$(document).on({
		"onInit.fb": function(e, instance, current) {
			instance.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function(e) {
				var current = instance.current,
					currTime = new Date().getTime();
				if (instance.group.length < 2 || current.opts.wheel === false || (current.opts.wheel === "auto" && current.type !== "image")) {return;}
				e.preventDefault();
				e.stopPropagation();
				if (current.$slide.hasClass("gbox-animated")) {return;}
				e = e.originalEvent || e;
				if (currTime - prevTime < 250) {return;}
				prevTime = currTime;
				instance[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "next" : "previous"]();
			});
		}
	});
})(document, jQuery);

function sendGalleryMsg(form) {
   form.parentNode.querySelector('.js-form-gallery-done').style.display = 'block';
}

function noSendGalleryMsg(form) {
   form.parentNode.querySelector('.js-form-gallery-fail').style.display = 'block';
}