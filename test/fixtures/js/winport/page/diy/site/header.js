/**
 * @fileoverview DIY�������
 * 
 * @author qijun.weiqj
 */

(function($, WP) {

var Util = WP.Util,
	UI = WP.UI,
	Tabs = WP.widget.Tabs,
	AjaxLink = WP.widget.AjaxLink,
	FloatPanel = WP.widget.FloatPanel,
	FloatTips = WP.widget.FloatTips;

var DiyHeader = {

	init: function(div) {
		this.docCfg = $('#doc').data('docConfig');
		
		this.bar = $('div.setting-bar', div);
		this.panel = $('div.setting-panel', div);
		this.tabs = $('ul.setting-tabs>li', this.bar);
		this.body = $('div.setting-panel-body', this.panel);

		UI.positionFixed(this.bar);
		this.initTabs();
		this.initContext();
		this.initHelpPanel();
		this.initCollapseBar();
		this.initHeaderState();
		this.initPublishTooltip();
	},
	
	/**
	 * ��ʼ������Tabs
	 */
	initTabs: function() {
		var self = this;
			
		new AjaxLink(this.tabs, {
			cache: false,
			update: this.body,
			before: function() {
				self.tabsLinkBefore($(this));
			},
			confirm: function() {
				var loaded = $(this).data('panelLoaded');
				loaded && self.expandPanel(true);
				return !loaded;
			},
			success: function() {
				self.tabsLinkSuccess($(this));
			}
		});
	},
	//~ initTabsLink
	
	/**
	 * ռ��tabʱ����������ǰ���ô˷���
	 */
	tabsLinkBefore: function(tab) {
		var self = this;

		this.expandPanel(true);

		// �Ż�������һ��ʼ����tab�л���ѡ��״̬
		// ������Ҫ�ȵ������Ż�ѡ��	
		this.tabs.removeClass('selected');
		tab.addClass('selected');
		
		clearTimeout(this.tabsTimer);
		this.tabsTimer = setTimeout(function() {
			self.body.html('<div class="setting-panel-loading">���ڼ���...</div>');
		}, 100);
	},
	
	/**
	 * �����������ʱ���ô˷���
	 */
	tabsLinkSuccess: function(tab) {		
		clearTimeout(this.tabsTimer);
		
		// �����첽����ʱ����ܺ�ԭ�Ȳ�һ��,���Ի���Ҫ����һ��selected��ʽ
		if (!tab.hasClass('selected')) {
			this.tabs.removeClass('selected');
			tab.addClass('selected');
		}
		this.tabs.removeData('panelLoaded');
		tab.data('panelLoaded', true);
		
		var node = $('div.setting-node', this.body);
		if (node.length) {
			this.initSettingNodeTabs(node);
			// ������������ SettingContext.loadPage������pageData
			// @see initContext & loadSettingPage
			WP.SettingContext.refresh(node, this.pageData);
			this.pageData = null;
		}
	},
	
	/**
	 * �����setting-node-tab, ���ʼ��
	 */
	initSettingNodeTabs: function(node) {
		var tabs = $('ul.setting-node-tabs>li', node),
			bodies = $('ul.setting-node-body>li', node);

		if (tabs.length && bodies.length) {
			new Tabs(tabs, bodies);
		}
	},


	/**
	 * ��ʼ��SettingContext
	 */
	initContext: function() {
		WP.SettingContext.loadPage = $.proxy(this, 'loadSettingPage');
	},

	/**
	 * ����SettingPage
	 * @param index tab����
	 * @param data �������, ���ݸ�int��������������
	 * 		@see template/template.js
	 */
	loadSettingPage: function(index, data) {
		var tab = this.tabs.eq(index);

		// ���ݱ��������Ա�����, �ڳ�ʼ��ʱ��ʹ�õ�
		// @see tabsLinkSuccess
		this.pageData = data;
		AjaxLink.load(tab);
	},
	
	/**
	 * ��ʼ���������
	 */
	initHelpPanel: function() {
		var panel = $('div.help-panel', this.bar),
			link = $('a.help-link', panel),
			floatPanel = null;
		floatPanel = new FloatPanel(panel, { 
			handler: link,
			toggle: true,
			show: function() {
				panel.addClass('selected');
			},
			hide: function() {
				panel.removeClass('selected');
			}
		});
		
		panel.delegate('ul.help-topics li', 'click', function() {
			floatPanel.hide();
		});
	},
	
	/**
	 * ��ʼ���������������
	 */
	initCollapseBar: function() {
		var self = this,
			cHandle = $('div.collapse-bar a.handle', this.panel),
			eBar = $('div.expand-bar', this.bar),
			eHandle = $('a.handle', eBar),
			win = $(window),
			header = $('#header'),
			height = null;
			
		cHandle.click(function() {
			self.expandPanel(false);
			return false;
		});
		
		eHandle.click(function() {
			self.expandPanel(true);
			return false;
		})
		
		win.bind('scroll resize', function() {
			var top = win.scrollTop(),
				collapsed = header.hasClass('collapsed'),
				expanded = header.hasClass('expanded');
				
			height = height || $(self.panel).height() - eBar.height();
			// ���û��������κ����
			if (!collapsed && !expanded) {
				return;
			}
			
			header[top > height ? 'addClass' : 'removeClass']('panel-scrollout');
		});
	},
	//~ initCollapseBar
	
	/**
	 * չ��/�������
	 * @param {boolean} expanded
	 */
	expandPanel: function(expanded) {
		var header = $('#header');
		header.toggleClass('expanded', expanded);
		header.toggleClass('collapsed', !expanded);
		window.scroll(0, 0);
	},
	
	/**
	 * ��һ��DIY,Ĭ��չ����һҳ
	 */
	initHeaderState: function() {
		this.docCfg.showTutorialWizard && this.tabs.eq(0).click();
	},
	
	/**
	 * ��ʼ������tips
	 */
	initPublishTooltip: function() {
		var self = this,
			flag = false,
			parent = $('#header div.setting-tools'),
			text = '��˷�����Ӧ�������޸ĵ�����';
		
		$(window).bind('diychanged', function() {
			if (flag) {
				return;
			}
			new FloatTips(parent, text, { className: 'publish-tips' });
			flag = true;
		});
	}
	
};
//~ DiyHeader

WP.PageContext.register('#header', DiyHeader);

/**
 * ��ʼ��SettingContext,�Ա�������DIY������
 */
WP.SettingContext = new WP.NodeContext('SettingContext', { 
	root: '#header'
});
	
})(jQuery, Platform.winport);
//~




