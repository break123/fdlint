/**
 * @fileoverview ��Ӧ��Ʒ(�Զ�)
 * 
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Offers = WP.mod.unit.Offers;
	
/**
 * �������Ӧ��Ʒ
 */
WP.ModContext.register('wp-auto-rec-offers-sub', function(div) {
	var imgs = $('div.image img', div);
	Offers.resizeImage(imgs, 64);
});


})(jQuery, Platform.winport);
//~
