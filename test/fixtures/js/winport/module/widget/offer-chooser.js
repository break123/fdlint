/**
 * ��Ʒѡ�����
 * @author qijun.weiqj
 */
(function($, WP) {


var Util = WP.Util,
	UI = WP.UI;


/**
 * �������߷���
 */
var Helper = {
	/**
	 * ��ʾloading
	 */
	showLoading: function(div) {
		div.html('<div class="loading">���ڼ���...</div>');
	},

	/**
	 * ��ʾ��Ϣ
	 */
	showMessage: function(div, message, callback) {
		var elm = $('<div class="message">' + message +'</div>');
		div.empty().append(elm);
		elm.delay(5000).fadeOut(function() {
			elm.remove();
			callback && callback();
		});
	},

	/**
	 * ��Offer���ݽṹ���б任,�Ա�������Ⱦ
	 */
	filterOffer: function(offer) {
		var clone = $.extend({}, offer);

		clone.formatedTitle = offer.title.length > 20 ? offer.title.substr(0, 20) + '..' : offer.title;
		clone.formatedTitle = $.util.escapeHTML(clone.formatedTitle, true);

		clone.title = $.util.escapeHTML(offer.title, true);
		clone.image = offer.image || 'http://img.china.alibaba.com/images/app/platform/winport/mod/offers/nopic-64.png';
		clone.price = $.util.escapeHTML('' + offer.price, true).replace(/(\d+(?:\.\d+)?)/, '<em>$1</em>');
		return clone;
	},

	/**
	 * ����Offer�б�Hover�¼�
	 */
	handleOfferListHover: function(offerList) {
		offerList.delegate('li', 'mouseenter', function() {
			$('li', offerList).removeClass('hover');
			$(this).addClass('hover');
		});
	}
};

/**
 * ��Ʒѡ����
 * @see OfferChooser
 */
var OfferChooser = new WP.Class({
	/**
	 * @param {object} config ���ò���
	 *  - dataProvider {object} ����Դ
	 *��- sourceOfferTitle {string} ������
	 *  - selectedOfferTitle {string} �Ҳ����
	 *  - maxSelectedCount {int} ���ѡ����Ŀ

	 *  - comback {object{ text: string, action: function }} ����
	 */
	init: function(config) {
		this.config = config; 

		this.node = $(this._template);
		this.node.appendTo(config.appendTo);
		
		// ���ȳ�ʼ��selectedOfferPart, ��ΪSourceOfferPart��ʹ�õ�getSelectedOffersId�ӿ�
		this.selectedOfferPart = new SelectedOfferPart(this);
		$.extend(this, Util.delegate(this.selectedOfferPart, 
				['getSelectedOffers', 'getSelectedOffersId']));

		this.sourceOfferPart = new SourceOfferPart(this);
	},


	/**
	 * ѡ���Ʒhtmlģ��
	 */
	_template:
'<div class="widget-offer-chooser">\
	<div class="source-offer-part">\
		<div class="w-header">\
			<h3></h3>\
		</div>\
		<div class="search-panel">\
			<div class="search-cats ui-combobox">\
				<input type="text" readonly="readonly" autocomplete="off" class="result">\
				<a hidefocus="true" href="javascript:;" class="trigger"></a>\
			</div>\
			<input type="text" class="search-text" maxlength="50" />\
			<a href="#" class="search-btn">����</a>\
		</div>\
		<div class="offer-list"></div>\
		<div class="paging-nav"></div>\
	</div>\
	<div class="selected-offer-part">\
		<div class="w-header"><h3></h3></div>\
		<div class="offer-list"></div>\
		<div class="expire-message">������Ϣ�޷���������չʾ�����ط��������Ϣ��</div>\
	</div>\
</div>'	

});
//~ OfferChooser


/**
 * ���Offer�б���
 */
var SourceOfferPart = new WP.Class({
	
	init: function(chooser) {
		this.Chooser = chooser;
		this.node = chooser.node;
		this.config = chooser.config;

		this.part = $('div.source-offer-part', this.node);

		this._offerList = $('div.offer-list', this.part);

		// ��ǰ��ѯ����
		this._params = {
			category: this.config.selectedCategory,
			pageIndex: 1,
			pageSize: 5
		};
		
		this._renderHeader();
		this._handleOfferList();
		this._handleOfferAddRemove();

		new SearchPanel(this);
		new PagingNav(this);

		this.loadOffers();
	},

	_renderHeader: function() {
		var header = $('div.w-header', this.part),
			comeback = this.config.comeback;

		this._renderTitle(header);
		comeback && this._renderComeback(header, comeback);
	},

	_renderTitle: function(header) {
		$('h3', header).html(this.config.sourceOfferTitle || '�ҵĹ�Ӧ��Ϣ');
	},

	/**
	 * ��Ⱦ��������
	 */
	_renderComeback: function(header, comeback) {
		comeback = typeof comeback === 'function' ? 
				{ text: '����', action: comeback  } : comeback;

		var link = $($.util.substitute('<a href="#" class="comeback">{text}</a>', comeback));

		link.click(function(e) {
			e.preventDefault();
			comeback.action();
		});

		header.append(link);
	},

	/**
	 * ����Offerѡ���¼�
	 */
	_handleOfferList: function() {
		var self = this;

		this._offerList.delegate('a.select-btn', 'click', function(e) {
			e.preventDefault();

			var li = $(this).closest('li'),
				offer = li.data('offer');
			
			self.node.triggerHandler('offer.select', offer);
		});	
		
		// ����OfferListHover�¼�
		Helper.handleOfferListHover(this._offerList);
	},

	/**
	 * ��Ʒ���/�Ƴ�����°�Ť״̬
	 */
	_handleOfferAddRemove: function() {
		var self = this;
		this.node.bind('offer.remove', function(e, offer) {
			var li = self._getOfferItem(offer);
			li.removeClass('status-added');

			$(self._offerList).removeClass('status-full');
		});

		this.node.bind('offer.add', function(e, offer) {
			var li = self._getOfferItem(offer);
			li.addClass('status-added');
		})

		this.node.bind('offer.full', function() {
			$(self._offerList).addClass('status-full');
		});
	},

	/**
	 * ����Offerȡ��OfferList�ж�Ӧ��
	 */
	_getOfferItem: function(offer) {
		return $('li', this._offerList).filter(function() {
			return $(this).data('offer').id === offer.id;
		});
	},

	/**
	 * ����Offer�б�
	 */
	loadOffers: function(params) {
		var self = this;
		
		params && $.extend(this._params, params);

		Helper.showLoading(this._offerList);
		this.config.dataProvider.searchOffers(this._params, function(data) {
			self._renderOfferList(data.offers);
			self.node.trigger('offer.load', data);
		}, function() {
			Helper.showMessage(self._offerList, '���緱æ�����Ժ�����');	
		});
	},

	/**
	 * ��ȾԴOffer�б�
	 */
	_renderOfferList: function(offers) {
		var self = this,
			selectedOffers = this.Chooser.getSelectedOffersId(),
			ul = $('<ul>');

		$.each(offers, function(i, offer) {
			var html = $.util.substitute(self._template, 
					Helper.filterOffer(offer)),
				li = $(html);
			li.data('offer', offer);
			
			// �����ѡ���offer������,��selectedOffers��Ϊ��, ����selectedOffers === undefined
			if (selectedOffers && $.inArray(offer.id, selectedOffers) !== -1) {
				li.addClass('status-added');
			}

			offer.price || $('dd.price', li).remove();

			ul.append(li);
		});

		this._offerList.empty().append(ul);
		UI.resizeImage($('li .image img', this._offerList), 50);
	},

	_template:
'<li>\
	<dl>\
		<dt class="image"><a href="{detailUrl}" class="wrap" title="{title}" target="_blank"><img src="{image}" alt="{title}" /></a></dt>\
		<dd class="title"><a href="{detailUrl}" title="{title}" target="_blank">{formatedTitle}</a></dd>\
		<dd class="price">{price}</dd>\
		<dd class="date">{date}</dd>\
	</dl>\
	<div class="op">\
		<a href="#" class="select-btn">ѡ��</a>\
		<span class="offer-added">��ѡ��</span>\
	</div>\
</li>'

});
//~ SourceOfferPart


/**
 * �������
 */
var SearchPanel = new WP.Class({
	
	init: function(part) {
		this.Part = part;
		this.node = part.node;
		this.part = part.part;
		this.config = part.config;

		this.searchPanel = $('div.search-panel', this.part);

		this._initSearchCats();
		this._handleSearchBtn();
	},

	/**
	 * ��ʼ����Ŀ������
	 */
	_initSearchCats: function() {
		var self = this,
			div = $('div.search-cats', this.searchPanel),
			selectedCat = this.config.selectedCategory;
	
		// �е�ǰѡ����Ŀʱ, ����Ⱦ���ı��򣬲���Ҫ������
		if (selectedCat) {
			self._renderSelectedCat(div, selectedCat);
			this._selectedCat = selectedCat;
			return;
		}
		
		this.config.dataProvider.loadCategories(function(cats) {
			self._renderSearchCats(div, cats);
		});
	},

	_renderSelectedCat: function(div, cat) {
		var input = $('input.result', div);
		input.val(this._formatResult(cat.name));
		div.addClass('no-combobox');
	},

	/**
	 * ������Ŀ��Ⱦselect
	 */
	_renderSearchCats: function(div, cats) {
		$.use('ui-combobox', $.proxy(this, '__renderSearchCats', div, cats));
	},

	__renderSearchCats: function(div, cats) {
		var self = this,
			items = self._createItems(cats),
			btn = $('a.search-btn', this.searchPanel),
			nullCat = { id: '', name: 'ȫ����Ϣ' };

		items.unshift({ text: nullCat.name, value: '0', cat: nullCat });

		div.empty().combobox({
			value: '0',
			data: items,
			resultTpl: function(item) {
				return self._formatResult(item.cat.name); 
			},
			change: function() {
				var elm = $('li.ui-combobox-selected', div);
				self._selectedCat = elm.data('item').cat;
				btn.click();
			}
		});

		this._renderSearchCatsSeparator(div, items);
	},

	/**
	 * ��ʽ����Ŀ����, �Ա���ʾ��result��
	 */
	_formatResult: function(name) {
		return name.substr(0, 6);
	},

	/** 
	 * ��Ⱦ��Ŀ�ָ���ʽ
	 */
	_renderSearchCatsSeparator: function(div, items) {
		var lis = $('li.ui-combobox-item', div),
			type = null;

		lis.each(function(index) {
			var li = $(this),
				cat = items[index].cat, 
				nowType = cat.type;

			li.attr('title', $.util.escapeHTML(cat.name, true));
			
			if (!nowType) {
				return;
			}
			
			if (type && type !== nowType) { // ��Ŀ���ͷ����仯
				li.addClass('item-separator');
			}

			type = nowType;
		})
	},

	/**
	 * ������Ŀ������Ⱦ���ݽṹ
	 * @param {array<object>} cats
	 * @param {int} level �㼶, ��������
	 */
	_createItems: function(cats, level) {
		var self = this,
			items = [];

		level = level || 0;
		$.each(cats, function(i, cat) {
			items.push({ text: self._formatCatName(cat.name, level), value: cat.id, cat: cat }); 
			if (cat.children) {
				items.push.apply(items, 
						self._createItems(cat.children, level + 1));
			}
		});

		return items;
	},

	/**
	 * ��ʽ��
	 */
	_formatCatName: function(name, level) {
		var prefix = '';
		for (var i = 0; i < level; i++) {
			prefix += '&nbsp;&nbsp;&nbsp;';
		}
		name = name || '';
		name = name.length > 10 ? name.substr(0, 10) + '..' : name;
		return prefix + $.util.escapeHTML(name, true); 
	},

	/**
	 * ���������¼�
	 */
	_handleSearchBtn: function() {
		var self = this,
			panel = this.searchPanel,
			btn = $('a.search-btn', panel),
			searchText = $('input.search-text', panel);

		btn.click(function(e) {
			e.preventDefault();

			var params = { 
					pageIndex: 1,
					category: self._selectedCat,
					keywords: $('input.search-text', panel).val()
				};

			self.Part.loadOffers(params);
		});

		searchText.keydown(function(e) {
			if (e.keyCode === 13) {
				e.preventDefault();
				btn.click();
			}
		});
	}

});
//~ SearchPanel


/**
 * ��ҳ��
 */
var PagingNav = new WP.Class({
	
	init: function(part) {
		this.Part = part;
		this.node = part.node;
		this.part = part.part;
		this.config = part.config;

		this.pagingNav = $('div.paging-nav', this.part);

		this._handleOffersLoad();
		this._handlePagingNav();
		this._handleJumpto();
	},

	/**
	 * offer�������Ҫ������Ⱦ��ҳ��
	 */
	_handleOffersLoad: function() {
		var self = this;
		this.node.bind('offer.load', function(e, data) {
			self.paging = $.extend({
				pageIndex: 1,
				pageCount: 0
			}, data);
			
			self._render();
			self._handleJumptoTextValidate();
		});
	},

	/**
	 * ��Ⱦ��ҳ��
	 */
	_render: function() {
		var paging = this.paging,
			pagingNav = this.pagingNav,
			pageIndex = paging.pageIndex,
			data = null,
			html = [],
			template = '<a href="page/{page}" class="{class}" data-page="{page}">{text}</a>';

		data = this._createData(paging);
		
		// prev
		html.push($.util.substitute(template, { 'class': 'page-prev', page: pageIndex - 1, text: '��һҳ' }));

		// num
		$.each(data, function(i, item) {
			html.push($.util.substitute(template, { 'class': item[2], page: item[0], text: item[1] }));
		});

		// next
		html.push($.util.substitute(template, { 'class': 'page-next', page: pageIndex + 1, text: '��һҳ' }));	

		// jump
		html.push('��ת�� <input type="text" class="jumpto-text" /> ҳ <a href="#" class="jumpto-btn">ȷ��</a>');
		
		pagingNav.empty().html(html.join('')).show();
		
		pageIndex <= 1 && $('a.page-prev', pagingNav).addClass('disabled');
		pageIndex >= paging.pageCount && $('a.page-next', pagingNav).addClass('disabled');
	},

	/**
	 * ������ҳ�����ݽṹ
	 */
	_createData: function(paging) {
		var result = [],
			pageIndex = paging.pageIndex,
			pageCount = paging.pageCount > 1 ? paging.pageCount : 1,

			size = 7,
			from = pageIndex - Math.floor((size - 4) / 2),
			to,
			now;
		
		// ������ȥͷβ4��ҳ����м�ҳ��
		from + size - 2 > pageCount && (from = pageCount - size + 3); 
		from < 3 && (from = 3);	// ���ٴӵ�3ҳ��ʼ
		to = from;
		for (var i = 0; i < size - 4; i++) {
			if (to > pageCount - 2) {
				break;
			}
			result.push([to, to, 'page-num']);
			to++;
		}
		to--;
		
		// ����ҳ��2
		if (pageCount > 1) {
			now = Math.floor((from + 1) / 2);
			result.unshift(from > now + 1 ? [now, '...', 'page-num omit'] : [now, now, 'page-num']); 
		}

		// ����ҳ��1
		if (pageCount > 0) {
			result.unshift([1, 1, 'page-num']);
		}

		// ��������2��ҳ��
		if (pageCount > 2) {
			now = Math.floor((pageCount + to + 1) / 2);
			result.push(to < now - 1 ? [now, '...', 'page-num omit'] : [now, now, 'page-num']);
		}

		// �������1��ҳ��
		if (pageCount > 3) {
			result.push([pageCount, pageCount, 'page-num'])
		}

		// ���current
		$.each(result, function(i, item) {
			if (item[0] === pageIndex) {
				item[2] += ' current';
				return false; // break
			}
		});

		return result;
	},

	/**
	 * ����ҳ���������֤
	 */
	_handleJumptoTextValidate: function() {
		var self = this,
			input = $('input.jumpto-text', this.pagingNav);
		$.use('wp-instantvalidator', function() {
			WP.widget.InstantValidator.validate(input, 'pagenum'); 
		});
	},

	/**
	 * �����ҳ�¼�
	 */
	_handlePagingNav: function() {
		var self = this;

		this.pagingNav.delegate('a[data-page]', 'click', function(e) {
			e.preventDefault();
			var link = $(this);
			if (link.hasClass('disabled') || link.hasClass('current')) {
				return;
			}
			self.Part.loadOffers({ pageIndex: $(this).data('page') });
		});
	},

	/**
	 * ������ת�¼�
	 */
	_handleJumpto: function() {
		var self = this;

		this.pagingNav.delegate('a.jumpto-btn', 'click', function(e) {
			e.preventDefault();

			var jumptoText = $('input.jumpto-text', self.pagingNav),
				page = parseInt(jumptoText.val()),
				pageCount = self.paging.pageCount;

			if (!page || page == self.paging.pageIndex) {
				return;
			}
			page = page < 1 ? 1 :
				page > pageCount ? pageCount : page;

			self.Part.loadOffers({ pageIndex: page })
		});

		this.pagingNav.delegate('input.jumpto-text', 'keydown', function(e) {
			if (e.keyCode === 13){
				$('a.jumpto-btn', self.pagingNav).click();
				return false;
			}
		});
	}

});
//~ PagingNav



/**
 * �Ҳ���ѡ��Offer����
 */
var SelectedOfferPart = new WP.Class({

	init: function(chooser) {
		this.Chooser = chooser;
		this.node = chooser.node;
		this.config = chooser.config;

		this.part = $('div.selected-offer-part', this.node);
		
		this.title = $('h3', this.part);
		this.offerList = $('div.offer-list', this.part);
		this.expireMessage = $('div.expire-message', this.part);

		this.maxSelectedCount = this.config.maxSelectedCount || 16;

		this._handleOfferSelect();
		this._handleOfferChange();
		
		this._initOfferList();
	},

	/**
	 * ��ʼ��Offer�б�
	 */
	_initOfferList: function() {
		this._loadSelectedOffers();
		Helper.handleOfferListHover(this.offerList);
		this._handleOfferListRemove();
		this._handleOfferListUpDown();
		this._initOfferListSortable();
	},
	
	/**
	 * ������ѡ���Offer(this.config.selectedOffers.length > 0)
	 */
	_loadSelectedOffers: function() {
		var self = this,
			selectedOffers = this.config.selectedOffers || [];
		// û������
		if (selectedOffers.length === 0) {
			this._renderEmptyOfferList();	
			return;
		}
		// ��selectedOffers
		Helper.showLoading(this.offerList);
		this.config.dataProvider.loadOffers(selectedOffers, function(data) {
			self._renderOfferList(data.offers);

			if (data.offers.length === self.maxSelectedCount) {
				self.node.trigger('offer.full');
			}
			self.inited = true; // ��ʶΪ�ѳ�ʼ��
		}, function() {
			Helper.showMessage(self.offerList, '���緱æ�����Ժ�����', 
					$.proxy(self, '_renderEmptyOfferList'));	
		});
	},

	_renderEmptyOfferList: function() {
		this.offerList.append($('<ul>'));
		this.inited = true; // ��ʶΪ�ѳ�ʼ��, ����getSelectedOffersId
		this._refreshStatus();
	},

	/**
	 * ��ȾOfferList
	 */
	_renderOfferList: function(offers) {
		var self = this,
			ul = $('<ul>');

		$.each(offers, function(i, offer) {
			ul.append(self._createOfferItem(offer));
			self.node.trigger('offer.add', offer);
		});

		this.offerList.empty().append(ul);
		this._refreshStatus();
	},

	/**
	 * ����һ��OfferListItem��
	 */
	_createOfferItem: function(offer) {
		var html = $.util.substitute(this._template, Helper.filterOffer(offer)),
			li = $(html);
		li.data('offer', offer);
		UI.resizeImage($('.image img', li), 50);
		offer.price || $('dd.price', li).remove();
		offer.expire || $('dd.status-expire', li).remove();
		return li;
	},

	
	/**
	 * �����Ƴ�����
	 */
	_handleOfferListRemove: function() {
		var self = this;

		this.offerList.delegate('a.delete-btn', 'click', function(e) {
			e.preventDefault();
			var li = $(this).closest('li'),
				offer = li.data('offer');
			
			li.remove();
			self.node.trigger('offer.remove', offer);
		});
	},
	
	/**
	 * ������������
	 */
	_handleOfferListUpDown: function() {
		var self = this;

		this.offerList.delegate('a.up-btn,a.down-btn', 'click', function(e) {
			e.preventDefault();	
			var li = $(this).closest('li'),
				offer = li.data('offer'),
				up = $(this).hasClass('up-btn'),
				sli = li[up ? 'prev' : 'next']();

			self._swapOfferItem(li, sli, function() {
				self.node.trigger('offer.move', offer);
			});
		});
	},

	/**
	 * ����Ч��,��������li
	 */
	_swapOfferItem: function(li, sli, callback) {
		var self = this,
			liPos = li.position(),
			sliPos = sli.position(),
			
			first = li.clone(),
			second = sli.clone(),

			times = 0,
			complete = null;

		this.offerList.addClass('status-animate');

		first.css({ 
			position: 'absolute', 
			left: liPos.left, 
			top: liPos.top,
			background: '#f6f6f6',
			opacity: 0.8
		}).insertAfter(li);

		second.css({ 
			position: 'absolute', 
			left: sliPos.left, 
			top: sliPos.top,
			background: '#f6f6f6',
			opacity: 0.8
		}).insertAfter(sli);
		
		complete = function() {
			if (++times < 2) {
				return;
			}
			first.remove();
			second.remove();
			
			li.index() < sli.index() ? sli.after(li) : 
					li.after(sli);
			li.css('visibility', 'visible');
			sli.css('visibility', 'visible');
			
			self.offerList.removeClass('status-animate');
			callback();
		};

		li.css('visibility', 'hidden');
		sli.css('visibility', 'hidden');
		
		first.animate({ top: sliPos.top }, complete);
		second.animate({ top: liPos.top }, complete);
	},
	//~ swapOfferItem

	_initOfferListSortable: function() {
		var self = this;
		$.use('ui-portlets', function() {
			$(self.offerList).portlets({
				items: 'li',
				axis: 'y',
				opacity: 0.8,
				stop: function(e, ui) {
					var offer = ui.currentItem.data('offer');
					self.node.trigger('offer.move', offer);	
				},
				revert: 200
			});
		});
	},

	/**
	 * ȡ����ѡ���offer�б�
	 */
	getSelectedOffers: function() {
		var offers = [];
		$('li', this.offerList).each(function() {
			offers.push($(this).data('offer'));
		});
		return offers;
	},

	/**
	 * ȡ�õ�ǰѡ���Offerid�б�
	 * ���offer�б�δ����, �򷵻�undefined
	 */
	getSelectedOffersId: function() {
		if (!this.inited) {
			return;
		}

		var offers = this.getSelectedOffers();
		return $.map(offers, function(offer) {
			return offer.id;
		});
	},


	/**
	 * ����offer.select�¼�
	 */
	_handleOfferSelect: function() {
		var self = this;

		this.node.bind('offer.select', function(e, offer) {
			var selectedOffers = self.getSelectedOffersId(),
				ul = $('ul', self.offerList),
				item = null;
			
			if (!self.inited || $.inArray(offer.id, selectedOffers) !== -1) {
				return;
			}

			if (selectedOffers.length >= self.maxSelectedCount) {
				return;
			}

			item = self._createOfferItem(offer);
			ul.append(item);
			
			self.node.trigger('offer.add', offer);
			
			if (selectedOffers.length + 1 === self.maxSelectedCount) {
				self.node.trigger('offer.full');
			}
		});
	},

	/**
	 * ���/�Ƴ�/�ƶ�����Ҫˢ�±����OfferListЧ��
	 */
	_handleOfferChange: function() {
		var self = this;
		this.node.bind('offer.add offer.remove offer.move', function() {
			self.inited && self._refreshStatus();
		});
	},

	_refreshStatus: function() {
		this._renderTitle();
		this._renderOfferListEffect();
		this._renderExpireMessage();
	},

	_renderTitle: function() {
		var title = this.config.selectedOfferTitle || 
				'��ѡ��<em>{selectedCount}</em>����������ѡ��<em>{maxSelectedCount}</em>��',
			selectedCount = $('li', this.offerList).length;

		title = $.util.substitute(title, {
			selectedCount: selectedCount,
			maxSelectedCount: this.maxSelectedCount
		});

		this.title.html(title);
	},

	/**
	 * ��OfferList�䶯ʱ��Ҫ����first/last��
	 * faint,CSS3֧�ֵĻ��Ͳ���Ҫ���������
	 */
	_renderOfferListEffect: function() {
		var lis = $('li', this.offerList);
		lis.removeClass('first last');
		lis.first().addClass('first');
		lis.last().addClass('last');
	},

	/**
	 * ��ʾ/���ع�����ʾ��Ϣ
	 */
	_renderExpireMessage: function() {
		var self = this,
			offers = this.getSelectedOffers();

		this.expireMessage.hide();

		$.each(offers, function(index, offer) {
			if (offer.expire) {
				self.expireMessage.show();
				return false; // break
			}	
		});
	},

	_template: 
'<li>\
	<dl>\
		<dt class="image"><div class="wrap"><img src="{image}" alt="{title}" /></div></dt>\
		<dd class="title">{formatedTitle}</dd>\
		<dd class="price">{price}</dd>\
		<dd class="status-expire">�ѹ���</dd>\
	</dl>\
	<a href="#" class="delete-btn">ɾ��</a>\
	<a href="#" class="up-btn">����</a>\
	<a href="#" class="down-btn">����</a>\
</li>'

});
//~ SelectedOfferPart


/**
 * ��Ʒѡ��Ի���
 */
var OfferChooserDialog = new WP.Class(WP.widget.Dialog, {

	init: function(config) {
		var	params = $.extend({
				header: 'ѡ���Ʒ',
				className: 'offer-chooser-dialog',
				draggable: true
			}, config, {
				contentSuccess: $.proxy(this, '_contentSuccess'),
				buttons: [
					{ 'class': 'd-confirm', 'value': 'ȷ��' },
					{ 'class': 'd-cancel', 'value': 'ȡ��' }
				]
			});

		this.parent.init.call(this, params);
	},

	_contentSuccess: function(dialog) {
		var container = dialog.getContainer(), 
			params = $.extend({
				appendTo: container
			}, this.config);
		
		container.empty();
		this.offerChooser = new OfferChooser(params);

		$.extend(this, Util.delegate(this.offerChooser, 
				['getSelectedOffers', 'getSelectedOffersId']));
	}

});
//~ OfferChooserDialog

WP.widget.OfferChooser = OfferChooser;
WP.widget.OfferChooserDialog = OfferChooserDialog;

$.add('wp-offer-chooser');


})(jQuery, Platform.winport);
