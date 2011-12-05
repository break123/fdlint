/**
 * @fileoverview DIY��̨�������߼�
 * 
 * @author long.fangl
 */
(function($, WP) {
	
var Msg = WP.diy.Msg;

var SpecialLogic = {
	init: function(){
		this.fixIE6Background();
		this.cancelTopNavShim();
		this.showPageSwitchTip();
		this.resetEmptyMod();
		this.handlePositionFixed();
	},
	
	fixIE6Background: function() {
		if ($.util.ua.ie6) {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			} catch (e) {
				// ignore
			}
		}
	},
	
	/**
	 * �������Ҫȥ����������shim
	 */
	cancelTopNavShim: function() {
		var box = $('div.wp-top-nav').closest('div.mod-box');
		$('div.box-shim', box).remove();

		box.bind('reloaded', function() {
			$('div.box-shim', box).remove();
		});
	},
	
	/**
	 * �л�װ��ҳ����ʾ
	 */
	showPageSwitchTip: function() {
		var docCfg = $('#doc').data('doc-config'),
			contentCfg = $('#content').data('content-config'),
			showTip = docCfg.showPageSwitchTip,
			pageName = contentCfg.pageName;
			
		if (showTip) {
			Msg.info($.util.substitute('�ѽ���{0}', [pageName]));
		} else if (pageName === '��ҳ') {
			Msg.info('��ӭ���밢��Ͱ�����װ��ƽ̨');
		}
	},
	
	/**
	 * ���ں�˼���ԭ��, �п��ܻ���ֿյ�box, ���Ӱ����ק���߼�, ���ԶԴ˽������⴦��
	 */
	resetEmptyMod :  function() {
		$('div.mod-box').each(function() {
			var box = $(this);
			if ($('div.mod', box).length === 0) {
				(box.data('box-config') || {}).movable = false;
				box.hide();
			}
		});
	},
	
	/**
	 * �������ʱ������ҳ��仯����Ҫ����scroll�¼�
	 * ����UI.fixedPosition��������
	 * 1. ����setting bar
	 * 2. ����ģʽ��Ť
	 */
	handlePositionFixed: function() {
		var win = $(window);
		$('div.mod-box').live('reloaded', function() {
			win.triggerHandler('position-fixed');
		});

		win.bind('diychanged', function(e, data) {
			data.type === 'del-box' && win.triggerHandler('position-fixed');
		});
	}
};

WP.PageContext.register('~DiySpecialLogic', SpecialLogic);

})(jQuery, Platform.winport);
