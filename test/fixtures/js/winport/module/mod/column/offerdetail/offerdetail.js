/**
 * @fileoverview Offerdetailҳ��
 * 
 * @author long.fanl
 */
(function($,WP){
	
	var LayoutFolder = WP.LayoutFolder;
	
	var Offerdetail = {
		init : function(){
			this.initFolder(); // ��ʼ��ҳ�� ����/չ������
		},
		
		initFolder : function(){
			var detailFolder = new LayoutFolder();
		}
	}
	
	WP.ModContext.register('wp-offerdetail', Offerdetail);
	
})(jQuery,Platform.winport);
