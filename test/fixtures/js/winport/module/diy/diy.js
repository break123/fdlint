/**
 * @fileoverview DIYҳ���߷���
 * 
 * @author long.fanl
 */
(function($, WP) {

var Msg = WP.diy.Msg;

var Diy = {
	
	/**
	 * authAjax����ʹ��xhr����POST����
	 * ͳһ��success��data�����жϣ�Ϊ������ʾ���緱æ
	 * ���IE��xhr��302��Ӧ�ߵ�success�߼�������
	 * @param {string} url
	 * @param {object} options
	 */
	authAjax: function(url, options){
		var self = this, 
			success = options.success,
			msg = '���緱æ����ˢ�º�����';
		
		options.error = options.error || function() {
			Msg.warn(msg);
		};	
		
		options.success = function(data){
			if(!data){
				options.error();
				return;
			}
			success && success.apply(this, arguments);
		};
		
		$.ajax(url, options);
	}
};

WP.diy.Diy = Diy;

})(jQuery, Platform.winport);
//~
