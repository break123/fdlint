/**
 * ��Ŀѡ���/��Ʒ��Ŀѡ�������Դ
 * @author qijun.weiqj
 */
(function($, WP) {

var Util = WP.Util;

/**
 * ��Ŀѡ�������Դ
 */
var VasCategoryChooserDataProvider = new WP.Class({

	init: function(config) {
		this.config = config;
	},

	loadCategories: function(callback, error) {
		var config = this.config;
		if (config.useMock) {
			return callback(this.getMockCategories());
		}

		if (!config.loadCategoriesUrl) {
			$.error('please specify loadCategoriesUrl');
		}
		
		$.ajax(config.loadCategoriesUrl, {
			dataType: 'jsonp',
			cache: false,
			success: function(ret) {
				ret.success ? callback(ret.data.categorys) : 
					error ? error() : false; 	
			},
			error: error
		});
	},

	getMockCategories: function() {
		var cats = [];
		for (var i = 0; i < 21; i++) {
			cats.push({ id: i + 1, name: '��Ŀ' + i, offerCount: i });
		}
		return cats;
	}
}); 

WP.unit.VasCategoryChooserDataProvider = VasCategoryChooserDataProvider;
$.add('wp-vas-category-chooser-data-provider');


/**
 * ��Ŀ��Ʒѡ������Դ
 */
var VasCategoryOfferChooserDataProvider = new WP.Class({

	init: function(config) {
		this.cdp = new VasCategoryChooserDataProvider(config);
		this.odp = new WP.unit.VasOfferChooserDataProvider(config);
	}
});

WP.unit.VasCategoryOfferChooserDataProvider = VasCategoryOfferChooserDataProvider;
$.add('wp-vas-category-offer-chooser-data-provider')



})(jQuery, Platform.winport);
