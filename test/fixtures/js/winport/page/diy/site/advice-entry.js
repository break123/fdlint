/**
 * ����diy��̨��Ҫ�Ὠ�鲼��
 * @author qijun.weiqj
 */
(function($, WP) {

var AdviceEntry = {

	init: function() {
		var link = $('a.advice-entry', '#header');
		WP.UI.positionFixed(link);
	}

};


WP.PageContext.register('~AdviceEntry', AdviceEntry);

})(jQuery, Platform.winport);
