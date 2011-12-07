/**
 * @fileoverview DIY�������-������
 * 
 * @author qijun.weiqj
 */
(function($, WP) {

var Util = WP.Util,
	UI = WP.UI,
	PagingSwitcher = WP.widget.PagingSwitcher,
	Schedule = WP.Schedule,
	Diy = WP.diy.Diy,
	Msg = WP.diy.Msg;
	

var DiySkins = {
	
	init: function(div, config) {
		this.div = div;
		this.config = config;
		
		this.initCatsPanel();
		this.initSkinsPanel();
	},
	
	/**
	 * skin�����б�, ��Ŀ�л�
	 */
	initCatsPanel: function() {
		var bodies = $('div.skins-list-body', this.div),
			catsPanel = $('ul.skins-cats', this.div);
		new PagingSwitcher('a[data-paging]', bodies, {
			delegate: catsPanel
		});
	},
	
	/**
	 * DIY skin����
	 */
	initSkinsPanel: function() {
		var self = this,
			panel = $('div.skins-list', this.div),
			lis = $('li', panel),
			group = this.getSkinsGroup(lis);
		
		panel.delegate('li', 'click', function() {
			var elm = $(this),
				config = elm.data('skin');
			if (!config) {
				return;
			}
			
			lis.removeClass('selected');
			$(group[config.cid]).addClass('selected');
			self.applySkin(config);
			
			return false;
		});
	},
	
	/**
	 * ������Ƥ���б��cid����, �Ա��ͬһcid������в���
	 * @return {
	 * 	cid1: [li1, li7],
	 *  cid2: [li3, li9]
	 * }
	 */
	getSkinsGroup: function(lis) {
		var group = {};
		lis.each(function() {
			var config = $(this).data('skin'),
				cid = null;
			if (config) {
				cid = config.cid;
				group[cid] = group[cid] || [];
				group[cid].push(this);
			}
		});
		return group;
	},
	
	/**
	 * ����skin
	 * @param {object} skin
	 */
	applySkin: function(skin) {
		var link = $('#skin-link'),
			last = link.attr('href'),
			url = this.config.applySkinUrl,
			action = null;
			
		if (last === skin.url) {
			return;
		}
		
		link.attr('href', skin.url);
		
		action = function() {
			Diy.authAjax(url, {
				type: 'POST',
				dataType: 'json',
				data: { 
					cid: skin.cid,
					_csrf_token: $('#doc').data('doc-config')._csrf_token
				},
				success: function(ret) {
					if (ret.success) {
						$(window).trigger('diychanged', { type: 'apply-skin' });
						Msg.info('���ѡ��ɹ�');
					} else {
						link.attr('href', last);
						Msg.error('���ѡ��ʧ�ܣ���ˢ�º����ԡ�');
					}
				}
			});
		};
		
		Util.schedule('apply-skin', action);
	}
	
};
//~ DiySkins
	
WP.SettingContext.register('diy-skins', DiySkins, { configField: 'skinsConfig'} );

})(jQuery, Platform.winport);
//~ 

