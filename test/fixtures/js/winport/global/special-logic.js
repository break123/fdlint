/**
 * DIYǰ��̨����Ҫ�������߼�
 * @author qijun.weiqj
 */
(function($, WP) {

var SpecialLogic = {
	
	init: function() {
		$.use('ui-flash', $.proxy(this, 'checkFlashVersion'));
	},

	checkFlashVersion: function() {
		if ($.util.flash.hasVersion(10) || !WP.Component.isHomePage()) {
			return;
		}
		$.use('wp-dialog', function() {
			WP.widget.Dialog.open({
				header: '����',
				content: '<div class="d-msg" style="padding-bottom: 20px;"><span class="info">��û�а�װFlash��汾���ͣ����ܻᵼ�²�<br />�ֹ���չʾ�쳣������������Flash��<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">��������</a></span></div>',
				buttons: [
					{ 'class': 'd-confirm', value: '��֪����' }	
				]
			});
		});
	}

};


WP.PageContext.register('~SpecialLogic', SpecialLogic);


})(jQuery, Platform.winport);
