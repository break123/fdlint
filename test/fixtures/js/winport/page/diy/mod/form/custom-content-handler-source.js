/**
 * @fileoverview �����Զ�������
 * @author qijun.weiqj
 */
(function($, WP) {


var FormUtil = WP.widget.FormUtil,
	SimpleHandler = WP.diy.form.SimpleHandler;

	
var CustomContentHandler = $.extendIf({
	
	init: function() {
		SimpleHandler.init.apply(this, arguments);
		this.contentInput = $('div.html-editor-panel textarea', this.div);
		$.use('wp-htmleditor', $.proxy(this, 'initHtmlEditor'));
	},
	
	initHtmlEditor: function() {
		var self = this,
			url = this.config.requestUrl,
			detailInfoId = this.config.detailInfoId,
			cid = this.box.data('boxConfig').cid,

			config = $.extend({}, this.config),
			textarea = this.contentInput;

		config.focus = true;

		if (detailInfoId === '0') {
			this.createHtmlEditor(false, config);	
			return;
		}

		$.ajax(url, {
			dataType: 'jsonp',
			data: {
				detailInfoId: detailInfoId,
				cid: cid,
				_env_mode_: $('#doc').data('docConfig').isEdit ? 'EDIT' : 'VIEW'
			},
			success: function(o) {
				self.createHtmlEditor(o.success ? o.data : false, config);
			}
		});
	},

	createHtmlEditor: function(html, config) {
		this.contentInput.val(html || '');
		this.editor = new WP.widget.HtmlEditor(this.contentInput, config);
	},
	
	validate: function() {
		var valid = SimpleHandler.validate.apply(this, arguments);
		return valid && this.validateContent();
	},
	
	validateContent: function() {
		if (!this.editor) {
			this.showError(this.contentInput, '�༭��δ��ʼ���ɹ�, ��ˢ�º�����');
			return false;
		}
		this.editor.update();
		var value = $.trim(this.contentInput.val());
		
		this.showError(this.contentInput, false);

		if (!this.validateEmpty(value)) {
			this.showError(this.contentInput, '����������');
			return false;
		}

		value = this.filterValue(value);
		
		if (value.length > 30000) {
			this.showError(this.contentInput, '��������30000���ַ�������������');
			return false;
		}
		
		return true;
	},
	
	/**
	 * ��֤�Զ��������Ƿ�Ϊ��
	 * �������ͼƬ����,��Ϊ��
	 * ������֤��ȥ��ǩ���Ƿ�������
	 */
	validateEmpty: function(text) {
		var re = /<img\s+/i;
		return re.test(text) || 
				text.replace(/<[^>]+>/g, '').length > 0;
	},

	/**
	 * ���˱༭���еķǷ��ַ���
	 */
	filterValue: function(value) {
		return (value || '').replace(/<[^\/][^>]+>/g, function(tag) {
			//  ����id��class����
			return tag.replace(/id=['"][^'"]*['"]/g, '').replace(/class=['"][^'"]*['"]/g, '');		
		});
	},
	
	beforeClose: function() {
		this.editor && this.editor.close();
	},

	showError: function(elm, message) {
		return FormUtil.showMessage(elm, message, 'error');
	}
	
}, SimpleHandler);


WP.diy.form.CustomContentHandler = CustomContentHandler;

	
})(jQuery, Platform.winport);
