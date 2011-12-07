/**
 * ģ���г�
 * @author
 */
(function($, WP) {
var Util = WP.Util,
	Diy = WP.diy.Diy;
	
var TemplatePageMarket = {
	
	/**
	 * ��ʼ��
	 */
	init: function(rootDiv, config, pageData){
		
		this.div = $(rootDiv);
		
		//�л�tabҳ
		this.initTemplateTabs();
		
		//����ɫ��ѡ���¼�
		this.initBindGroupClickEvents();
		
		//��Ӧ�õ����̰�ť�ĵ���¼�
		this.initBindButtonClickEvents();

	},
	
	/**
	 * ģ����������tabҳ�л�
	 * @param {Object} templateTab
	 */
	initTemplateTabs: function() {
		var tabs = $('ul.template-page-tabs>li', this.div),
			bodies = $('div.template-page-body', this.div);
		new Tabs(tabs, bodies);
	},
	
	/**
	 * ����ɫ��ѡ���¼�
	 * @param {Object} templateTab
	 */
	initBindGroupClickEvents: function() {
		this.div.delegate('ul.template-list-tabs li', 'click', function() {
			var group = $(this).data('group');	
			WP.TemplatePageContext.loadPage(1, { type: 'free', group: group });
		});
	},
	
	/**
	 * �󶨰�ť����¼�
	 * @param {Object} templateTab
	 */
	initBindButtonClickEvents: function() {
		var self = this;
		this.div.delegate('div.template-list-bodies li a.apply', 'click', function() {
			var li = $(this).closest('li'),
				template = li.data('template');
			self.applyTemplateDialog(template);
		});
	},
	
	/**
	 * ����Ӧ��ģ�嵽���̵ĶԻ���
	 */
	applyTemplateDialog: function(template){
		var self = this;
		var applyTemplateDialog = Dialog.open({
			header: '��ܰ��ʾ',
			className: 'apply-template-dialog',
			hasClose: true,
			buttons: [
					{
						'class': 'd-confirm',
						value: '��'
					},
					{
						'class': 'd-cancel',
						value: '����'
					}
				],
			draggable: true,
			content: "���Ƿ���Ҫϵͳ�Զ��������ݵ�ǰ����?",
			confirm: function(dialog){
				WP.diy.Template.backup({
					success: function(){
						WP.diy.Template.apply(template);			   
					}
				});
				},
			cancel: function(dialog) {
				WP.diy.Template.apply(template);
			}
		});
	}
	
};


WP.TemplatePageContext.register('template-page-market', TemplatePageMarket);

	
})(jQuery, Platform.winport);
