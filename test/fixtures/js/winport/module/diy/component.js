/**
 * @fileoverview ���̲�����ع�������
 * 
 * @author long.fanl
 */
(function($,WP){
	
var Component = $.extendIf({
	
	/**
	 * ��ȡҳ�沼�ֽṹ, page -> segment-> layout-> region-> widget
	 * ÿ�����ֻ��Ҫcid�Ϳ�ѡ��sid����
	 */
	getPageLayout: function() {
		var self = this,
			page = $('#content'),
			pageLayout = this._getData(page, 'contentConfig', pageVisit);
			
		return JSON.stringify(pageLayout[0]);
		
		
		function pageVisit(page, data) {
			var segments = $('div.segment', page);
			data.segments = self._getData(segments, 'segmentConfig', segmentVisit);
		}
		
		function segmentVisit(segment, data) {
			var layouts = $('div.layout-box', segment);
			data.layouts = self._getData(layouts, 'boxConfig', layoutVisit);
		}
		
		function layoutVisit(layout, data) {
			var regions = $('div.region', layout);
			data.regions = self._getData(regions, 'regionConfig', regionVisit);
		}
		
		function regionVisit(region, data) {
			var mods = $("div.mod-box:not(.ui-portlets-placeholder)", region);
			data.widgets = self._getData(mods, 'boxConfig');
		}
	},

	_getData: function(components, configField, visit) {
		var result = [];
		components.each(function() {
			var elm = $(this),
				config = elm.data(configField),
				data = {};
				
			config.cid !== undefined && (data.cid = config.cid);
			config.sid !== undefined && (data.sid = config.sid);
			
			visit && visit(elm, data);
			
			result.push(data);
		});
		return result;
	},

	/**
	 * region��ص�post������Ҫ�ύ���²���
	 */
	getRegionPostData: function(region) {
		var contentCfg = this.getContentConfig(),
			layoutCfg = region.closest('div.layout-box').data('boxConfig');
		
		return {
			pageCid: contentCfg.cid,
			pageSid: contentCfg.sid,
			segment: region.closest('div.segment').data('segmentConfig').cid,
			layoutCid: layoutCfg.cid,
			layoutSid: layoutCfg.sid,
			region: region.data('regionConfig').cid,
			_csrf_token: this.getDocConfig()._csrf_token
		};
	}

}, WP.Component);

WP.diy.Component = Component;

})(jQuery,Platform.winport);
