/**
 * @fileoverview ����ǰ̨���-������Ŀҳ
 * @see http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=49835940
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	TraceLog = WP.widget.TraceLog;

var ColumnModTraceLog = {
	init: function() {
		this.name = 'ColumnModTraceLog';
		Util.initParts(this);
	}
};

ColumnModTraceLog.Parts = {};


/**
 * ��Ӧ��Ʒ��Ŀҳ
 */
ColumnModTraceLog.Parts.AllOfferColumn = {
	init: function() {
		var mod = $('div.wp-all-offer-column');
		if (!mod.length) {
			return;
		}
		
		// �Զ�����������������ť
		new TraceLog([
			[$('a.offer-list-folding', mod), 'wp_page_offerlist_flexico'],
			[$('div.wp-search-in-site-unit input.search-btn', mod), 'wp_page_offerlist_mainsearch']
		]);
		
		// ���Զ�����������ı�
		new TraceLog('li a', 'wp_page_offerlist_selfcate', 
			{ delegate: $('div.wp-category-nav-unit', mod) });
		
		new TraceLog([
			// ����չʾ
			['a.windows,a.windows-select', 'wp_page_offerlist_windowshow'],
			// ͼ��չʾ
			['a.catalogs,a.catalogs-select', 'wp_page_offerlist_listshow'],
			// ʱ������
			['a.time-down,a.time-down-select,a.time-up-select', 'wp_page_offerlist_timequeue'],
			// �۸�����
			['a.price-up,a.price-up-select,a.price-down-select', 'wp_page_offerlist_pricequeue'],
			// ���ɸѡ
			['input.price-filter', 'wp_page_offerlist_pricefilter'],
			// ����ɸѡ
			['input.mix-filter', 'wp_page_offerlist_mixfilter'],
			// ��Ȩ��Ʒ
			['input.private-filter', 'wp_page_offerlist_privatefilter'],
			// ����ɸѡ
			['input.group-filter', 'wp_page_offerlist_groupfilter']
		], { delegate: $('div.wp-offerlist-view-setting', mod) });
		
		new TraceLog([
			// ��Ʒ����ͼ
			['li div.image', 'wp_page_offerlist_offerpic'],
			// ��Ʒ����
			['li div.title', 'wp_page_offerlist_offertitle']
		], { delegate: mod });
		
		
		// ��ҳ
		new TraceLog('a', 'wp_page_offerlist_pagenav', 
			{ delegate: $('div.wp-offer-paging', mod) });
	}
};
//~ AllOfferColumn


/**
 * ��˾������Ŀҳ
 */
ColumnModTraceLog.Parts.CompanyInfoColumn = {
	init: function() {
		var mod = $('div.wp-company-info-column');
		if (!mod.length) {
			return;
		}
		
		// ��ϸ��Ϣ
		new TraceLog([
			// ��Ӫ��Ʒ�����
			['th.th-mainprod', 'wp_page_compintro_detail_mainprod'],
			
			// ����ע����Ϣ	
			['th.th-auth', 'wp_page_compintro_detail_auth'],
			
			// ��ϸ��Ϣ-֤�鼰����
			['th.th-cert', 'wp_page_compintro_detail_cert'],
			
			// ���������
			['th.th-remark', 'wp_page_compintro_detail_remark'],
			
			// ���Ųο���
			['th.th-referman', 'wp_page_compintro_detail_referman']
			
		], { delegate: $('div.info-detail', mod) });
		
		// ��Ҫ�豸
		new TraceLog([
			// �豸����
			['li div.image', 'wp_page_compintro_equipment_pic'],
			
			// �豸ͼƬ	
			['li div.name a', 'wp_page_compintro_equipment_name']
			
		], { delegate: $('div.info-equip', mod) });
	}
};
//~ CompanyInfoColumn


/**
 * ��˾�����Ŀҳ
 */
ColumnModTraceLog.Parts.AlbumColumn = {
	init: function() {
		var mod = $('div.wp-albums-column');
		if (!mod.length) {
			return;
		}
		
 		new TraceLog([
			// ������ͼ
			['li div.cover', 'wp_page_album_pic'],
			// �������
			['li div.title', 'wp_page_album_title'],
			// ��ҳ
			['div.wp-album-paging a', 'wp_page_album_pagenav']
		], { delegate: mod });
	}
};
//~ AlbumColumn


/**
 * ��ϵ��ʽ��Ŀҳ
 */
ColumnModTraceLog.Parts.ContactInfoColumn = {
	init: function() {
		var mod = $('div.wp-contact-info-column');
		if (!mod.length) {
			return;
		}
		
		// ����Ǣ̸ICON
		new TraceLog($('a.alitalk', mod), 'wp_page_contact_alitalk');
		
		// ������
		new TraceLog([
			// ��ϵ��
			['a.membername', 'wp_page_contact_membername'],
			// ��������
			['a.topdomain', 'wp_page_contact_siteurl_topdomain'],
			// ��������
			['a.subdomain', 'wp_page_contact_siteurl_subdomain'],
			// �鿴�������
			['a.show-integrity', 'wp_page_contact_trust'],
			// ��վ
			['a.outsite', 'wp_page_contact_siteurl_outsite']
		], { delegate: mod });
	}
};
//~ ContactInfoColumn


/**
 * ��Աר����Ŀҳ
 */
ColumnModTraceLog.Parts.PrivateOfferColumn = {
	init: function() {
		var mod = $('div.wp-private-offer-column');
		if (!mod.length) {
			return;
		}
		
		// �Զ�����������������ť
		new TraceLog([
			[$('div.tips a.login', mod), 'wp_page_private_login'],
			[$('a.offer-list-folding', mod), 'wp_page_private_flexico']
		]);
		
		// ���Զ�����������ı�
		new TraceLog('li a', 'wp_page_private_selfcate', 
			{ delegate: $('div.wp-category-nav-unit', mod) });
		
		new TraceLog([
			// ����չʾ
			['a.windows,a.windows-select', 'wp_page_private_windowshow'],
			// ͼ��չʾ
			['a.catalogs,a.catalogs-select', 'wp_page_private_listshow'],
			// ʱ������
			['a.time-down,a.time-down-select,a.time-up-select', 'wp_page_private_timequeue'],
			// �۸�����
			['a.price-up,a.price-up-select,a.price-down-select', 'wp_page_private_pricequeue'],
			// ���ɸѡ
			['input.price-filter', 'wp_page_private_pricefilter'],
			// ����ɸѡ
			['input.mix-filter', 'wp_page_private_mixfilter']
			
		], { delegate: $('div.wp-offerlist-view-setting', mod) });
		
		new TraceLog([
			// ��Ʒ����ͼ
			['li div.image', 'wp_page_private_offerpic'],
			// ��Ʒ����
			['li div.title', 'wp_page_private_offertitle']
		], { delegate: mod });
		
		
		// ��ҳ
		new TraceLog('a', 'wp_page_private_pagenav', 
			{ delegate: $('div.wp-offer-paging', mod) });
	}
};
//~ PrivateOfferColumn



WP.PageContext.register('~ColumnModTraceLog', ColumnModTraceLog);

	
})(jQuery, Platform.winport);

