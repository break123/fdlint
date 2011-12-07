/**
 * @fileoverview ������Ŀҳ-���԰�
 *
 * @author qijun.weiqj
 */
(function($, WP){


var Util = WP.Util,
	Paging = WP.mod.unit.Paging,
	FormUtil = WP.widget.FormUtil;


var FeekbackDetail = {
    init: function(div, config){
		this.div = div;
		
		this.formPanel = $('div.feedback-form', div);
		this.form = $('form', this.formPanel);
		this.successPanel = $('dl.feedback-success', div);
		
		this.isLogin = $('#doc').data('doc-config').isLogin;
		
		this.initNotice();
		this.initPaging();
		this.form && this.initForm();
    },
	
	/**
	 * 1. ���õ�¼��Ť����targetUrl, ��Ϊ��¼����Ҫ���ص�ǰҳ��
	 * 2. ����ע�ᰴŤ����leadUrl, ��Ϊע�����Ҫ����
	 */
	initNotice: function() {
		var div = $('div.feedback-notice', this.div),
			login = $('a.login', div),
			register = $('a.register', div),
			loginUrl = null,
			registerUrl = null;
		
		if (login.length) {
			loginUrl = Util.formatUrl(login.attr('href'), {
				targetUrl: window.location.href
			})
			login.attr('href', loginUrl);
		}
		if (register.length) {
			registerUrl = Util.formatUrl(register.attr('href'), {
				leadUrl: loginUrl
			})
			register.attr('href', registerUrl);
		}
	},
	
	initPaging: function() {
		var paging = $('div.wp-paging-unit', this.div);
		new Paging(paging);
	},
	
	/**
	 * ��ʼ����
	 */
	initForm: function() {
		this.feedbackText = $('dl.feedback-content textarea:first', this.form);
		this.checkCodeText = $('dl.check-code input.input-text:first', this.form);
		this.submitBtn = $('div.form-footer a.submit:first', this.form);
		this.checkCodeImg = $('a.refresh-img img', this.form);
		this.checkCodeUrl = this.checkCodeImg.attr('src');
		
		this.initFloagLogin();
		this.handleValidate();
		this.handleSubmit();
		this.handleSuccessPanel();
		this.handleCheckCode();
	},
	
	/**
	 * ��ʼ�������¼
	 * �����focus����������ύ��Ťʱ����ָ����¼
	 */
	initFloagLogin: function() {
		var self = this,
			elms = [this.feedbackText[0], this.checkCodeText[0], this.submitBtn[0]];
		
		$(elms).click(function(e) {
			if (self.isLogin) {
				return;
			}
			FD.Member.LR.show({
				onLoginSuccess: function () {
					window.location.reload();
				},
				onRegistSuccess: function () {
					window.location.reload();
				}
			});
			return false;
		}); 
	},
	
	/**
	 * �������֤�¼�
	 */
	handleValidate: function() {
		var self = this,
			elms = [this.feedbackText, this.checkCodeText],
			vs = ['validateFeedback', 'validateCheckCode'];
			
		$.each(elms, function(index) {
			var elm = this,
				v = vs[index];
			elm.blur(function() {
				self[v]();
			});
			elm.focus(function() {
				self.showError(elm, false);
			});
		});
	},
	
	/**
	 * ��֤��������
	 */
	validateFeedback: function() {
		var elm = this.feedbackText,
			value = $.trim(elm.val());
		
		this.showError(elm, false);
		
		if (!value) {
			this.showError(elm, '������������������');
			elm.val('');
			return false;
		}
		
		if (value.length < 10 || value.length > 1500) {
			this.showError(elm, '���������������10-1500���ַ�');
			return false;
		}
		
		return true;
	},
	
	/**
	 * ��֤��֤��
	 */
	validateCheckCode: function() {
		var elm  = this.checkCodeText,
			value = $.trim(elm.val());
			
		this.showError(elm, false);
		
		if (!value) {
			this.showError(elm, '������У����');
			elm.val('');
			return false;
		}
		
		return true;
	},
	
	/**
	 * ������ύ�¼�
	 */
	handleSubmit: function() {
		var self = this,
		handler = function(e) {
			e.preventDefault();
			if (!self.isLogin|| self.running) {
				return;
			}
			self.validate() && self.submit();
		};
		
		this.form.submit(handler);
		this.submitBtn.click(handler);
	},
	
	/**
	 * ��ǰ����֤
	 */
	validate: function() {
		this.showError(this.submitBtn, false);
		return this.validateFeedback() &&
				this.validateCheckCode();
	},
	
	/**
	 * ��ʾ������Ϣ
	 */
	showError: function(elm, message) {
		FormUtil.showMessage(elm, message, 'error');
	},
	
	/**
	 * �ύ��
	 */
	submit: function() {
		var self = this,
			url = this.form.attr('action'),
			data = this.form.serialize();
		
		this.running = true;
		$('span', this.submitBtn).html('���ڷ���...');
		this.submitBtn.addClass('sending');
		
		$.ajax(Util.formatUrl(url, '_input_charset=UTF-8'), {
			type: 'POST',
			dateType: 'json',
			data: data,
			success: $.proxy(this, 'submitSuccess'),
			complete: $.proxy(this, 'submitComplete')
		});
	},
	
	/**
	 * �ύ���Գɹ�
	 */
	submitSuccess: function(ret) {
		if (ret.success) {
			this.form[0].reset();
			this.formPanel.hide();
			this.successPanel.show();
		} else {
			this.showErrorMessage(ret.data || []);
		}
	},
	
	/**
	 * �ύ�������(�ɹ���ʧ��)
	 */
	submitComplete: function() {
		this.running = false;
		$('span', this.submitBtn).html('��������');
		this.submitBtn.removeClass('sending');
		this.refreshCheckCode();
	},
	
	/**
	 * �ύ��ʧ�ܣ���ʾ������Ϣ
	 */
	showErrorMessage: function(data) {
		data = data[0] || {};
		
        var fields = {
			checkCodeFailure: this.checkCodeText,
			content: this.feedbackText
		},
		
		msgs = {
            checkCodeFailure: 'У���벻��ȷ������������'
        },
		
		message = data.message || msgs[data.errorCode] || '���Է���ʧ�ܣ���ˢ�º�����',
		field = fields[data.errorCode] || fields[data.fieldName] || this.submitBtn;
		
		this.showError(field, message);
	},
	
	/**
	 * ��ʼ�����Գɹ����
	 */
	handleSuccessPanel: function() {
		var self = this,
			link = $('a.continue', this.successPanel);
		link.click(function() {
			self.formPanel.show();
			self.successPanel.hide();
			return false;
		});
	},
	
	/**
	 * ��ʼ����֤��ˢ���߼�
	 */
	handleCheckCode: function() {
		var self = this,
			links = $('a.refresh-img,a.refresh-link', this.form);
		links.click(function() {
			self.refreshCheckCode();
			return false;
		});
	},
	
	/**
	 * ˢ����֤��
	 */
	refreshCheckCode: function() {
		var url = Util.formatUrl(this.checkCodeUrl, { _: $.now() });
		this.checkCodeImg.attr('src', url);
		this.checkCodeText.val('');
	}
};


WP.ModContext.register('wp-feedback-detail', FeekbackDetail);

    
})(jQuery, Platform.winport);
