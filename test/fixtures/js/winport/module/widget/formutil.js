/**
 * @fileoverview �ṩ��ͨ�ò���
 * @author qijun.weiqj
 */
(function($, WP) {
	

var FormUtil = {
	/**
	 * ��ΪĬ�ϵ�serializeArray��checkboxδѡ��,����û������
	 * ���ԶԴ˽��м򵥴���, ʹ����Ӧ����ajax�ύ
	 */
	getFormData: function(form) {
		form = $(form);
		var data = {},
			array = form.serializeArray();
		$.each(array, function() {
			data[this.name] = this.value;
		});
		
		$(':checkbox', form).each(function() {
			var name = this.name;
			name && (data[name] = !!data[name]);
		});
		
		return data;
	},
	
	/**
	 * ����data��Ⱦform
	 * @param {selector|element} form
	 * @param {object} data
	 */
	setFormData: function(form, data) {
		form = $(form);
		$.each(data, function(key) {
			var elm = form[key];
			if (!elm) {
				return;
			}
			if (elm.is(':checkbox,:radio')) {
				elm.attr('checked', !!this);
			} else {
				elm.val(this);
			}
		});
	},
	
	/**
	 * ��ʾ������ʾ��Ϣ
	 */
	showMessage: function(elm, message, type, finder) {
		elm = $(elm);

		var advice = elm.data('message-advice'),
			lastType = null;
		if (!advice) {
			finder = finder || function(elm, type) {
				var ret = elm.closest('dd');
				if (!ret.length) {
					ret = elm.closest('div');
				}
				return ret.find('.message');
			};
			advice = finder(elm, type);
			elm.data('message-advice', advice);
		}
		
		lastType = advice.data('message-type');
		lastType && advice.removeClass(lastType);
		
		if (message) {
			type &&	advice.addClass(type).data('message-type', type);
			advice.html(message).show();
		} else {
			advice.hide();
		}
	}
	
};
//~ FormUtil

WP.widget.FormUtil = FormUtil;
$.add('wp-formutil');


})(jQuery, Platform.winport);
