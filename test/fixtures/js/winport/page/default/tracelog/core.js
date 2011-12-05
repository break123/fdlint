/**
 * @fileoverview ����ǰ̨���-���İ��
 * @see http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=49835940
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	TraceLog = WP.widget.TraceLog;

var CoreModTraceLog = {
	init: function() {
		this.name = 'CoreModTraceLog';
		Util.initParts(this);
	},
	
	gridMain: function(elm) {
		return $(elm).closest('div.grid-main').length > 0;
	}
};

CoreModTraceLog.Parts = {};

/**
 * ����
 */
CoreModTraceLog.Parts.CompanyName = {
	init: function() {
		new TraceLog([
			// ��˾��־
			['div.logo a', 'wp_widget_signboard_sign'],
			// ��˾������
			['a.chinaname', 'wp_widget_signboard_cnname'],
			// ��˾Ӣ����
			['a.enname', 'wp_widget_signboard_enname']
		], { delegate: 'div.wp-company-name' });
	}
};
//~ CompanyName

/**
 * ������
 */
CoreModTraceLog.Parts.TopNav = {
	init: function() {
		new TraceLog('li', function() {
			var map = {
					// ��ҳ
					'sy': 'wp_widget_nav_index',
					// ��Ӧ��Ϣ
					'gy': 'wp_widget_nav_prod',
					// ���ŵ���
					'zs': 'wp_widget_nav_trust',
					// ��˾����
					'js': 'wp_widget_nav_comp',
					// ���
					'xc': 'wp_widget_nav_album',
					// ��˾��̬
					'dt': 'wp_widget_nav_news',
					// ��ϵ��ʽ
					'lx': 'wp_widget_nav_contact',
					// ��Աר��
					'hy': 'wp_widget_nav_private',
					// offerdetail
					'od': 'wp_widget_nav_offerdetail',
					// �Զ���ҳ��
					'c1': 'wp_page_diypage',
					'c2': 'wp_page_diypage'
				},
				type = $(this).data('page-type');
			return map[type] || false;
		}, { delegate: 'div.wp-top-nav' });
	}
};

/**
 * ��Ӧ����Ϣ���
 */
CoreModTraceLog.Parts.SupplierInfo = {
	
	init: function() {
		var mod = $('div.wp-supplier-info');
		
		new TraceLog([
			// ��˾��������TPʱ��������
			['a.tplogo', 'wp_widget_supplierinfo_logo'],
			
			// ��˾��������TPʱ��������
			['div.companyname a', 'wp_widget_supplierinfo_compname'],
			
			// ���ű���ICON
			['div.guarantee a.basic-trust', 'wp_widget_supplierinfo_trust_ico'],
			
			// ���ñ��Ͻ�
			['p.guarantee-money a', 'wp_widget_supplierinfo_trust_money'],
			
			// �����⸶
			['div.guarantee p.compensate a', 'wp_widget_supplierinfo_trust_xxpf'],
			
			// ����ָͨ��
			['dl.tp-score a.score-value', 'wp_widget_supplierinfo_trustindex'],
			
			// ֤������
			['dl.tp-honor dd a', 'wp_widget_supplierinfo_cert'],
			
			// ��Ʒ������
			['dl.sat-rate a.rate-value', 'wp_widget_supplierinfo_remark'],
			
			// ����ע����ϢICON
			['a.certificate-etp', 'wp_widget_supplierinfo_auth'],
			
			// �ӹ������ĸ�������
			['div.process-panel a.more', 'wp_widget_supplierinfo_process_more'],
			
			// ��������-�ռ���/�����淢����
			['li.honor-founder a,li.honor-popular a', 'wp_widget_supplierinfo_sponsor'],
			
			// ��������-Ʒ��
			['li.honor-goldenbrand a', 'wp_widget_supplierinfo_goldenbrand'],
			
			// ��������-��ҵ�ȷ�
			['li.honor-precursor a', 'wp_widget_supplierinfo_precursor'],

			// ��������-�����ȷ�
			['li.honor-auction a', 'wp_widget_supplierinfo_auction'],
			
			// ��������-�ƹ�����
			['li.honor-p4p a', 'wp_widget_supplierinfo_p4p'],
			
			// ��������-������ʹ
			['li.honor-fx a', 'wp_widget_supplierinfo_fx'],
			
			// �ղذ�ť
			['a.pagecollect', 'wp_widget_supplierinfo_favorite'],
			
			// ��ɫ����-Ԥ������밴ť
			['div.precharge-panel a.apply', 'wp_widget_supplierinfo_precharge_apply '],
			
			// ��ɫ����-Ԥ����ֵ��ť
			['div.precharge-panel a.charge', 'wp_widget_supplierinfo_precharge_pay'],
			
			// ��Ա����--������Ȩ
			['div.private-panel a.apply-btn', 'wp_widget_supplierinfo_private_apply'],
			
			// ��Ա����--�鿴��Աר��
			['div.private-panel a.view-link', 'wp_widget_supplierinfo_private_gotoprivatepage'],
			
			//ʵ����֤icon
			['dd.authentication a', 'wp_infowidget_quotation']
		], { delegate: mod });
		
		// ����Ǣ̸ICON
		new TraceLog($('a.alitalk', mod), 'wp_widget_supplierinfo_alitalk');
		
		new TraceLog([
			// �ӹ�����
			['a.process-ability', 'wp_widget_supplierinfo_process_ico'],
						
			// ��Ա����-�ۿ�ICON
			['dl.member-service a.discount', 'wp_widget_supplierinfo_private_discountico'],
			
			// ��Ա����-˽��ICON
			['dl.member-service a.private', 'wp_widget_supplierinfo_private_privateico'],
			
			// Ԥ���
			['a.precharge', 'wp_widget_supplierinfo_precharge_ico']
				
		], { once: true, event: 'mouseenter', delegate: mod });
	}
	
};
//~ SupplierInfo


/**
 * ��˾����
 */
CoreModTraceLog.Parts.CompanyInfo = {
	init: function() {
		new TraceLog('a.more', 'wp_widget_compintro_more', { delegate: 'div.wp-company-info' });
	}
};
//~ CompanyInfo


/**
 * ��Ӧ��Ʒ(��Ӧ��Ʒ-�Զ������²�Ʒ)
 */
CoreModTraceLog.Parts.OfferList = {
	init: function() {
		var modMain = $('div.wp-auto-rec-offers-main,div.wp-new-supply-offers-main'),
			modSub = $('div.wp-auto-rec-offers-sub,div.wp-new-supply-offers-sub');
		
		// ������
		new TraceLog([
			['div.image', 'wp_widget_offer_main_pic'],
			['div.title a', 'wp_widget_offer_main_tile'],
			['a.more', 'wp_widget_offer_main_more']
		], { delegate: modMain });
		
		// ��߿�
		new TraceLog([
			['div.image', 'wp_widget_offer_side_pic'],
			['div.title a', 'wp_widget_offer_side_tile'],
			['a.more', 'wp_widget_offer_side_more']
		], { delegate: modSub });
	}
};
//~ OfferList


/**
 * �����
 */
CoreModTraceLog.Parts.Albums = {
	init: function() {
		var self = this;
		new TraceLog([
			// ������ͼ
			['li div.cover', function() {
				return self.gridMain(this) ? 
						'wp_widget_album_main_pic' : 'wp_widget_album_side_pic';
			}],
			// �������
			['li div.title a', function() {
				return self.gridMain(this) ? 
						'wp_widget_album_main_title' : 'wp_widget_album_side_title';
			}],
			// ����
			['a.more', function() {
				return self.gridMain(this) ? 
						'wp_widget_album_main_more' : 'wp_widget_album_side_more';
			}]
		], { delegate: 'div.wp-albums,div.wp-recommend-albums' });
	}
};
//~ Albums

/**
 * ��˾����
 */
CoreModTraceLog.Parts.CompanyInfo = {
	init: function() {
		var self = this;
		
		new TraceLog([
			['div.info-image a', function() {
				return self.gridMain(this) ? 
					'wp_widget_compintro_main_pic' : 
					'wp_widget_compintro_side_pic';
			}],
			['a.more', function() {
				return self.gridMain(this) ? 
					'wp_widget_compintro_main_more' : 
					'wp_widget_compintro_side_more';
			}]
		], { delegate: 'div.wp-company-info' });
	}
};
//~ CompanyInfo

/**
 * ��˾��̬
 */
CoreModTraceLog.Parts.NewsList = {
	init: function() {
		var self = this,
			isHomePage = $('#doc').data('doc-config').isHomepage;
		
		new TraceLog([
			// ���±���
			['li a', function() {
				return !self.gridMain(this) ? 'wp_widget_news_side_title' :	// �����
						isHomePage ? 'wp_widget_news_main_title' : 			// ��������
								'wp_page_news_title';						// ������Ŀҳ
			}],
			
			// ����
			['a.more', function() {
				return !self.gridMain(this) ? 'wp_widget_news_side_more' : // �����
						isHomePage ? 'wp_widget_news_main_more' : 		   // ������Ŀҳ
								'wp_page_news_more';
			}]
		], { delegate: 'div.wp-news-list' });
	}
};
//~ NewsList

/**
 * �Զ������
 */
CoreModTraceLog.Parts.CategoryNav = {
	init: function() {
		var modMain = $('div.wp-category-nav-main'),
			modSub = $('div.wp-category-nav-sub');
		
		// �����������ı�
		new TraceLog('a.name', 'wp_widget_prodcate_main_title', { delegate: modMain });
		
		// �����
		new TraceLog([
			// ������ı�
			['a.name', 'wp_widget_prodcate_side_title'],
			// �����ͼƬ
			['a.image', 'wp_widget_prodcate_side_pic']
		], { delegate: modSub });
	}
};


/**
 * ��ϵ��ʽ
 */
CoreModTraceLog.Parts.ContactInfo = {
	init: function() {
		var modMain = $('div.wp-contact-info-main'),
			modSub = $('div.wp-contact-info-sub');
		
		// ������
		new TraceLog([
			// ��ϵ��
			['a.membername', 'wp_widget_contact_main_membername'],
			// ��������
			['a.topdomain', 'wp_widget_contact_main_siteurl_topdomain'],
			// ��������
			['a.subdomain', 'wp_widget_contact_main_siteurl_subdomain'],
			// ��վ
			['a.outsite', 'wp_page_contact_siteurl_outsite'],
			// ����
			['a.more', 'wp_widget_contact_main_more']
		], { delegate: modMain });
		
		// ����Ǣ̸ICON
		new TraceLog([
			[$('a.alitalk', modMain), 'wp_widget_contact_main_alitalk'],
			[$('a.alitalk', modSub), 'wp_widget_contact_side_alitalk']
		]);
		
		// �����
		new TraceLog([
			// ��ϵ��
			['a.membername', 'wp_widget_contact_side_membername'],
			// ����
			['a.more', 'wp_widget_contact_side_more']
		], { delegate: modSub });
	}
};
//~ FriendLink

/**
 * ��������
 */
CoreModTraceLog.Parts.FriendLink = {
	init: function() {
		var self = this;
		new TraceLog('li a', function() {
			return self.gridMain(this) ? 
					'wp_widget_friendlink_main_title' :
					'wp_widget_friendlink_side_title'
					
		}, { delegate: 'div.wp-friend-link' });
	}
};
//~ ContactInfo


/**
 * ��Ӧ��Ʒ(�ֶ�)
 */
CoreModTraceLog.Parts.SelfRecOffers = {
	init: function() {
		var self = this;
		new TraceLog([
			['div.image', function() {
				return self.gridMain(this) ? 'wp_widget_offer_main_pic': 'wp_widget_offer_side_pic'
			}],

			['div.title a', function() {
				return self.gridMain(this) ? 'wp_widget_offer_main_tile': 'wp_widget_offer_side_tile'
			}],

			['a.more', function() {
				return self.gridMain(this) ? 'wp_widget_offer_main_more': 'wp_widget_offer_side_more'
			}]

		], { delegate: 'div.vas-selfRecOffers' });
	}
};
//~


/**
 * Footer
 */
CoreModTraceLog.Parts.Footer = {
	init: function() {
		new TraceLog([
			// ����֧��-����Ͱ�
			['a.footer-alibaba', 'wp_footer_alibaba'],
			// ���̹������
			['a.footer-wpadmin', 'wp_footer_wpadmin'],
			// ��������
			['a.footer-inform', 'wp_footer_inform'],
			// ��ҵ�ʾ�
			['a.footer-postoffice', 'wp_footer_postoffice']
		], { delegate: '#footer' })
	}
};
//~ Footer



WP.PageContext.register('~CoreModTraceLog', CoreModTraceLog);

	
})(jQuery, Platform.winport);
