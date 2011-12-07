/**
 * @fileoverview ������༭�߼�
 * @author qijun.weiqj
 */
(function($, WP) {
	
	
var EditFilter = {
	init: function() {
		this.filterTopNav();
	},
	
	/**
	 * �༭������ʱ, ��Ҫչ��ҳ��������
	 */
	filterTopNav: function() {
		var panel = $('#header li.page-list-manage:first');
		
		$(window).bind('boxbeforeedit', function(e, data) {
			var mod = $('div.wp-top-nav', data.element);
			if (mod.length) {
				panel.click();
				return false
			}
		});
	}
}
//~ EditFilter


WP.PageContext.register('~EditFilter', EditFilter);

})(jQuery, Platform.winport)
