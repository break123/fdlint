/**
 * @fileoverview ����ģʽ
 * 
 * @author long.fanl
 */
(function($, WP){
	
var ViewMode = {
	
	init: function() {
		this.switcher = $('#view-mode-switch');
		
		WP.UI.positionFixed(this.switcher);
		this.handleToggle();
	},
	

	/**
	 * @Notice ����#content������ݻᱻ��������, ���Բ��ܱ��������κνڵ������
	 */
	handleToggle: function() {
		var id = '#winport-content',
			sw = this.switcher;

		sw.toggle(function() {
			$(id).addClass('mini-mode');
        	sw.text('������ͼ');
			window.scroll(0, 0);
		}, function() {
			$(id).removeClass('mini-mode');
			sw.text('������ͼ');
		});
	}
};

WP.PageContext.register('~ViewMode', ViewMode);

})(jQuery, Platform.winport);
