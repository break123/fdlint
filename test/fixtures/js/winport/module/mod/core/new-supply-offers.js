/**
 * @fileovewview ���¹�Ӧ
 * 
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Offers = WP.mod.unit.Offers;
	
/**
 * ��������¹�Ӧ
 */
WP.ModContext.register('wp-new-supply-offers-sub', function(div) {
	var imgs = $('div.image img', div);
	Offers.resizeImage(imgs, 64);
});


})(jQuery, Platform.winport);
//~
