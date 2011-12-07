/**
 * @fileoverview ��Ʒoffer�Ƽ�
 * 
 * @author qijun.weiqj
 */
(function($, WP) {

var Offers = WP.mod.unit.Offers,
	PagingSwitcher = WP.widget.PagingSwitcher;


/**
 * ������Ʒ�Ƽ�
 */
WP.ModContext.register('wp-recommend-offers-main', function(div) {
	var uls = $('div.group', div),
		navs = $('div.paging a', div);
	new PagingSwitcher(navs, uls);
});


/**
 * �������Ʒ�Ƽ�
 */
WP.ModContext.register('wp-recommend-offers-sub', function(div) {
	var imgs = $('div.image img', div),
		uls = $('ul', div),
		navs = $('div.paging a', div);

	Offers.resizeImage(imgs, 64);
	new PagingSwitcher(navs, uls);
});


})(jQuery, Platform.winport);
//~
