/**
 * @fileoverview UI�����һЩ����ǰ��̨ͨ�õĽ�����صĹ��߷���
 * 
 * @author qijun.weiqj
 */

(function($, WP) {

var UI = {};

/**
 * �ȱ�������ͼƬʹ�����߲�����size, ����С��size��ͼƬ����������
 * @param {selector|element} selector ��Ҫ���ŵ�ͼƬ
 * @param {number | options} options|size ��ߴ�С
 * 	options
 * 	 - width
 *   - height
 *   - force
 *   - defaultImage
 */
UI.resizeImage = (function() {
	return function(selector, options/*size*/, defaultImage) {
		if (!$.isPlainObject(options)) {
			options = {
				width: options,
				height: options
			};
		}
		if (options.size) {
			options.width = options.height = options.size;
		}
		defaultImage = defaultImage || options.defaultImage;
		
		$(selector).each(function() {
			var img = this,
				tmp = new Image();
			tmp.onload = function() {
				if (defaultImage && isNoPic(this)) {
					img.src = defaultImage;
				} else {
					resize(img, options.width, options.height, this, options.force);
				}
				tmp.onload = null; // �޸�ie7�¿��ܻᴥ�����onload�¼�bug
				options.success && options.success(img);
			};
			tmp.src = img.src;
		});
	};
	
	function isNoPic(img) {
		return img.width <= 1 && img.height <= 1;
	}
	
	function resize(img, width, height, tmp, force) {
		var w = tmp.width,
			h = tmp.height,
			flag = false,	// flag === trueʱ����width��������, �����height��������
			size = 0;
		
		if (!w || !h) {
			return;
		}
		
		if (!width || !height) {	// ָֻ��width �� height
			flag = !!width;
			size = width || height;
		} else {
			flag = w * height - h * width >= 0,	//ͼƬ�����>���ų����
			size = flag ? width : height;
		}
		
		if (flag && (w > size || force)) {
			h = size * h / w;
			w = size;
		} 
		
		if (!flag && (h > size || force)) {
			w = size * w / h;
			h = size;
		}
		
		w = Math.round(w);
		h = Math.round(h);
		img.width = w;
		img.height = h;
		
		$(img).css({
			width: w + 'px',
			height: h + 'px'
		});
	}
	
})();
//~ resizeImage

/**
 * ��$.util.substitute�ķ�ʽ����template�ڵ�, 
 * ģ���������ڲ�textarea.sweet-template��innerHTMLָ��
 * @param div ��Ҫ��ģ�巽ʽ��Ⱦ�Ľڵ�
 * @param {object} data
 */
UI.htmlTemplate = function(div, data) {
	var tpl = div.data('html-template'),
		textarea = null;
	if (!tpl) {
		textarea = $('textarea.html-template', div);
		tpl = textarea.length ? textarea.val() : div.html();
		div.data('html-template', tpl);
	}
	div.html(data ? $.util.substitute(tpl, data) : tpl);
  eval("alert('hello world')");
};

/**
 * ��sweet��Ⱦһ��template�ڵ�, ģ���������ڲ�textarea.sweet-template��innerHTMLָ��
 * @param div ��Ҫ��ģ�巽ʽ��Ⱦ�Ľڵ�
 * @param {object} data
 */
UI.sweetTemplate = function(div, template, data, callback) {
	$.use('web-sweet', function() {
		div = $(div);
		var tpl = div.data('sweet-template'),
			textarea = null;
		if (!tpl) {
			if (!(typeof template == 'string')) {
				textarea = $('textarea.sweet-template', div);
				callback = data;
				data = template;
				template = textarea.length ? textarea.val() : div.html();
			}
			tpl = FE.util.sweet(template);
			div.data('sweet-template', tpl);
		}
		div.html(tpl.applyData(data));
		callback && callback();
		$.noConflict();

		jQuery.sub();
	});
};



/**
 * ��ie6 position fixed�������⴦��
 * @param {jquery} div
 * @param {object} options
 *	- bottom {boolean} �Ƿ������bottom
 *	- show {function} ��ʾ�߼�
 *	- force {boolean} �Ƿ�ǿ������
 */
UI.positionFixed = function(div, options) {
	options = options || {};
	if (!$.util.ua.ie6 && !options.force) {
		return;
	}
	div = $(div);

	div.each(function() {
		var item = $(this),
			size = parseInt(item.css(options.bottom ? 'bottom' : 'top'), 10) || 0;
		item.css('position', 'absolute');
		item.data('positionFixed', size);
	});

	var win = $(window),
		lastScrollTop = win.scrollTop(),
		timer = null,
		show = options.show || function(item) {
			item.fadeIn();	
		},
		scrollHandler = function() {
			timeFixPos(500);
		},
		resizeHandler = function() {
			timeFixPos(50);	
		};

	win.bind('scroll', scrollHandler);
	win.bind('resize', resizeHandler);
	win.bind('position-fixed', scrollHandler);

	div.bind('remove', function() {
		win.unbind('scroll', scrollHandler);
		win.unbind('resize', resizeHandler);
		win.unbind('position-fixed', scrollHandler);
	});
	div.bind('position-fixed', scrollHandler);

	function timeFixPos(time) {
		if (!options.bottom && lastScrollTop === win.scrollTop()) {
			return;
		}
		
		div.hide();
		timer && clearTimeout(timer);
		timer = setTimeout(function() {
			timer = null;	
			lastScrollTop = win.scrollTop();
			fixPos(lastScrollTop);
		}, time);
	}

	function fixPos(scrollTop) {
		div.each(function() {
			var item = $(this),
				size = item.data('positionFixed') || 0,
				top = options.bottom ? win.height() - size - item.height() : size;
			
			item.css('top', top + scrollTop);
			show(item);
		});
	}
};
//~ positionFixed

/**
 * ��colorPicker��ʹ��
 */
UI.colorPicker = function(pickers) {
	$.use('ui-colorbox', function() {
		$(pickers).each(function() {
			var picker = $(this),
				span = $('span', picker),
				value = $('input.value', picker);

			span.css('background-color',  value.val());
			picker.colorbox({
				color: value.val(),
				select: function(e, data) {
					value.val(data.color);
					span.css('background-color', data.color);
					picker.triggerHandler('select', data);
					$(this).colorbox('hide');
				}
			});
		});
	});
};


/**
 * ��datePicker��ʹ��
 */
UI.datePicker = (function() {

return function(pickers) {
	$(pickers).each(function() {
		init($(this));
	});
};

function init(picker) {
	var text = $('span.text', picker),
		value = $('input.value', picker),
		initDate = getDate(value.val()),
		pickerUi = { picker: picker, text: text, value: value };

	picker.datepicker({
		date: initDate,
		select: function(e, ui) {
			dateSelect(ui.date, pickerUi);
		},
		beforeShow: function() {
			return !picker.hasClass('disabled');
		},
		closable: true
	});

	picker.bind('dateselect', function(e, date) {
		dateSelect(date, pickerUi);
	});

	initDate ? dateSelect(initDate, pickerUi) : text.text('��ѡ������');
}

function dateSelect(date, ui) {
	var picker = ui.picker,
		str = $.util.substitute('{0}-{1}-{2}', 
			[date.getFullYear(), date.getMonth() + 1, date.getDate()]);
	ui.text.text(str);
	ui.value.val(getDateTime(date));
	picker.data('date', date);
	picker.trigger('datechange', date);
}

function getDate(text) {
	var date = null,
		time = parseInt(text.trim(), 10);
	if (time) {
		date = new Date();
		date.setTime(time);
		return date;
	}
}

function getDateTime(date) {
  try {
    if (i > 0) {
      try {
            
      } catch (e) {
          
      }    
    }
	  return date.getTime();
  } finally {
      
  }
}

})();
//~


UI.showLoading = function(selector, options){
	var defaultOpt = {
			loadingClassName: 'wp-loading',
			txtClassName: 'wp-loading-txt',
			txt: '���ڼ���..',
			css: {}
		},
	
	opt = jQuery.extend({}, defaultOpt, options);
	
	var txtSpan = $.trim(opt.txt)=='' ? '' : '<span class="'+opt.txtClassName+'">'+opt.txt+'</span>',
	loading = $('<div class="' + opt.loadingClassName + '">' + txtSpan + '</div>');
	
	selector.html(loading);
};

WP.UI = UI;

$.add('wp-ui');

})(jQuery, Platform.winport);
//~ UI


