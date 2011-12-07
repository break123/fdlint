/**
 * @fileoverview �Ƽ������
 * 
 * @author long.fanl
 */
(function($, WP) {

var UI = WP.UI,
	PagingSwitcher = WP.widget.PagingSwitcher;

/**
 * �������Ƽ����
 */
WP.ModContext.register('wp-recommend-albums-main', function(div) {
	var uls = $('div.group', div),
		navs = $('div.paging a', div);
	new PagingSwitcher(navs, uls);
});


/**
 * ������Ƽ����
 */
WP.ModContext.register('wp-recommend-albums-sub', function(div) {
	var imgs = $('div.image img', div),
		uls = $('ul', div),
		navs = $('div.paging a', div);

	UI.resizeImage(imgs, 64);
	new PagingSwitcher(navs, uls);
});


})(jQuery, Platform.winport);
//~
