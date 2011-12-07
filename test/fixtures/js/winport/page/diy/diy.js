/**
 * @fileoverview ����DIYҳ���
 */
(function($, WP) {

var Msg = WP.diy.Msg;

var Diy = {
	init: function() {
		this.logDiyChanged();
		this.ajaxSetup();
	},
	
	logDiyChanged: function() {
		$(window).bind('diychanged', function(e, data) {
			$.log('diychanged: ' + data.type);
		});
	},
	
	ajaxSetup: function() {
		var fn = function() {
			$.ajaxSetup({
				error: function(){
					Msg.error('���緱æ����ˢ�º�����');
				}
			});
		};
		setTimeout(fn, 2000);
	}
	
};


WP.PageContext.register('~Diy', Diy);

})(jQuery, Platform.winport);
//~
