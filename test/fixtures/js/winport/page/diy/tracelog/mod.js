/**
 * @fileoverview DIY��̨���-���༭
 * @see http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=49835940
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	TraceLog = WP.widget.TraceLog;

var DiyModTraceLog = {
	init: function() {
		this.name = 'DiyModTraceLog';
		Util.initParts(this);
	}
};

DiyModTraceLog.Parts = {};

/**
 * ������
 */
DiyModTraceLog.Parts.TopNav = {
	init: function() {
		new TraceLog('div.wp-top-nav li', function() {
			var map = {
					// ��ҳ
					'sy': 'wp_design_page_go_index',
					// ��Ӧ��Ϣ
					'gy': 'wp_design_page_go_prod',
					// ���ŵ���
					'zs': 'wp_design_page_go_trust',
					// ��˾����
					'js': 'wp_design_page_go_comp',
					// ���
					'xc': 'wp_design_page_go_album',
					// ��˾��̬
					'dt': 'wp_design_page_go_news',
					// ��ϵ��ʽ
					'lx': 'wp_design_page_go_contact',
					// ��Աר��
					'hy': 'wp_design_page_go_private',
					// offerdetail
					'od': 'wp_design_page_go_offerdetail',
					// �Զ���ҳ��
					'c1': 'wp_design_nav_go_diypage',
					'c2': 'wp_design_nav_go_diypage'
				},
				type = $(this).data('page-type');
			return map[type] || false;
		}, { delegate: true });
	}
};
//~ TopNav

/**
 * ���ư��
 */
DiyModTraceLog.Parts.CompanyName = {
	
	init: function() {
		// ����ͼ--�ϴ�
		new TraceLog('div.company-name-form-dialog',  
				'wp_design_widget_signboard_uploadboard', 
				{ event: 'topbanner-upload', delegate: true });
				
		// ��˾��־--�ϴ�
		new TraceLog('div.company-name-form-dialog',  
				'wp_design_widget_signboard_uploadsign', 
				{ event: 'logo-upload', delegate: true });
				
		new TraceLog([
			// ��˾��־--ɾ��
			['div.company-name-form-dialog div.logo-part a.remove', 
					'wp_design_widget_signboard_deletesign'],
			
			// ������--ȡ��ѡ����ʾ������checkbox
			['div.company-name-form-dialog dl.zh-section input.show-zh', 
					'wp_design_widget_signboard_cnname_isdisplay'],
					
			// ������--��������
			['div.company-name-form-dialog dl.zh-section select.font-family', 
					'wp_design_widget_signboard_cnname_fontfamily'],
					
			// ������--�����ֺ�
			['div.company-name-form-dialog dl.zh-section select.font-size', 
					'wp_design_widget_signboard_cnname_fontsize'],
					
			// ������--������ʽ
			['div.company-name-form-dialog dl.zh-section a.setting', 
					'wp_design_widget_signboard_cnname_setstyle'],
					
			// ������--���üӴ�
			['div.company-name-form-dialog dl.zh-section input.font-bold', 
					'wp_design_widget_signboard_cnname_bold'],
					
			// ������--����б��
			['div.company-name-form-dialog dl.zh-section input.font-italic', 
					'wp_design_widget_signboard_cnname_italic'],
					
			// ������--������ɫ
			['div.company-name-form-dialog dl.zh-section a.color-picker', 
					'wp_design_widget_signboard_cname_color'],
					
			// Ӣ����--ȡ��ѡ����ʾ������checkbox
			['div.company-name-form-dialog dl.en-section input.show-zh', 
					'wp_design_widget_signboard_enname_isdisplay'],
					
			// Ӣ����--��������	
			['div.company-name-form-dialog dl.en-section select.font-family', 
					'wp_design_widget_signboard_enname_fontfamily'],
					
			// Ӣ����--�����ֺ�
			['div.company-name-form-dialog dl.en-section select.font-size', 
					'wp_design_widget_signboard_enname_fontsize'],
					
			// Ӣ����--������ʽ
			['div.company-name-form-dialog dl.en-section a.setting', 
					'wp_design_widget_signboard_enname_setstyle'],
					
			// Ӣ����--���üӴ�
			['div.company-name-form-dialog dl.en-section input.font-bold', 
					'wp_design_widget_signboard_enname_bold'],
					
			// Ӣ����--����б��
			['div.company-name-form-dialog dl.en-section input.font-italic', 
					'wp_design_widget_signboard_enname_italic'],
					
			// Ӣ����--������ɫ
			['div.company-name-form-dialog dl.en-section a.color-picker', 
					'wp_design_widget_signboard_ename_color'],
					
			// Ӣ����--ȷ��
			['div.company-name-form-dialog a.d-confirm', 
					'wp_design_widget_signboard_confirm']

		], { delegate: true });
	}
	
};
//~ CompanyName

/**
 * ��Ӧ��Ʒ(�Զ�)
 */
DiyModTraceLog.Parts.AutoRecOffers = {
	
	init: function() {
		// ������Ի���
		this.initTraceLog('div.auto-rec-offers-main-form-dialog');
		// ������Ի���
		this.initTraceLog('div.auto-rec-offers-sub-form-dialog');
	},
	
	
	initTraceLog: function(parent) {
		new TraceLog([
			// ���ò�Ʒ����
			[parent + ' select[name=catId]', 
					'wp_design_widget_prodlistauto_cate'],
			
			// �����Ʒ��������
			[parent + ' a.manage-category', 
					'wp_design_widget_prodlistauto_managecatelink'],
					
			// ѡ����Ϣ����
			[parent + ' input[name=filterType]', 
				function() {
					var map = {
						// ����
						groupFilter: 'wp_design_widget_prodlistauto_type_group',
						// ��Ȩ
						privateFilter: 'wp_design_widget_prodlistauto_type_auth',
						// ����
						mixFilter: 'wp_design_widget_prodlistauto_type_mix'
					};
					return map[this.value] || false;
				}
			],
			
			// ѡ��ɸѡ�۸�Χ
			[parent + ' input[name=priceFilter]',
				'wp_design_widget_prodlistauto_pricecheck'],
			
			// Ԥ��ɸѡ�������
			[parent + ' a.auto-offer-preview-a',
				'wp_design_widget_prodlistauto_previewlink'],
				
			// ���ò�Ʒ����
			[parent + ' select[name=sortType]', 
					'wp_design_widget_prodlistauto_order'],	
			
			// ������ʾ����
			[parent + ' select[name=count]', 
					'wp_design_widget_prodlistauto_num'],		
			
			// ȷ��
			[parent + ' a.d-confirm',
				'wp_design_widget_prodlistauto_ok']
				
		], { delegate: true });
		
		new TraceLog(parent + ' input.keywords', 
			'wp_design_widget_prodlistauto_keyword', 
			{ when: 'inputtext', delegate: true });
	}
	
};
//~ AutoRecOffers


/**
 * �������
 */
DiyModTraceLog.Parts.Basic = {
	
	init: function() {
		new TraceLog([
			// ��Ʒ����
			['div.category-nav-form-dialog a.manage-link', 
					'wp_design_widget_prodcate_managecatelink'],
			['div.category-nav-form-dialog a.d-confirm', 
					'wp_design_widget_prodcate_ok'],
			
			// վ������
			['div.search-in-site-form-dialog input[name=isShowPrice][value=false]', 
					'wp_design_widget_search_pricesupport'],
					
			['div.search-in-site-form-dialog a.d-confirm', 
					'wp_design_widget_search_ok'],
					
					
			// ���²�Ʒ(��)
			['div.new-supply-offers-main-form-dialog select[name=maxNum]', 
					'wp_design_widget_prodnew_num'],
			['div.new-supply-offers-main-form-dialog a.d-confirm', 
					'wp_design_widget_prodnew_ok'],
					
			// ���²�Ʒ(��)	
			['div.new-supply-offers-sub-form-dialog select[name=maxNum]', 
					'wp_design_widget_prodnew_num'],
			['div.new-supply-offers-sub-form-dialog a.d-confirm', 
					'wp_design_widget_prodnew_ok'],
					
			// ����б�
			['div.albums-form-dialog select[name=maxNum]', 
					'wp_design_widget_albumlistauto_num'],
			['div.albums-form-dialog a.order-link', 
					'wp_design_widget_albumlistauto_orderlink'],
			['div.albums-form-dialog a.d-confirm', 
					'wp_design_widget_albumlistauto_ok'],
					
			// �Ƽ����
			['div.recommend-albums-form-dialog a.manage-link', 
					'wp_design_widget_albumlistmanual_managelink'],
			['div.recommend-albums-form-dialog a.d-confirm', 
					'wp_design_widget_albumlistmanual_ok'],
					
			// ��˾����
			['div.company-info-form-dialog a.manage-link', 
					'wp_design_widget_compintro_managelink'],
			['div.company-info-form-dialog a.d-confirm', 
					'wp_design_widget_compintro_ok'],
					
					
			// ��˾��̬
			['div.news-list-form-dialog select[name=maxNum]', 
					'wp_design_widget_news_num'],
			['div.news-list-form-dialog a.manage-link', 
					'wp_design_widget_news_managelink'],
			['div.news-list-form-dialog a.d-confirm', 
					'wp_design_widget_news_ok'],
					
			// ����-��������
			['form.category-nav-form a.open', 'wp_design_widget_prodcate_start'],
					
					
			// ��ϵ��ʽ(��)
			['div.contact-info-main-form-dialog a.manage-link', 
					'wp_design_widget_contact_managelink'],
			['div.contact-info-main-form-dialog a.d-confirm', 
					'wp_design_widget_contact_ok'],
					
			// ��ϵ��ʽ(��)
			['div.contact-info-sub-form-dialog a.manage-link', 
					'wp_design_widget_contact_managelink'],
			['div.contact-info-sub-form-dialog a.d-confirm', 
					'wp_design_widget_contact_ok'],
					
			// ��������
			['div.friend-link-form-dialog a.manage-link', 
					'wp_design_widget_friendlink_managelink'],
			['div.friend-link-form-dialog a.d-confirm', 
					'wp_design_widget_friendlink_ok']
		], { delegate: true });
	}
	
};
//~ Basic


/**
 * �Զ������ݰ��
 */
DiyModTraceLog.Parts.CustomContent = {
	
	init: function() {
		new TraceLog([
			// ȷ��
			['div.custom-content-form-dialog a.d-confirm', 
					'wp_design_widget_diypage_post'],
			// ȡ��
			['div.custom-content-form-dialog a.d-cancel', 
					'wp_design_widget_diypage_giveup']
		], { delegate: true });
		
		// �༭
		new TraceLog('div.mod-box div.box-bar a.edit', function() {
			var box = $(this).closest('div.mod-box');
			return $('div.wp-custom-content', box).length ? 'wp_design_widget_diypage_manage' : false;
		}, { delegate: true });	
	}


};
//~ CustomContent

/**
 * ��Ӧ��Ʒ(�ֶ�)
 */
DiyModTraceLog.Parts.SelfRecOffers = {
	
	init: function() {
		new TraceLog([
			// ѡ���Ʒ
			['div.selfRecOffers-form-dialog a.displayOfferList-b-selectPro', 
					'wp_design_widget_prodlisthand_choose'],
			// ȷ��
			['div.selfRecOffers-form-dialog a.d-confirm',
					'wp_design_widget_prodlisthand_ok']

		], { delegate: true });

		// ����
		new TraceLog(
			'div.selfRecOffers-form-dialog input.wp_showcase_title', 
			'wp_design_widget_prodlisthand_num', 
			{ when: 'inputtext', delegate: true }
		);
	}

};



WP.PageContext.register('~DiyModTraceLog', DiyModTraceLog);

	
})(jQuery, Platform.winport);
