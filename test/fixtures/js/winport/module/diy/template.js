/**
 * ����DIYģ�����
 * @author qijun.weiqj
 */
(function($, WP) {


var Dialog = WP.widget.Dialog,
	Diy = WP.diy.Diy,
	Msg = WP.diy.Msg,
	Component = WP.diy.Component;

	
var DiyTemplate = {

	/**
	 * Ӧ��ģ��
	 *
	 * �˷���������� ��Ӧ��ģ�塱 �� ��ȡ��diyҳ�����ݡ� �����ӿ�
	 * ��Ӧ��ģ�塱url��ַ��Ϣ������#doc[data-doc-config]��, ����Ϊ: applyTemplateUrl
	 * "ȡ��diyҳ������" url��ַ��Ϣ������#doc[data-doc-config]�ϣ�����Ϊ: getDiyPageContentUrl 
	 *
	 * �쳣���������ε��ô˽ӿ�, ����һ��û�з�������Ա��ε���
	 *
	 * @param {object} template  ģ����Ϣ
	 * 	- templateKey ģ���ʶ
	 * 	- skinUrl Ƥ����ʽ�ļ���ַ
	 * 	- customStyles {array<{subject, isEnable, styleContent}>}
	 *
	 * @param {object} options (��ѡ)
	 * 	- success {function()}Ӧ�óɹ���ص�����
	 * 	- error {function()} Ӧ��ʧ�ܺ�ص�����
	 */
	apply: function(template, options) {
		if (this._running) {
			return;	
		}

		var self = this;

		options = this._prepareOptions(options);

		this._showLoading('����Ӧ��ģ�壬���Ժ�...'); 

		this._applySkin(template.skinUrl);
		this._applyCustomStyles(template.customStyles || []);

		this._postApply(template.templateKey, {
			success: function(ret) {
				self._postApplySuccess(ret, options);
			},
			
			error: function(message) {
				self._hideLoading();

				self._restoreCustomStyles();
				self._restoreSkin();

				Msg.error(message);
				options.error();
			}
		});
	},

	/**
	 * Ӧ��Ƥ��css�ļ�������
	 */
	_applySkin: function(skinUrl) {
		if (!skinUrl) {
			return;
		}

		var link = $('#skin-link'),
			last = link.attr('href');
			
		if (last === skinUrl) {
			return;
		}
		
		link.attr('href', skinUrl);
		this._lastSkinUrl = last;
	},

	/**
	 * �ָ���ǰƤ��css
	 */
	_restoreSkin: function() {
		var link = $('#skin-link'),
			last = this._lastSkinUrl;

		if (last) {
			link.attr('href', last);
			this._lastSkinUrl = null;	
		}
	},

	/**
	 * Ӧ���û��Զ�����ʽ������
	 */
	_applyCustomStyles: function(styles) {
		var link = $('#custom-style'),
			css = [];

		$.each(styles, function() {
			var style = this;
			(style.isEnable || style.enabled) && css.push(style.styleContent);
		});	

		this._lastCustomStyles = link.html();
		link.html(css.join('\n'));	
	},

	/**
	 * �ָ���һ���û��Զ�����ʽ
	 */
	_restoreCustomStyles: function() {
		var link = $('#custom-style'),
			last = this._lastCustomStyles;
		
		if (last) {
			link.html(last);
			this._lastCustomStyles = null;	
		}
	},

	/**
	 * �����̨��Ӧ��ģ�塱
	 */
	_postApply: function(templateKey, options) {
		var self = this,
			docCfg = Component.getDocConfig(),
			url = docCfg.applyTemplateUrl,
			data = {
				templateKey: templateKey
			};

		url = 'mock.json';

		if (!url) {
			throw new Error('please specify applyTemplateUrl');
		}

		Diy.authAjax(url, {
			type: 'POST',
			dataType: 'json',
			data: data,

			success: function(ret) {
				if (ret.success) {
					options.success(ret);	
				} else {
					options.error('Ӧ��ģ��ʧ�ܣ���ˢ�º�����');
				}
			},

			error: function() {
				options.error('���緱æ����ˢ�º�����');
			}
		});
	},

	_postApplySuccess: function(ret, options) {
		var self = this,
			success = function() {
				self._hideLoading();
				
				Msg.info('Ӧ��ģ��ɹ�');
				options.success();
			};
		
		ret.needReload ? this._reloadPageContent(success) : success();
	},

	/**
	 * ���������������������Է�ӳ���ģ���Ӧ��
	 */
	_reloadPageContent: function(success) {
		var docCfg = Component.getDocConfig(),
			url = docCfg.getDiyPageContentUrl,
			error = function() {
				window.location.reload();
			};

		url = 'mock.htm';

		if (!url) {
			throw new Error('please specify getDiyPageContentUrl');	
		}

		$.ajax(url, {
			type: 'GET',
			success: $.proxy(this, '_reloadPageContentSuccess', success, error),
			error: error 
		});
	},

	_reloadPageContentSuccess: function(success, error, html) {
		if (!html || /<html[^>]*>/i.test(html)) {
			error();
			return;
		}

		$('#content').html(html);
		WP.ModContext.refresh();

		$(window).trigger('pagecontentreload');
		$.log('pagecontentreload');
		success();
	},

	/**
	 * ���ݵ�ǰ����
	 *
	 * "����"�ӿ�url��ַ������#doc[data-doc=config]�ϣ�����Ϊ: backupTemplateUrl
	 *
	 * �쳣����: �����ε��ô˽ӿڣ�����һ��û�з��أ�����Ա��ε���
	 *
	 * @param {object} options  (��ѡ)
	 *  - success {function()}   ���ݳɹ���ص�����
	 *  - error {function()}  ����ʧ�ܺ�ص�����
	 */
	backup: function(options) {
		if (this._running) {
			return;	
		}

		var self = this,
			docCfg = Component.getDocConfig(),
			url = docCfg.backupTemplateUrl,
			data = {};

		if (!url) {
			throw new Error('please specify backupTemplateUrl');
		}

		options = this._prepareOptions(options);

		this._showLoading('���ڱ��ݣ����Ժ�...');

		Diy.authAjax(url, {
			type: 'POST',
			dataType: 'json',
			data: data,

			success: function(ret) {
				self._hideLoading();

				if (ret.success) {
					Msg.info('����ģ��ɹ�');
					options.success();		
				} else {
					Msg.error('����ģ��ʧ�ܣ���ˢ�º�����');
					options.error();
				}
			},

			error: function() {
				self._hideLoading();
				Msg.warn('���緱æ����ˢ�º�����');
				options.error();
			}
			
		});
	},

	_prepareOptions: function(options) {
		options = options || {};
		options.success = options.success || $.noop;
		options.error = options.error || $.noop;
		return options;
	},

	/**
	 * ��ʾloading�Ի���(ֻ����������>100msʱ����ʾ�Ի���)
	 */
	_showLoading: function(message) {
		this._running = true;
		this._loadingDialog = new Dialog({
			className: 'template-loading-dialog',
			content: '<div class="d-loading">' + message + '</div>'
		});

	},

	/**
	 * ����loading�Ի���
	 */
	_hideLoading: function() {
		this._running = false;
		this._loadingDialog.close();	
	}

};


WP.diy.Template = DiyTemplate;

	
})(jQuery, Platform.winport);

