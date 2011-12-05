/**
 * @fileoverview ���̽�����, �����ð����������
 * @author qijun.weiqj
 */
(function($, WP) {


var Dialog = WP.widget.Dialog,
	Diy = WP.diy.Diy;


var NotSupportedPanel = {

	init: function() {
		var tpl = $('textarea.template-mod-not-supported-panel').val();
		if (!tpl) {
			return;
		}
		
		this.showDialog(tpl);
		this.initUpgradeGuidePanel();
		this.initUpgradeConfirmPanel();
	},

	/**
	 * ��ʾ��鲻��ʹ�öԻ���
	 */
	showDialog: function(tpl) {
		var config = {
			header: '��Ҫ����',
			className: 'mod-not-supported-dialog',
			hasClose: false,
			draggable: true,
			content: tpl
		};
		this.dialog = Dialog.open(config);
		this.panel = $('div.mod-not-supported-panel', this.dialog.node);

		this.guidePart = $('div.upgrade-guide-part', this.panel);
		this.confirmPart = $('div.upgrade-confirm-part', this.panel);
	},
	
	/**
	 * ��ʼ���������
	 */
	initUpgradeGuidePanel: function() {
		this.initModList();
		this.handleUpgradeConfirm();
		this.handleUpgradeCancel();
	},

	/**
	 * ������ͼ�갴Ť, ȡ������Ĭ����Ϊ
	 */
	initModList: function() {
		var modlist = $('ul.mod-list', this.guidePart);
		modlist.delegate('li a', 'click', function(e) {
			e.preventDefault();
		});
	},

	/**
	 * ����ȷ�϶�����Ť�¼�,��Ҫ�л���"�������ȷ��"���
	 */
	handleUpgradeConfirm: function() {
		var self = this,
			confirm = $('a.confirm', this.guidePart);

		confirm.click(function() {
			// ������Ҫͬʱ����������ҳ, ���Բ���ҪpreventDefault
			self.guidePart.hide();
			self.confirmPart.show();
		});
	},

	/**
	 * ����"����ʹ��"��Ť�¼�
	 */
	handleUpgradeCancel: function() {
		var self = this,
			cancel = $('a.cancel', this.guidePart),
			loading = $('div.loading', this.panel),
			url = this.panel.data('node-config').cleanUnGrantedUrl,
			docCfg = $('#doc').data('doc-config');

		cancel.click(function(e) {
			e.preventDefault();
			self.guidePart.hide();
			loading.show();
			Diy.authAjax(url, {
				type: 'POST',
				data: {
					_csrf_token: docCfg._csrf_token
				},
				success: function(o) {
					window.location.reload();
				}
			});
		});
	},


	/**
	 * ��ʼ������������
	 */
	initUpgradeConfirmPanel: function() {
		var self = this,
			links = $('a.confirm,a.cancel', this.confirmPart);
		links.click(function(e) {
			e.preventDefault();
			
			self.dialog.close();
			window.location.reload();
		});
	}
};


WP.PageContext.register('~NotSupportedPanel', NotSupportedPanel);


})(jQuery, Platform.winport);
//~
