/**
 * @fileoverview �����
 * 
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util;

/**
 * ������ʹ�÷���
 * 1. 	new TraceLog([
 * 			[selector1, tracelog1] // ���������Ϣ, selector ����Ϊ{string|element|jquery}
 *  		[selector2, tracelog2] 
 * 		], options); 	// ��ѡ������
 * 
 * 2. 	new TraceLog([
 * 			[selector1, function(e, data) {	// �ڶ���������Ϊfunction
 * 				// ���ݽڵ㷵����Ҫ��tracelog
 * 				var page = $(this).data('page-type');
 * 				...
 * 				return tracelog;
 * 			}],
 * 			...
 * 		]);
 * 
 * 3. 	new TraceLog('selector', 'tracelog', ...); 	// ���ֻ��һ���������, ��ʹ�����ַ�ʽ
 * 
 * 4. 	new TraceLog([...], { when: 'inputtext' };	// ������仯ʱ�Ŵ��
 * 
 * 5. 	new TraceLog([...], { event: 'mouseenter', once: true };	// ������ʱ���, ����ֻ��һ��
 * 
 * 6. 	new TraceLog(element, { // �ع���
 * 			when: 'exposure', 
 * 			url: 'http://ctr.china.alibaba.com/ctr.html',
 * 			param: { ctr_type: 32, keyword: ... }
 * 		});
 *
 * @param fields	���������Ϣ
 * @param options 	��ѡ������
 * 	- when {string|function(elm, callback, options)} ���ʱ�� 
 * 			default: Ĭ�ϴ��
 * 			exposure: �ع���
 * 			inputtext: ������仯ʱ�Ŵ��
 * 			{function}: �Զ�����ʱ��
 * 
 *  - event ������Ĭ�ϴ�㷽ʽ(when=default)ʱ�� ����ָ������¼�, exp; mousedown
 *  
 *  - delegate {string|true} ����Ĭ�ϴ�㷽ʽ��inputtext���ʱ, ��ָ��ʹ��delegate�¼�����ʽ
 *  		��Ϊtrue, �൱�� delegagte: 'body'
 * 			 
 * 	- how {function(name, elm, options)} ��δ��
 * 			Ĭ�ϲ���aliclick���
 * 			{function}: ����ָ���Զ����㷽ʽ
 *  - url {string} �����Ĭ�ϴ��(how=default)ʱ�� ����ָ����url����ʹ��aliclick���
 * 	- param {function(elm)} ���Ϊurl���ʱ, ��Ϊ���Ӳ���
 * 
 * ����ʹ�÷���, �ɲο����̵�tracelog�ļ�
 * 	1. module/mod/core/rec-advertisment.js  �ع���, ��ָ��url���
 *  2. page/default/tracelog/*, page/diy/tracelog/*  
 *  
 */
var TraceLog = function(fields, options) {
	if (!$.isArray(fields)) {
		fields = [fields];
		if (!$.isPlainObject(options)) {
			fields.push(options)
			options = arguments[2];
		}
	}
	if (!$.isArray(fields[0])) {
		fields = [fields];
	}
	options = options || {};
	
	var when = option('When', options.when),
		how = option('How', options.how);
	
	$.each(fields, function() {
		var field = this,
			selector = field[0],
			name = field[1];
		when(selector, function() {
			var tracelog = typeof name === 'function' ? 
					name.apply(this, arguments) : name;
			tracelog !== false && how(tracelog, this, options, arguments);
		}, options);
	});
	
	function option(type, name) {
		name = name || 'default';
		return typeof name === 'string' ? 
				$.proxy(TraceLog[type], name) :
				$.proxy(name, options);
	}

};

/**
 * ���ʱ��
 */
TraceLog.When = {
	/**
	 * Ĭ�ϴ��, �¼���options.whenָ��, Ĭ��Ϊclick
	 */
	'default': function(selector, callback, options) {
		var once = options.once,
			delegate = options.delegate,
			handler = function() {
				var elm = $(this);
				if (once && elm.data('tracelog-once')) {
					return;
				}
				callback.apply(this, arguments);
				once && elm.data('tracelog-once', true);
			};
					
		if (delegate) {
			delegate = delegate === true ? 'body' : delegate;
			$(delegate).delegate(selector, 
					options.event || this._getDelegateEvent(selector), handler)
		} else {
			var elm = $(selector);
			if (elm.length > 5) {
				$.log('TraceLog warn: more than 5 element matches with selector: ' + selector);
			}
			elm.bind(options.event || this._getDefaultEvent(elm), handler);
		}
	},
	
	_getDefaultEvent: function(elm) {
		if (elm.is('a,button')) {
			return 'mousedown';
		}
		if (elm.is('select')) {
			return 'change';
		}
		return elm.is('input') && 
				elm.attr('type') === 'text' ? 'blur' : 'mousedown';
	},
	
	_getDelegateEvent: function(selector) {
		if (typeof selector !== 'string') {
			$.error('argument error, should be an string.');
		}
			
		var // selector tag.class || selector tag[name=value..] || selector tag.class[name=value]
			tag = (/\b([\w-]+)(?:\.[\w-]+)*(?:\[[^\]]+\])*$/.exec(selector) || {})[1];

		return tag === 'input' ? 'click' :
			tag === 'select' ? 'change' : 'mousedown';
	},
	
	/**
	 * �������(�б仯ʱ)
	 */
	inputtext: function(selector, callback, options) {
		var delegate = options.delegate,
			focusin = function() {
				var elm = $(this);
				elm.data('tracelog-last', elm.val());
			},
			focusOut = function() {
				var elm = $(this);
				if (elm.data('tracelog-last') !== elm.val()) {
					callback.apply(this, arguments);
				}
			};
		
		delegate = delegate === true ? 'body' : delegate;
		
		if (delegate) {
			$(delegate).delegate(selector, 'focusin', focusin);
			$(delegate).delegate(selector, 'focusout', focusOut);
		} else {
			selector = $(selector);
			selector.bind('focus', focusin);
			selector.bind('blur', focusOut);
		};
	},
	
	/**
	 * �ع���
	 */
	exposure: function(selector, callback, options) {
		var self = this,
			elm = $(selector),
			handler = function() {
				if (elm.data('tracelog-exposure')) {
					return;
				}
				if (self._isVisible(elm)) {
					callback.call(elm);
					elm.data('tracelog-exposure', true);
				};
			};
		$(window).bind('scroll resize', handler);
		handler();
	},
	
	/**
	 * �ж�Ԫ���Ƿ�ɼ�
	 * 1.Ԫ�ؿɼ�
	 * 2.����ƫ��<Ԫ��top
	 * 3.����ƫ��+��Ļ�߶� > Ԫ��top
	 */
	_isVisible: function(elm) {
		var win = $(window),
			eTop = elm.offset().top,
			sTop = win.scrollTop();
		return elm.is(':visible') && sTop < eTop && eTop < sTop + win.height();
	}
};

/**
 * ��㷽ʽ
 */
TraceLog.How = {
	/**
	 * ��δ�㣺
	 * 1. ָ�� options.url���
	 * 2. Ĭ��Ϊaliclick���
	 */
	'default': function(name, elm, options) {
		var params = typeof options.param === 'function' ? 
				options.param(elm) : options.param;
		if (options.url) {
			var img = new Image();
			img.src = Util.formatUrl(options.url, params || {});
		} else if (name) {
			aliclick(null, '?tracelog=' + name);
		}
	}
};


WP.widget.TraceLog = TraceLog;
$.add('wp-tracelog');

})(jQuery, Platform.winport);
