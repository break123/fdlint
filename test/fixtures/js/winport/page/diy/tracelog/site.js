/**
 * @fileoverview DIY��̨��� - ȫ��
 * @see http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=49835940
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	TraceLog = WP.widget.TraceLog;

var DiySiteTraceLog = {
	init: function() {
		this.name = 'DiySiteTraceLog';
		Util.initParts(this);
	}
};

DiySiteTraceLog.Parts = {};

/**
 * ȫ��
 */
DiySiteTraceLog.Parts.Site = {
	init: function() {
		var header = $('#header'),
			help = $('ul.help-topics li', header),
			tabs = $('ul.setting-tabs li', header);

		new TraceLog([
			// ����
			[$('a.publish', header), 'wp_design_post'],

			// �߼�װ��
			[$('a.advanced-diy', header), 'wp_pt_adv'],
			
			// ����-װ����
			[help.eq(0), 'wp_design_help_guide'],
			// ����--��������
			[help.eq(1), 'wp_design_help_kf'],
			// ����--��������
			[help.eq(2), 'wp_design_help_aniu'],
			// ����--��������
			[help.eq(3), 'wp_design_help_about'],
			
			//����ģʽ
			['#view-mode-switch', function() {
				return $('#winport-content').hasClass('mini-mode') ?
						'wp_design_layoutmode_unfold' : 'wp_design_layoutmode_fold';
			}],
			
			//TOPBAR������ť
			[$('div.collapse-bar a.handle', header), 'wp_design_topbar_fold'],
			
			// TOPBARչ��
			[$('div.expand-bar a.handle', header), 'wp_design_topbar_unfold'],
			
			//����ײ��İ����Ӻ���
			['div.box-adder', 'wp_design_addwidget'],
			
			// �л���������TAB
			[tabs.eq(0), 'wp_design_tab_theme'],
			
			// �л���ҳ�����TAB
			[tabs.eq(1), 'wp_design_tab_page']
		]);
		
		// ������ICON
		new TraceLog('a.box-fly-adder', 'wp_design_widget_add', { delegate: true });
		
		new TraceLog([
			// ����ƶ�ICON
			['div.box-bar a.left,div.box-bar a.up,div.box-bar a.down,div.box-bar a.right', 
					'wp_design_widget_move_icon'],
			// ���༭ICON
			['div.box-bar a.edit', 'wp_design_widget_config'],
			// ���ɾ��ICON
			['div.box-bar a.del', 'wp_design_widget_delete']
		], { delegate: true });
		
		// �����ק
		new TraceLog('div.mod-box', 'wp_design_widget_move_draw', { delegate: true, event: 'ddstop' });
		
		// �л���ҳ�����TAB--����ҳ�����TAB
		// �л���ҳ�����TAB--����ҳ�����TAB
		new TraceLog('div.diy-pages ul.pages-tabs li', function() {
			return $(this).index() === 0 ? 'wp_design_tab_page_basepage' : 
					'wp_design_tab_page_offerdetail';
		}, { delegate: '#header div.setting-panel' });
	}
};
//~ Site


/**
 * ����
 */
DiySiteTraceLog.Parts.Skins = {
	
	init: function() {
		new TraceLog('div.diy-skins div.cats-body a', function() {
			var map = [ 'all', 'red', 'purple', 'blue',
				'green', 'black', 'orange', 'yellow', 
				'white', 'other'
			], 
			tracelog = map[$(this).data('paging')];
			return tracelog ? 'wp_design_theme_' + tracelog : false;
		}, { delegate: '#header div.setting-panel' });
	}
	
};
//~ Skins


/**
 * ҳ�����
 */
DiySiteTraceLog.Parts.Pages = {
	init: function() {
		new TraceLog(window, function(e, data) {
			var type = data.type,
				map = {
					// ҳ��˳���ƶ���ť
					'update-page-list-updown': 'wp_design_page_move_icon',
					// ҳ��˳����ק����
					'update-page-list-drag': 'wp_design_page_move_draw',
					// ���ѡ�л�ȡ��ѡ����ʾ�ڵ�����checkbox
					'update-page-nav-status': 'wp_design_page_nav',
					// �޸�ҳ�����Ƶı��水ť
					'update-page-name': 'wp_design_page_savename'
				};
			return map[type] || false;
		}, { event: 'diychanged' });
		
		// ҳ�����Ť
		new TraceLog('div.diy-pages a.diypage', function() {
			var tr = $(this).closest('tr'),
				map = {
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
					'c1': 'wp_design_page_go_diypage',
					'c2': 'wp_design_page_go_diypage'
				},
				type = (tr.data('page') || {}).type;
			return map[type] || false;
		}, { delegate: '#header div.setting-panel' });
	}
}
//~ Pages


/**
 * �������(��ͨ���)
 */
DiySiteTraceLog.Parts.ListPanel = {
	init: function() {
		this.initBaseMod();
		this.initAdvMod();
	},

	/**
	 * ��ͨ���
	 */
	initBaseMod: function() {
		var map = {
			// ��Ӧ��Ʒ���Զ���
			'offer.list:autoRecOffers': 'wp_design_widgetbox_add_prodlistauto',		
			// ��Ʒ����
			'wp.categorynav:categoryNav': 'wp_design_widgetbox_add_prodcate',		
			// ��Ʒ����
			'wp.searchinsite:searchInSite': 'wp_design_widgetbox_add_search',		
			// ���²�Ʒ
			'offer.list:newSupplyOffers': 'wp_design_widgetbox_add_prodnew',
			// ��˾����
			'company.profile:companyInfo': 'wp_design_widgetbox_add_compintro',		
			// ��˾��̬
			'wp.misc:newsList': 'wp_design_widgetbox_add_news',						
			// ��ϵ��ʽ
			'member.contact:contactInfo': 'wp_design_widgetbox_add_contact',		
			// ��������
			'wp.friendlink:friendLink': 'wp_design_widgetbox_add_friendlink',		
			// ��˾���
			'album:albumList': 'wp_design_widgetbox_add_albumlistauto',				
			// �Ƽ����
			'album:recAlbum': 'wp_design_widgetbox_add_albumlistmanual',							
			// ��Ӧ��Ʒ(�ֶ�)
			'vas.winport:selfRecOffers': 'wp_design_widgetbox_add_prodlisthand'
		};

		new TraceLog('div.mod-list-panel a.add-mod', function() {
			var li = $(this).closest('li'),
				cid = li.data('addConfig').cid;
			return map[cid];
		}, { delegate: true });
	},

	/**
	 * �߼����
	 */
	initAdvMod: function() {
		var map = {
			// ���ܳ���
			'vas.winport:recOfferIntelligent': ['wp_pt_buy_zn', 'wp_pt_zn_do'],
			// ��˾���
			'vas.winport:companyAppearance': ['wp_pt_buy_fc', 'wp_pt_fc_do'],
			// ��ͼ�ֲ�
			'vas.winport:recOfferImageRoll': ['wp_pt_buy_lb', 'wp_pt_lb_do'],
			// ����չʾ
			'vas.winport:recOfferRoll': ['wp_pt_buy_gd', 'wp_pt_gd_do'],
			// רҵ�б�
			'vas.winport:recOfferFeatureList': ['wp_pt_buy_list', 'wp_pt_list_do'],
			// ��˾��Ƶ
			'vas.winport:companyVideo': ['wp_pt_buy_sp', 'wp_pt_sp_do']
		};

		new TraceLog('div.mod-list-panel a.add-mod', function() {
			var li = $(this).closest('li'),
				cid = li.data('addConfig').cid;
			return (map[cid] || {})[1];
		}, { delegate: true });

		new TraceLog('div.mod-list-panel a.purchase-mod', function() {
			var li = $(this).closest('li'),
				cid = li.data('addConfig').cid;
			return (map[cid] || {})[0];
		}, { delegate: true });

	}
};

//~ ListPanel


/**
 * �¾ɰ��л�
 */
DiySiteTraceLog.Parts.SwitchVersion = {
	init: function() {
		new TraceLog([
			// �����
			['#header a.switch-advice', 'wp_design_switch_advise'],
			// �°湫�����ؾɰ������
			['#header a.switch-version', 'wp_design_switch_toold_link'],
			// �°�ؾɰ��ǿ����������--���ؾɰ水ť
			['div.switch-version-dialog a.d-confirm', 'wp_design_switch_toold_button_toold'],
			// �°��ɰ��ǿ����������--���������°�İ�ť
			['div.switch-version-dialog a.d-cancel', 'wp_design_switch_toold_button_remainnew']
		], { delegate: true });
	}
};
//~ SwitchVersion


/**
 * װ����
 */
DiySiteTraceLog.Parts.Guide = {
	init: function() {
		new TraceLog('div.diy-guide', function(e, data) {
			return data.action === 'next' ? 
				'wp_design_guide_nextbutton_' + (data.step + 1) : false;
		}, { event: 'diyguide', delegate: true });
	}
};
//~ Guide


WP.PageContext.register('~DiySiteTraceLog', DiySiteTraceLog);

	
})(jQuery, Platform.winport);
