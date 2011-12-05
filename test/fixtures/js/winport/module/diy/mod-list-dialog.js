/**
 * ��Ӱ��Ի���
 * @author qijun.weiqj
 */
(function($, WP) {


var ModContext = WP.ModContext,
	Dialog = WP.widget.Dialog,
	Tabs = WP.widget.Tabs,
	ModBox = WP.diy.ModBox,
	Msg = WP.diy.Msg,
	Component = WP.diy.Component;


var ModListDialog = new WP.Class({

	/**
	 * �򿪰���б����
	 * @param {element} region
	 * @param {number} index �°����ӵ�λ��
	 * 		- false, undefined, -1 ��ӵ�region���
	 * 		- {number} ��ӵ�ָ��λ��
	 * @param {object} options
	 */
	init: function(region, index, options) {
		region = $(region).eq(0);

		this.insertRegion = region;
		this.insertIndex = (index === false || index === undefined || index === -1) ? 
				$('div.mod-box', region).length : index;
		this.options = options || {};
		
		this.contentCfg = Component.getContentConfig(); 

		this.open(region, index);
	},

	open: function(region, index) {
		var self = this,
			url = this.contentCfg.listWidgetUrl;
			
		this.dialog = new Dialog({
			className: 'mod-list-dialog',
			header: '��Ӱ��',
			hasFooter: false,
			draggable: true,
			contentUrl: url,
			contentParams: this.getRequestData(region),
			contentSuccess: function(dialog) {
				self.panel = $('div.mod-list-panel', dialog.element);
				self.initTabs();
				self.initStatus();
				self.handleAddMod();
				self.options.success && self.options.success(dialog);
			}
		});
	},
	
	/**
	 * ȡ���������, �����ط�ʹ�ô˷���
	 * 1. ��ȡ��鼯
	 * 2. ��Ӱ��
	 */
	getRequestData: function(region) {
		var layoutCfg = region.closest('div.layout-box').data('boxConfig');
		
		return {
			pageCid: this.contentCfg.cid,
			pageSid: this.contentCfg.sid,
			segment: region.closest('div.segment').data('segmentConfig').cid,
			layoutCid: layoutCfg.cid,
			layoutSid: layoutCfg.sid,
			region: region.data('regionConfig').cid,
			_csrf_token: Component.getDocConfig()._csrf_token
		};
	},
	
	/**
	 * ��ʼ�������tabs
	 */
	initTabs: function() {
		var tabs = $('ul.mod-tabs li', this.panel),
			groups = $('div.mod-list-group', this.panel);
			
		groups.hide();
		new Tabs(tabs, groups);

		groups.each(function() {
			var group = $(this),
				groupTabs = $('ul.group-tabs li', group),
				groupBodies = $('div.group-body ul.mod-list', group);

			groupBodies.hide();
			new Tabs(groupTabs, groupBodies);
		});
	},
	
	/**
	 * ��ʼ�����״̬
	 */
	initStatus: function() {
		var self = this,
			map = this.getBoxConfigMap(),
			regionMap = this.getRegionBoxConfigMap(),
			lis = $('ul.mod-list li', this.panel);
		
		lis.each(function() {
			var li = $(this),
				cid = $(this).data('addConfig').cid,
				item = map[cid],
				config = null;
			
			// ����ð����ҳ������Ӳ����ڵ�ǰregion��singleton
			// ���������Ѵﵽ�������
			// ���������
			if (item && (config = item.config)) {
				if (regionMap[cid] && config.singletonInRegion ||
						config.maxCount > 0 && config.maxCount <= item.count) {
					li.addClass('status-added');
					return;
				}
			}
		});
	},
	//~ initStatus
	
	/**
	 * ȡ��ҳ��������ӳ���
	 * @return {
	 * 	cid1: { count: 1, config:.. },
	 *  cid2: { count: 2, config:.. }
	 * }
	 */
	getBoxConfigMap: function() {
		var map = {};
			boxes = $('#content div.mod-box');
		boxes.each(function() {
			var config = $(this).data('boxConfig'),
				cid = config.cid,
				item = null;
			item = map[cid] = map[cid] || { config: config };
			item.count = (item.count || 0) + 1;
		});
		return map;
	},
	
	/**
	 * ȡ�õ�ǰregion�а������ӳ���
	 * @return {
	 * 	cid1: true,
	 *  cid2: true
	 * }
	 */
	getRegionBoxConfigMap: function() {
		var region = this.insertRegion,
			boxes = $('div.mod-box', region),
			map = {};
		boxes.each(function() {
			var config = $(this).data('boxConfig');
			map[config.cid] = true;
		});
		return map;
	},
	
	/**
	 * ��������¼�
	 */
	handleAddMod: function() {
		var self = this;
		this.panel.delegate('a.add-mod', 'click', function(e) {
			e.preventDefault();
			
			var li = $(this).closest('li'),
				config = li.data('addConfig');
			
			if (self.panel.data('running') || li.hasClass('running')) {
				return;
			}
			
			self.panel.data('running', true);
			li.addClass('running');

			ModBox.add({
				cid: config.cid,
				region: self.insertRegion, 
				index: self.insertIndex,
				success: function() {
					Msg.info('��Ӱ��ɹ�');
					self.dialog.close();
				},
				error: function(message) {
					self.panel.data('running', false);
					li.removeClass('running');
					Msg.error(message);
				}	
			});
		});
	}

});

WP.diy.ModListDialog = ModListDialog;

})(jQuery, Platform.winport);
