/**
 * @fileoverview �����Զ�����--����
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	Msg = WP.diy.Msg,
	Diy = WP.diy.Diy,
	Parts = WP.diy.site.CustomStyles.Parts;

Parts.Layout = {
	
	init: function() {
		this.panel = $('li.custom-styles-layout', this.div);
		
		// �����б�
		this.ul = $('div.setting-node-content>ul', this.panel);
		this.lis = $('li', this.ul);
		
		// ��ǰѡ�еĲ���li(�ͺ��ͬ��), �������ύ�ɹ������
		this.lastLi = $('li.selected', this.ul);
		
		this.layout = $('div.layout.p32-s5m0,div.layout.p32-m0s5', '#winport-content');
		this.layoutData = this.layout.closest('div.layout-box').data('box-config') || {};
		
		// ȫ��������Ϣ
		this.docCfg = $('#doc').data('doc-config');
		this.contentCfg = $('#content').data('content-config');
		
		this.handleEvents();
	},
	
	/**
	 * �������л��¼�
	 */
	handleEvents: function() {
		var self = this;
			
		this.lis.click(function(e) {
			e.preventDefault();
			
			// �������ύ������, ���������л�����
			if (self.running) {
				return;
			}
			
			var li = $(this),
				data = li.data('layout');
			
			// ��ǰΪѡ����, �򲻴���
			if (li.hasClass('selected')) {
				return;
			}
			
			self.changeLayout(li, data);
			self.updateLayout(li, data);
		});
	},
	
	/**
	 * �л�(��Ⱦ)ҳ�沼��
	 */
	changeLayout: function(li, data) {
		var selectedLi = $('li.selected', this.ul),
			selectedClass = selectedLi.data('layout').classname;
		
		// �л�tab
		this.lis.removeClass('selected');
		li.addClass('selected');
		
		// �л�����
		this.layout.addClass(data.classname).removeClass(selectedClass);
	},
	
	/**
	 * ���·���˲�����Ϣ
	 */
	updateLayout: function(li, data) {
		var self = this,
			action = null,
			url = this.config.customizeLayoutUrl;
		
		action = function() {
			// ���ٲ���Ҫ�ĸ�������
			if (li[0] === self.lastLi[0]) {
				return;
			}
			
			self.running = true;
			
			Diy.authAjax(url, {
				type: 'POST',
				data: self.wrapUpdateData(data.cid),
				dataType: 'json',
				success: function(ret) {
					self.updateSuccess(ret, li, data);
				},
				error: function() {
					self.restoreLayout(li, data);
				},
				complete: function() {
					self.running = false;
				}
			});
		};
		
		Util.schedule('style-layout', action);
	},
	
	wrapUpdateData: function(cid) {
		return {
			layoutCid: cid,
			_csrf_token: this.docCfg._csrf_token,
			version: this.contentCfg.version,
			pageSid: this.contentCfg.sid
		};
	},
	
	updateSuccess: function(ret, li, data) {
		++(this.contentCfg.version);
		
		if (ret.success) {
			this.lastLi = li;
			// ��Ҫ����mod-box data-box-config����
			this.layoutData.cid = data.cid;
			
			$(window).trigger('diychanged', { type: 'custom-style-layout' });
			Msg.info('���ְ�ʽ���óɹ�');
		} else if (ret.data === 'VERSION_EXPIRED') {
			window.location.reload();
		} else {
			this.restoreLayout(li, data);
			Msg.error('���ְ�ʽ����ʧ��');
		}
	},
	
	/**
	 * ����ʧ��ʱ, �ָ�ҳ�沼��
	 */
	restoreLayout: function(li, data){
		var lastClass = this.lastLi.data('layout').classname;
		
		this.lis.removeClass('selected');
		this.lastLi.addClass('selected');
		
		this.layout.addClass(lastClass).removeClass(data.classname);
	}

};

	
})(jQuery, Platform.winport);
