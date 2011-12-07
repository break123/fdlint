/**
 * @fileoverview ����DIY������
 * 
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	FloatTips = WP.widget.FloatTips;

	
var DiyGuide = {
		/**
	 * ��ʼ������
	 * 1. �Ƿ��Զ���ʾ������
	 * 2. ������������¼�
	 */
	init: function() {
		this.autoShow();
		this.handleGuide();
	},
	
	/**
	 * �Զ���ʾ������
	 */
	autoShow: function() {
		var docCfg = $('#doc').data('doc-config');
		if (docCfg.showTutorialWizard) {
			window.open('http://view.china.alibaba.com/cms/itbu/20111101/guide.html');
		}
	},
	
	/**
	 * ������������¼�
	 * 1. �������ҳ, ����ʾ������
	 * 2. ����ҳ, ����ת����ҳ��ʾ����
	 */
	handleGuide: function() {
		var self = this,
			elm = $('#header ul.help-topics a.guide');
		elm.click(function(e) {
			e.preventDefault();
			window.open('http://view.china.alibaba.com/cms/itbu/20111101/guide.html');
		});
		
	}
};


WP.PageContext.register('~DiyGuide', DiyGuide);

	
})(jQuery, Platform.winport);
//~
