/**
 * ��Ŀѡ�����
 * @author qijun.weiqj
 */
(function($, WP) {

/**
 * ��Ŀѡ�����, ������Ⱦ��ָ���ڵ�
 */
var CategoryChooser = new WP.Class({
	
	/**
	 * config ���ò���
	 *  - appendTo {element} ��Ŀѡ��������Ⱦ��ָ���ڵ���
	 *  - dataProvider {loadCategories: function(cats)} �����ṩ��, dataProvider��Ҫʵ��loadCategories����
	 *  - selectedCategoryId {integer} current selected category id
	 *  - select {function(cat)} ѡ����Ŀ�ط���
	 */
	init: function(config) {
		this.config = config;
		this.node = $(this._template);
		this.node.appendTo(config.appendTo);
	
		this._initCatsList();
		this._handleCatsEvent();
	},
	
	/**
	 * ������Ŀ��������Ⱦ
	 */
	_initCatsList: function() {
		var self = this,
			dp = this.config.dataProvider,
			selectedId = this.config.selectedCategory,
			content = $('div.w-content', this.node);

		dp.loadCategories(function(cats) {
			var html = [];
			$.each(cats, function(index, cat) {
				html.push($.util.substitute(self._itemTemplate, self._filterCat(cat)));
			});
			content.html('<ul>' + html.join('') + '</ul>');

			$('li', content).each(function(index) {
				var cat = cats[index],
					li = $(this);

				li.data('cat', cat);
				if (selectedId === cat.id) {
					li.addClass('selected');
					self._doSelect(cat, true);
				}
			});

		}, function() {
			content.html('<div class="message">���緱æ�����Ժ����ԣ�</div>');	
		})
	},

	/**
	 * ����cat����,Ϊ��ʾǰ��׼��
	 */
	_filterCat: function(cat) {
		var o = $.extend({}, cat);
		o.formatedName = cat.name.length > 6 ? cat.name.substr(0, 6) + '..' : cat.name;
		return o;
	},

	/**
	 * ������Ŀѡ���¼�
	 */
	_handleCatsEvent: function() {
		var self = this,
			select = this.config.select;
		this.node.delegate('a.name', 'click', function(e) {
			e.preventDefault();

			var li = $(this).closest('li'),
				cat = li.data('cat');

			li.siblings().removeClass('selected');
			li.addClass('selected');
			
			self._showError(false);
			self._doSelect(cat);	
		});
	},

	_doSelect: function(cat, sys) {
		var select = this.config.select,
			last = this._selectedCat;

		this._selectedCat = cat;
		select && select(cat, last, sys);
	},

	_showError: function(hide) {
		var elm = $('div.w-header div.message', this.node);
		if (hide === false) {
			elm.removeClass('error');
		} else {
			elm.addClass('error');
			setTimeout(function() {
				elm.removeClass('error');
			}, 3000);
		}
	},
	
	validate: function() {
		if (!this._selectedCat) {
			this._showError();
			return false;
		}
		return true;
	},

	/**
	 * ȡ�õ�ǰѡ�е���Ŀ
	 */
	getSelectedCategory: function() {
		return this._selectedCat; 
	},
	
	_template:
'<div class="widget-category-chooser">\
	<div class="w-header">\
		<h3>�ҵ���Ϣ</h3>\
		<div class="message">����ѡ��һ����Ŀ</div>\
	</div>\
	<div class="w-content"><div class="loading">��������...</div></div>\
</div>',
	
	_itemTemplate: '<li><a href="#" title="{name}" class="name">{formatedName}</a> <span class="count">{offerCount}</span></li>'

});
//~ CategoryChooser


/**
 * ��Ŀѡ��+��Ʒѡ�����
 */
var CategoryOfferChooserDialog = new WP.Class(WP.widget.Dialog, {
	
	init: function(config) {
		var	self = this,
			params = $.extend({
				header: 'ѡ���Ʒ',
				className: 'category-offer-chooser-dialog',
				draggable: true
			}, config, {
				contentSuccess: function() {
					$.use('wp-offer-chooser', $.proxy(self, '_contentSuccess'));
				},
				buttons: [
					{ 'class': 'd-confirm', 'value': 'ȷ��' },
					{ 'class': 'd-cancel', 'value': 'ȡ��' }
				],
				confirm: $.proxy(this, '_confirm')
			});
		
		this.parent.init.call(this, params);	

		this._confirmHandler = config.confirm;
		this._cancelHandler = config.cancel;
	},

	/**
	 * �Ի���򿪺�ص�����
	 */
	_contentSuccess: function() {
		this.setContent('');	// ���ԭ�Ի�������
		this._showCategoryChooser();
	},

	/**
	 * ��ʾ��Ŀѡ�����
	 */
	_showCategoryChooser: function() {
		var self = this,
			config = null,
			noSelectedOffers = (this.config.selectedOffers || []).length === 0;

		if (!this._categoryChooser) {
			config = $.extendIf({
				appendTo: this.getContainer(),
				dataProvider: this.config.dataProvider.cdp,
				select: function(cat, last, sys) {
					// �����ϵͳ����select,���ҵ�ǰû��offerѡ��, ��֪����ת��offerѡ��ҳ
					if (sys && noSelectedOffers) {
						return;
					}
					self._showOfferChooser(cat);
				}
			}, this.config);

			this._categoryChooser = new CategoryChooser(config);
		}

		this.node.removeClass('offer-chooser-active').addClass('category-chooser-active');
	},

	/**
	 * ��ʾofferѡ�����
	 * @param {object} cat ��ǰѡ�е���Ŀ
	 */
	_showOfferChooser: function(cat) {
		var config = null;

		// �������Ѵ���
		if (this._offerChooser) {
			// ѡ�����µ���Ŀ, ��ɾ��ԭOfferChooser, ���Ҵ�����offerChooser(selectedOfferΪ��)
			if (this._selectedCat && this._selectedCat.id !== cat.id) {
				this._offerChooser.node.remove();
				
				config = this._getOfferChooserConfig(cat);
				config.selectedOffers = [];	
				this._offerChooser = new WP.widget.OfferChooser(config);
			}
		} else {
			config = this._getOfferChooserConfig(cat);
			this._offerChooser = new WP.widget.OfferChooser(config);	
		}
		
		this._selectedCat = cat;
		this.node.removeClass('category-chooser-active').addClass('offer-chooser-active');
	},
	
	_getOfferChooserConfig: function(cat) {
		var self = this;
		return $.extendIf({
			appendTo: this.getContainer(),
			dataProvider: this.config.dataProvider.odp,
			selectedCategory: cat,
			comeback: {
				text: '������Ŀѡ��',
				action: function() {
					self._showCategoryChooser();
				}
			}
		}, this.config);
	},
	
	getData: function() {
		if (!this._offerChooser) {
			return;
		}

		var category = this._selectedCat,
			offers = this._offerChooser.getSelectedOffers();

		return {
			category: category,
			offers: offers
		};
	},

	_confirm: function() {
		// ��ǰ���Ϊ��Ʒѡ��ҳ
		if (this.node.hasClass('offer-chooser-active')) {
			this._confirmHandler ? this._confirmHandler(this) : this.close();	
			return;
		}
	
		if (this._selectedCat || this._categoryChooser.validate()) {
			this._showOfferChooser(this._selectedCat || this._categoryChooser.getSelectedCategory());
		}
	}

});
//~ CategoryOfferChooser 



WP.widget.CategoryChooser = CategoryChooser;
WP.widget.CategoryOfferChooserDialog = CategoryOfferChooserDialog;

$.add('wp-category-chooser');
$.add('wp-category-offer-chooser');

})(jQuery, Platform.winport);

