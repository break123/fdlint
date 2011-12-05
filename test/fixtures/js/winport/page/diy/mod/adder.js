/**
 * @fileoverview ��Ӱ����Ⱦ�߼�
 * 1. region�ײ���Ӱ�Ť
 * 2. �������Ӱ�Ť
 * 
 * @author long.fanl
 */
(function($, WP){
	

var Util = WP.Util,
	ModListDialog = WP.diy.ModListDialog;


var BoxAdder = {
	
	init: function() {
		// Ŀǰҵ��ֻ����������winport-content������Ӱ��
		this.regions = $('#winport-content div.region'); 
		this.boxes = $('div.mod-box', this.regions);
		
		this.initBoxRegionAdder();
		this.initBoxFlyAdder();

		this.handleAdderEvent();
		this.handleNearestBoxHover();
	},
	
	/**
	 * ����region�ײ���Ӱ�Ť
	 */
	initBoxRegionAdder: function() {
		var self = this,
		adder = $('div.box-adder', this.regions);

		adder.hover(function() {
			$(this).addClass('box-adder-hover');
		}, function(){
			$(this).removeClass('box-adder-hover');
		});
	},
	
	
	/**
	 * �������������Ӱ�Ť
	 */
	initBoxFlyAdder: function() {
		var self = this;
		this.boxes.live('mouseenter', function(){
			var box = $(this);
			Util.schedule('nearest-box-hover', function() {
				self.doBoxHover(box);
			}, 10);
		});
		
		this.boxes.live('movestart', $.proxy(this, 'hideFlyAdder'));
	},
	
	doBoxHover: function(box) {
		if (this.lastHoverBox && this.lastHoverBox[0] === box[0]) {
			return;
		}
		var config = box.data('box-config');
		this.hideFlyAdder();
		// �������϶�ʱ���ܻ�clone��mod-box�ڵ�, ������Ҫ�ж�config�Ƿ�Ϊ��
		if (config && config.movable) {
			box.addClass('mod-box-movable');
			this.lastHoverBox = box;
		}
	},
	
	hideFlyAdder: function() {
		this.lastHoverBox && this.lastHoverBox.removeClass('mod-box-movable');
		this.lastHoverBox = null;
	},

	handleAdderEvent: function() {
		var self = this,
			content = $('#content');
			
		// region���·�����Ӱ��
		$('div.box-adder', content).live('click', function(e) {
			e.preventDefault();

			var region = $(this).closest('div.region');
			new ModListDialog(region);	
		});
		
		// ����Աߵ����
		$('a.box-fly-adder', content).live('click', function(e) {
			e.preventDefault();

			var elm = $(this),
				region = elm.closest('div.region'),
				index = elm.closest('div.mod-box').index();
			
			new ModListDialog(region, index); 
		});
	},

	/**
	 * ����������ط��ƶ�����Ҫ�������box���mod-box-hover��
	 */
	handleNearestBoxHover: function() {
		var self = this,
			doc = $('#doc')[0],
			body = $('body')[0],
			elm = $('div.content-wrap:first')[0];
		$(document).mousemove(function(e) {
			var target = e.target,
				action = null;
			if (target === elm || target === doc || target === body) {
				action = function() {
					var box = self.getNearestBox(e.pageX, e.pageY);
					box && self.doBoxHover(box);
				};
				Util.schedule('nearest-box-hover', action, 10);
			}
		});
	},
	
	/**
	 * ȡ����(x, y)����Ŀ��ƶ�box
	 */
	getNearestBox: function(x, y) {
		var result = null,
			spanX = Number.MAX_VALUE,
			spanY = Number.MAX_VALUE,
			boxes = null;
		
		boxes = $('div.mod-box', this.regions).filter(function() {
			var config = $(this).data('box-config');
			return config && config.movable;
		});
		
		boxes.each(function() {
			var box = $(this),
				offset = box.offset(),
				bx = offset.left + box.width() / 2,
				by = offset.top,
				sx = Math.round(Math.abs(bx - x)),
				sy = Math.round(Math.abs(by - y));
				
			if (sx < spanX ||
					Math.abs(sx - spanX) < 10 && sy < spanY) {
				spanX = sx;
				spanY = sy;
				result = box;
			}
		});
		
		return result;
	}
};

WP.PageContext.register('~BoxAdder', BoxAdder);
	
})(jQuery, Platform.winport);
