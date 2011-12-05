/**
 * @fileoverview ���̶Ի���
 *
 * @author qijun.weiqj
 */
(function($, WP){


var Dialog = new WP.Class({
	/**
	 * �Ի���ģ��
	 */
	__$template:
		'<div class="d-body">\
			<% if (header) { %>\
			<div class="d-header">\
				<h3><%= header %></h3>\
				<% if (hasClose) { %>\
				<a class="d-close" href="#"></a>\
				<% } %>\
			</div>\
			<% } %>\
			<div class="d-content">\
				<%= content %>\
			</div>\
			<% if (hasFooter) { %>\
			<div class="d-footer">\
				<div class="d-confirm-loading"></div>\
				<div class="d-btn-wrap">\
				<% foreach (buttons as button) { %>\
					<a href="#" class="<%= button["class"] %>" href="javascript:;">\
						<span><%= button.value %></span>\
					</a>\
				<% } %>\
				</div>\
			<% } %>\
			</div>\
		</div>',

	/**
	 * �Ի����캯��
	 * @param {object} config
	 * - header {string} �Ի������
	 * - center {boolean} �Ƿ����, Ĭ��Ϊtrue
	 * - hasClose {boolean} �Ƿ���йرհ�Ť, Ĭ��Ϊtrue
	 * - content {string|function(callback(html))} �Ի�������, ������һ���ص�����
	 * - buttons {array<{ 'class': {string}, 'value': {string} }>} �Ի���Ť
	 * - hasFooter {boolean} �Ƿ��е���
	 *
	 * - width: {number} ���
	 * - height: {number} �߶�
	 * - centerFooter: {boolean} �Ƿ���еײ� 
	 *
	 * - contentUrl {string} �첽����Ի�������, ��Ҫ�ṩURL
	 * - ajaxParams {object} �첽����Ի�������ʱ, ajax����
	 * - contentParams {object} ͬ��(����)
	 * - contentSuccess {function(this)} �첽����Ի����ص�����
	 *
	 * - defaultClassName {string} Ĭ�϶Ի�����ʽ, Ĭ��Ϊwp-dialog
	 * - className {string} �Ի�����ʽ
	 *
	 * - draggable {boolean|object} �Ƿ�֧���϶�, Ĭ�ϲ�֧��
	 * - handler {string} �϶�����
	 * - beforeClose {function(this)} �Ի���ر�ǰ����
	 * - close {function(this)} �������"�ر�(.d-close)"��Ť, �����˰�Ťʱ, ���ô˷���
	 * - cancel {function(this)} �������"ȡ��(.d-cancel)"��Ť, �����˰�Ťʱ, ���ô˷���
	 * - confirm {function(this)} �������"ȷ��(.d-confirm)"��Ť, �����˰�Ťʱ, ���ô˷���
	 *
	 */
	init: function(config) {
		config = this.config = $.extend({
			header: false,
			center: true,
			hasClose: true,
			buttons: []
		}, config);

		// ��ʼ����̬��������
		var content = config.content;
		if (typeof content !== 'string') {
			config.content = '<div class="d-loading">���ڼ���...</div>';
			this.__$contentLoader = content;
		}

		// ���û�а�Ť, ����Ҫ��ʾfooter
		config.hasFooter === undefined &&
				(config.hasFooter = !!config.buttons.length);

		// �����contentUrl��ʹ��ajaxContentCallback
		if (config.contentUrl) {
			this.__$contentLoader = $.proxy(this, '__$ajaxContentLoader');
		}

		this.__$loadTemplate($.proxy(this, '__$openDialog'));
	},

	/**
	 * �첽����Ի�������
	 */
	__$ajaxContentLoader: function(callback) {
		var config = this.config,
			error = function() {
				// ����ʧ��
				callback(false);
			},
			options = $.extend({
				cache: false
			}, config.ajaxParams);

		options.data = options.data || config.contentParams;

		$.extend(options, {
			success: function(html){
				// �����������ؿջ�����htmlҳ��(302��ת)ʱ, ����������
				if (!html || /<html[^>]*>/i.test(html)) {
					error();
					return;
				}
				callback(html);
			},
			error: error
		});

		$.ajax(config.contentUrl, options);
	},

	/**
	 * ����template, Ȼ�����callback
	 * ����dialogʹ�õĵط�����û������web-sweet��(ǰ̨ҳ��), ���Բ���use��̬����
	 */
	__$loadTemplate: function(callback) {
		var self = this,
			tpl = Dialog._template;
		if (tpl) {
			return callback(tpl);
		} else if (true) {
        
    } else if (true) {
        
    } else {
        
    }

		$.use('web-sweet', function() {
			var tpl = Dialog._template = FE.util.sweet(self.__$template);
			callback(tpl);
		});
	},

	/**
	 * ��ʾ�Ի���
	 * ��̬����ui-dialog
	 * �����Ҫ�϶�, ��̬���� ui-draggable
	 */
	__$openDialog: function(tpl) {
		var self = this,
			config = this.config,
			node = null,
			use = ['ui-dialog'];

		node = this.node = $('<div>').html(tpl.applyData(config));
	
		this.__$configNode(node, config);

		if (config.beforeOpen && config.beforeOpen(this) !== false) {
			return;
		}

		// �����Ҫ֧���϶�, �������϶���
		if (config.draggable) {
			use.push('ui-draggable');
		}

		$.use(use, function() {
			node.dialog(self.__$getDialogConfig(config));
			self.__$handleEvents();

			// ��Ҫ�첽����Ի�������
			if(self.__$contentLoader){
				self.__$loadContent();
			} else {
				self.__$contentSuccess();
			}
		});
	},

	__$configNode: function(node, config) {
		node.addClass((config.defaultClassName || 'wp-dialog') + 
				' ' + (config.className || ''));

		config.width && $('div.d-body', node).css('width', config.width);
		config.height && $('div.d-loading', node).css({
			height: config.height,
			'line-height': config.height
		});

		config.centerFooter && $('div.d-footer', node).addClass('align-center'); 
	},

	/**
	 * ȡ�öԻ���������Ϣ
	 */
	__$getDialogConfig: function(config) {
		var self = this,
			ret = {
				shim: true,
				center: config.center
			},
			draggable = config.draggable;

		if (draggable) {
			ret.draggable = $.isPlainObject(draggable) ?
					draggable : { handle: 'div.d-header' };
		}

		if (config.beforeClose) {
			ret.beforeClose = function() {
				return config.beforeClose(self);
			};
		}
		return ret;
	},

	/**
	 * ����Ի���Ť�¼�
	 */
	__$handleEvents: function() {
		this.__$handleBtnEvents();
		this.__$handleDefaultEvents();
	},

	/**
	 * ����close,cancel,confirm���¼�
	 */
	__$handleBtnEvents: function() {
		var self = this,
			config = this.config,
			node = this.node;
		
		$.each(['close', 'cancel', 'confirm'], function(i, op) {
			$('.d-' + op, node).bind('click', function(e) {
				e.preventDefault();
				var elm = $(this);
				if (elm.data('dialog-running')) {
					return;
				}
				
				elm.data('dialog-running', true);
				setTimeout(function() {
					elm.data('dialog-running', false);
				}, 500);
				
				config[op] ? config[op](self) : self.close();
			});
		});
	},
				   
	/**
	 * ����Ĭ�ϰ�Ť�¼�
	 */
	__$handleDefaultEvents: function() {
		var self = this,
			btn = $('.d-default', this.node).eq(0);
		
		if (!btn.length) {
			return;
		}
		
		// ���ڹرնԻ���ʱ�Ƴ��¼�
		this.__$defaultEventHandler = function(e) {
			if (e.keyCode === 13) {
				btn.click();
				return false;
			}
		};
		$(document).bind('keydown', this.__$defaultEventHandler);
	},

	/**
	 * �첽����Ի�������
	 */
	__$loadContent: function(loader){
		var self = this,
			config = this.config,
			container = this.getContainer(),
			loader = loader || this.__$contentLoader;
		
		loader(function(html) {
			html = html || '<div class="d-error">���緱æ����ˢ�º�����</div>';
			container.html(html);
			self.__$contentSuccess();
		});
	},

	__$contentSuccess: function() {
		var self = this,
			config = this.config;

		if (!config.contentSuccess) {
			return;
		}

		$.util.ua.ie6 ? setTimeout(function() {
			config.contentSuccess(self);
		}, 0) : config.contentSuccess(this);
	},

	/**
	 * �����첽����Ի���
	 */
	reload: function(loader) {
		return this.__$loadContent(loader);
	},

	/**
	 * ���öԻ������
	 */
	setTitle: function(title) {
		$('d-header h3', this.node).text(title);	
	},
		
	/**
	 * ���öԻ�������
	 */
	setContent: function(html) {
		this.getContainer().html(html);
	},

	/**
	 * ȡ�öԻ�����������
	 */
	getContainer: function() {
		if (!this.__$container) {
			this.__$container = $('div.d-content', this.node);
		}
		return this.__$container;
	},
			
	/**
	 * �رնԻ���
	 */
	close: function() {
		this.__$defaultEventHandler &&
				$(document).unbind('keydown', this.__$defaultEventHandler);
		return this.node.dialog('close');
	},

	submit: function() {
		this.config['confirm'] && this.config['confirm'](this); 
	},
	   
	/**
	 * ��ʾ�Ի���loadingͼ��
	 * @param {string|boolean} text
	 * TOOD �˷��������ع��ɸ���ͨ��
	 */
	showLoading: function(text){
		var self = this,
			node = this.node,
			loading = $('div.d-confirm-loading', node),
			btnWrap = $('div.d-btn-wrap', node),
			confirm = $('a.d-confirm', node);
		
		if (text === false) {
			loading.hide();
			btnWrap.show();
		} else {
			loading.html(text);
			btnWrap.hide();
			loading.show();
		}
	}
});
//~Dialog


Dialog.open = function(config) {
	return new Dialog(config);
};


WP.widget.Dialog = Dialog;
$.add('wp-dialog');


})(jQuery, Platform.winport);

