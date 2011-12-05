/**
 * @fileoverview ������Ŀҳ-��˾����
 * 
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	UI = WP.UI,
	Tabs = WP.widget.Tabs;

var CompanyInfo = {
	
	init: function(div, config) {
		this.div = div;
		this.config = config;
		
		this.initBrief();
		this.initSatRemarkCount();
		this.initVideo();
		this.initEquip();
	},
	
	/**
	 * ��ʼ��������Ϣ
	 *  ���Ź�˾ͼƬ
	 *  ����ж���, ��ʼ���ֲ�
	 */
	initBrief: function() {
		var infoImg = $('div.info-brief div.info-image', this.div);

		UI.resizeImage($('img', infoImg), 300);
		this.initImagePaging(infoImg);
	},

	/**
	 * ��ʼ����˾ͼƬ�ֲ�
	 */
	initImagePaging: function(infoImg) {
		var imgUl = $('ul.info-image-list', infoImg),
			imgList = $('li', imgUl),
			pagingList = [],
			li = '';

		if (imgList.length <= 1) {
			return;
		}

		for (var i = 0, c = imgList.length; i < c; i++) {
			li = $.util.substitute('<li><a href="#">{0}</a></li>', [i + 1]);
			pagingList.push(li);
		}
		infoImg.append('<ul class="tabs-nav">' + pagingList.join('\n') + '</ul>');

		imgList.hide();
		pagingList = $('ul.tabs-nav li', infoImg);
		autoSwitch = { hoverStop: infoImg };
		new Tabs(pagingList, imgList, { autoSwitch: autoSwitch });
	},
	

	/**
	 * ��ʼ����ϸ��Ϣ������
	 */
	initSatRemarkCount: function() {
		var url = this.config.satisfactionRateUrl,
			td = $('td.satisfaction-remark-count:first', this.div);
			
		if (!url || !td.length) {
			return;
		}
		
		$.ajax(url, {
			data: { memberId: WP.Component.getDocConfig().uid },
			dataType: 'jsonp',
			success: function(ret) {
				if (!ret.success) {
					return;
				}
				var remarkCount = (ret.data || {}).remarkCount;
				remarkCount !== undefined && td.text(remarkCount + ' ��');
			}
		});
	},
	
	/**
	 * ��ʼ����˾��Ƶ
	 */
	initVideo: function() {
		var panel = $('div.video-panel', this.div),
			url = this.config.companyVideoUrl,
			site = this.config.companyVideoSite,
			player = null;
			
		if (!panel || !url || !site) {
			return;
		}
		
		player = this.Video[site];
		if (player) {
			player(panel, url, this.config);
		} else {
			$.error('player for ' + site + ' not exists');
		}
	},
	
	/**
	 * ��ʼ����˾�豸
	 */
	initEquip: function() {
		var self = this,
			equip = $('div.info-equip', this.div),
			imgs = $('div.image img', equip);
			
		UI.resizeImage(imgs, 110);
	
		equip.delegate('div.image a,div.name a', 'click', function(e) {
		  	e.preventDefault();
			self.showEquipDetail(this);
		});
	},
	
	/**
	 * չʾ�豸��ϸ��Ϣ
	 */
	showEquipDetail: function(link) {
		var li = $(link).closest('li'),
			content = $('textarea.html-template', li).val();
		$.use('wp-dialog', function() {
			var Dialog = WP.widget.Dialog;
			Dialog.open({
				className: 'equip-detail-dialog',
				header: '��ϸ��Ϣ',
				content: content
			});
		});
	}
};

/**
 * ��˾��Ƶ���ŷ�ʽ
 */
CompanyInfo.Video = {
	/**
	 * ������
	 */
	tudou: function(panel, url) {
		$.use('ui-flash', function() {
			panel.flash({
				swf: 'http://marketing.tudou.com/alibaba/SPlayerStandard.swf',
				width: 480,
				height: 388,
				allowFullScreen: true,
	            flashvars: {
	                playList: url,
					autoPlay: false
	            }
			});
		});
	},
	
	/**
	 * ��6
	 */
	ku6: function(panel, url) {
		$.use('ui-flash', function() {
			panel.flash({
				swf: url,
				width: 480,
				height: 404,
				allowFullScreen: true,
				flashvars: {
					color: 'A01313',
					jump: 0,
					fu: 1,
					deflogo: 0,
					adss: 0,
					adj: 0,
					recommend: 0,
					bv: 0,
					pv: 0
				}
			});
		});
	}
};


WP.ModContext.register('wp-company-info-column', CompanyInfo);	

})(jQuery, Platform.winport);
