/**
 * @fileoverview ��Ĭ�ϴ�����
 * 
 * @author long.fanl
 */
(function($, WP){

	
var FormUtil = WP.widget.FormUtil,
	Msg = WP.diy.Msg,
	BaseHandler = WP.diy.form.BaseHandler;


/**
 * SimpleHandler ����mixin������form handler��
 * ��Ҫ�ṩ:
 * 1. ������֤
 * 2. �������
 * 3. �ɹ���رնԻ���ˢ�°��
 *  
 */
var SimpleHandler = $.extendIf({
	
	init: function() {
		BaseHandler.init.apply(this, arguments);
		
		this.__$titleInput = $('input[name=title]', this.form);
		this.__$titleInput.closest('dd').find('span.err').addClass('message'); // ����ԭ�༭�����Ϣ��ǩ
		
		this.__$handleEvent();
	},
	
	__$handleEvent: function() {
		var self = this,
			title = this.__$titleInput;
			
		title.bind('input propertychange', function() {
			$.trim(title.val()) && self.__$showTitleError(false);
		});
		
		title.bind('blur',function(){
			self.__$validateTitle();
		});
	},
	
	__$validateTitle: function() {
		var value = $.trim(this.__$titleInput.val());
		if(!value) {
			this.__$showTitleError('���ⲻ��Ϊ��');
			return false;
		}
		
		if (/[~'"@#$?&<>\/\\]/.test(value)) {
			this.__$showTitleError('���⺬�зǷ��ַ�����������');
			return false;
		}
		
		return true;
	},
	
	validate: function() {
		return this.__$validateTitle();
	},
	
	__$showTitleError: function(message) {
		return FormUtil.showMessage(this.__$titleInput, message, 'error');
		return this.showError(this.__$titleInput, message);
	},

	_afterSubmit: function(result) {
		var dialog = this.dialog;

		if (result.success) {
			this._refreshBox();
			dialog.close();
			Msg.info("���ð��ɹ�");
		} else {
			result.data && $.each(result.data, function(i, d) {
				var elm = $(':input[name="' + d.fieldName + '"]', dialog.node);
				FormUtil.showMessage(elm, d.message, 'error');
			});
			Msg.error("���ð��ʧ��");
		}
	}

}, BaseHandler);


/**
 * Ĭ�ϱ�������
 */
var DefaultHandler = SimpleHandler;



WP.diy.form.SimpleHandler = SimpleHandler;
WP.diy.form.DefaultHandler = DefaultHandler;

    
})(jQuery, Platform.winport);
//~
