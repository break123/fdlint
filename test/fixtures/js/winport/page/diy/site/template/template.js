/**
 * ģ��ҳ����
 * @author qijun.weiqj
 */ 
(function($, WP) {


var AjaxLink = WP.widget.AjaxLink;
	

var TemplatePage = {
	
	/**
	 * @param {object} pageData ��SettingContext.loadPage����ʱ�����ݵĶ������
	 */
	init: function(div, config, pageData) {
		this.div = div;

		this.pageData = pageData;

		this.tabs = $('ul.setting-node-tabs li', this.div),
		this.body = $('div.setting-node-body', this.div);

		this.initTabs();
		this.initContext();
	},

	/**
	 * ��ʼ��tab, ��ajax��ʽ����ҳ�浽body��
	 */
	initTabs: function() {
		var self = this;

		new AjaxLink(this.tabs, {
			cache: false,
			update: this.body,
			before: function() {
				self.beforeTabSelect($(this));	
			},
			confirm: function() {
				return !$(this).data('tabSelect');
			},
			success: function() {
				self.onTabSelect($(this))
			}	
		});

		
		this.tabs.eq(0).click();
	},

	beforeTabSelect: function(tab) {
		var self = this;
		clearTimeout(this.tabTimer);
		this.tabTimer = setTimeout(function() {
			self.body.html('<div class="template-page-loading"> ���ڼ���...</div>');
		}, 100);
	},

	onTabSelect: function(tab) {
		clearTimeout(this.tabTimer);

		this.tabs.removeClass('selected').removeData('tabSelect');
		tab.addClass('selected').data('tabSelect', true);

		var node = $('>div', this.body);
		if (node.length) {
			WP.TemplatePageContext.refresh(node, this.pageData);
			this.pageData = null;	
		}
	},

	initContext: function() {
		WP.TemplatePageContext.loadPage = $.proxy(this, 'loadTemplatePage');
	},

	loadTemplatePage: function(index, data, params) {
		this.pageData = data;
		AjaxLink.load(this.tabs.eq(index), params)
	}
		
};


WP.SettingContext.register('diy-template-page', TemplatePage );

/**
 * ��ʼ��TemplatePageContext,�Ա�������TemplatePage������
 */
WP.TemplatePageContext = new WP.NodeContext('TemplatePageContext', { 
	root: '#header', // ��ȷ�Ļ�Ӧ��ʹ�� '#header div.diy-template-page'�� ����Ϊ�˼ӿ�ѡ�����ٶ�
	configField: 'templateConfig'
});


	
})(jQuery, Platform.winport);
