/**
 * @fileoverview ��ʱ��֤
 * 
 * @author qijun.weiqj
 */
(function($, WP) {

/**
 * ��ʱ��֤ʧ��ʱ�ָ��ϴ�����
 * @param {selector|element} selector
 * @param {string|regexp|function|object{test: function}} type ��֤��
 */
var InstantValidator = {

	validate: function(selector, type) {
		var self = this,
			v = this._getValidator(type);
		if (!v) {
			$.error('validator is not exist');
		}
		selector = $(selector);
		
		selector.bind('input propertychange', function() {
			var input = $(this),
				last = input.data('instant-validator-value') || '',
				value = input.val();
			
			if (!value || v.test(value)) {
				input.data('instant-validator-value', value);
			} else {
				// �ӳ������ѷ�ֹ�ٴδ���input/propertychange, ����ɶ�ջ���
				setTimeout(function() {
					input.val(last);
				}, 50);
			}
		});
		
		selector.triggerHandler('input');
	},
	
	_getValidator: function(type) {
		var t = $.type(type);
		return t === 'string' ? this.types[type] :
			t === 'regexp' ? type :
			t === 'function' ? { test: type } : null;
	}
	
};

InstantValidator.types = {
	// �۸�
	price: /^[\d]{0,9}(\.[\d]{0,2})?$/,
	// ��ҳ
	pagenum: /^[1-9]\d*$/
};

WP.widget.InstantValidator = InstantValidator;

$.add('wp-instantvalidator');

})(jQuery, Platform.winport);
