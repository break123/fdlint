/**
 * @fileoverview �������
 * 
 * @author qijun.weiqj
 */
(function($, WP) {

var InstantValidator = WP.widget.InstantValidator;

/**
 * �������
 */
var SearchInSite = {
	
	init: function(div) {
		this.div = div;
		this.initPriceInput();
	},
	
	/**
	 * ���Ƽ۸������
	 */
	initPriceInput: function() {
		var inputs = $('input.price-low,input.price-high', this.div);
		InstantValidator.validate(inputs, 'price');
	}
};


WP.ModContext.register('wp-search-in-site', SearchInSite);


})(jQuery, Platform.winport);
//~


