/**
 * @fileoverview ������Ϣ��
 *	1. ��������ط��Զ�����
 *	2. ָ��ʱ����Զ�����
 
 * @author qijun.weiqj
 */
(function($, WP) {

/**
 * @constractor
 * @param {selector|element} panel ����ڵ�
 * @param {object} options
 * 	- handler {element|string} ����˽ڵ�, ���panel
 * 	- event {string} ��panel���¼�, Ĭ��Ϊclick
 *  - autoClose {boolean|integer} �Զ��رճ�ʱʱ��(ms), Ĭ��Ϊ3000ms
 *  - closeOnBlur {boolean} ��������ط��Ƿ��Զ��ر�, Ĭ��Ϊtrue
 *  - toggle {boolean} �����Ϊtrue, ��������ʾʱ, ����handlerʱ����
 */
var FloatPanel = function(panel, options) {
	this._init.apply(this, arguments);
};
FloatPanel.prototype = {
	
	_init: function(panel, options) {
		this.panel = $(panel).eq(0);
		this.options = options || {};
		this.link = $(this.options.handler);
		
		this._handleLink();
		this._handleClose();
		this._handleCloseOnBlur();
		this._handleAutoClose();
	},
	
	/**
	 * ����handler�¼�
	 * ���(������)ʱ��Ҫ��ʾ����
	 */
	_handleLink: function() {
		var self = this;
		
		this.link.bind(this.options.event || 'click', function() {
            self.clear();
			if (!self.isShow) {
				self.show();
			} else if (self.options.toggle) {
				self.hide();
			}
        });
		
		this.link.click(function(e) {
			var elm = $(this);
			if (elm.is('a') && elm.attr('href') === '#') {
				e.preventDefault();
			}
		});
		
        this.hide();
	},
	
	/**
	 * ���close�رո���
	 */
	_handleClose: function() {
		var self = this;
		$('.close', this.panel).click(function(){
			self.hide();
			return false;
		});
    },
	
	/**
	 * ��������ط��رո���
	 */
	_handleCloseOnBlur: function() {
		if (this.options.closeOnBlur === false) {
			return;
		}
		var self = this;
		$(document).click(function(e) {
			if (!self.isShow) {
				return;
			}
			var target = e.target;
			if (target !== self.link[0] && target !== self.panel[0] &&
					self.link.has(target).length === 0 && self.panel.has(target).length === 0) {
				self.hide();
			}
		}); 
	},

	/**
	 * ����ƿ�ʱ�Զ��رո���
	 */
    _handleAutoClose: function () {
        var autoClose = this.options.autoClose;
        if (autoClose === false) {
            return;
        }
        
        var self = this,
			elms = $(this.panel).add(this.link),
			time = parseInt(autoClose, 10) || 3000,
			clear = $.proxy(this, 'clear'),
			hide = $.proxy(this, 'hide');
			
		elms.mouseleave(function() {
			self.clear();
			self._timer = setTimeout(hide, time);
			elms.one('mousemove', clear);
		});
    },
	
	clear: function() {
		this._timer && clearTimeout(this._timer);
		this._timer = null;
	},
	
	show: function() {
		if (this.isShow) {
			return;
		}
		if (this.options.beforeShow && this.options.beforeShow() === false || 
				this.panel.triggerHandler('before') === false) {
			return;
		}
		
		this.isShow = true;
		this._op('show');
		this.options.onshow && this.options.onshow();
		this.panel.triggerHandler('show');
		$.log('floatpanel show ');
		$.log(this.panel[0]);
	},
	
	hide: function() {
		if (!this.isShow) {
			return;
		}
		
		this.isShow = false;
		this._op('hide');
		this.options.onhide && this.options.onhide();
		this.panel.triggerHandler('hide');
		$.log('floatpanel hide ')
		$.log(this.panel[0]);
	},
	
	_op: function(name) {
		var elm = this.panel[0],
			op = this.options[name];
		return op ? op.call(elm, elm) : this.panel[name]();
	}
	
};
//~ FloatPanel

WP.widget.FloatPanel = FloatPanel;
$.add('wp-floatpanel');


})(jQuery, Platform.winport);

