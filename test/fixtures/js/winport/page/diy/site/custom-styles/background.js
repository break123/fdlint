/**
 * @fileoverview �����Զ�����--����
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	UI = WP.UI,
	
	Msg = WP.diy.Msg,
	Component = WP.diy.Component,
	ImageUpload = WP.diy.ImageUpload,
	
	Parts = WP.diy.site.CustomStyles.Parts;
	
	
Parts.Background = {
	
	init: function() {
		this.panel = $('li.custom-styles-background', this.div);
		
		this.subject = 'contentBackground';
		
		this.styleConfig = this.getStyleConfig(this.subject, true);
		this.styleJson = this.styleConfig.styleJson;
		
		this.initMode();
		this.initModeCustom();
	},
	
	/**
	 * ��ʼ������ģʽѡ��
	 */
	initMode: function() {
		var radios = $('dl.mode-tabs input[name="background-mode"]', this.panel);
		this.initModeTabs(radios);
		this.initModeStyle(radios);
	},
	
	/**
	 * ����ģʽ�л�tabs
	 * @param {Object} radios
	 */
	initModeTabs: function(radios) {
		var bodies = $('ul.mod-bodies>li', this.panel),
			selectedIndex = this.styleConfig.isEnable ? 0 : 1;
		
		radios.click(function() {
			var index = radios.index(this);
			bodies.removeClass('selected');
			bodies.eq(index).addClass('selected');
		});
		radios.eq(selectedIndex).click();
	},
	
	/**
	 * ����ģʽ�л���ʽ����
	 */
	initModeStyle: function(radios) {
		var self = this;
		radios.click(function() {
			var index = radios.index(this),
				style = index === 0 ? 'transparent' : false;
				
			self.styleConfig.isEnable = index === 0;
			self.CssParser.setStyle(self.styleJson, '#winport-content', 'background', style);
			self.updateStyleConfig(self.subject);
		});
	},
	
	/**
	 * ��ʼ���Զ��屳������
	 */
	initModeCustom: function() {
		this.customDiv = $('li.mode-custom', this.panel);
		this.initBkColor();
		this.initBkImage();
		this.initBkRepeat();
		this.initBkPosition();
	},
	
	/**
	 * ��ʼ������ɫ����
	 */
	initBkColor: function() {
		var self = this,
			picker = $('dl.bk-color a.widget-color-picker', this.customDiv),
			input = $('input.value', picker),
			style = this.getStyle('background-color', '#FFFFFF');
		
		input.val(style.value);
		UI.colorPicker(picker);
		
		picker.bind('select', function(e, data) {
			var color = data.color;
			self.updateStyle('background-color', color);
		});
	},
	
	/**
	 * ��ʼ������ͼ
	 */
	initBkImage: function() {
		var self = this,
			panel = $('dl.bk-image', this.customDiv),
			
			preview = $('div.preview', panel),
			input = $('input.path', preview),
			style = this.getStyle('background-image', 'none'),
			imgUrl = this.CssParser.getBkImgUrl(style.value);
			
			config = this.getUploadConfig();
		
		config.onUpload = function(path) {
			UI.resizeImage($('img', preview), 80);
			self.updateStyle('background-image', 'url(' + path + ')');
			self.showImagePropsPanel(true);
		};
		config.onRemove = function() {
			self.updateStyle('background-image', 'none');
			self.showImagePropsPanel(false);
		};
		
		imgUrl && input.val(imgUrl);
		this.showImagePropsPanel(imgUrl);
		
		new ImageUpload(panel, config);
		UI.resizeImage($('img', preview), 80);
	},
	
	getUploadConfig: function(preview) {
		var self = this,
			docCfg = Component.getDocConfig();
			
		return {
			_csrf_token: docCfg._csrf_token,
			imageUploadUrl: this.config.imageUploadUrl,
			uid: docCfg.uid,
			noScale: true
		};
	},
	
	showImagePropsPanel: function(show) {
		var div = $('dl.bk-repeat,dl.bk-position', this.customDiv);
		div.css('display', show ? 'block' : 'none');
	},
	
	/**
	 * ��ʼ������ƽ�̷�ʽ
	 */
	initBkRepeat: function() {
		var self = this,
			select = $('dl.bk-repeat select', this.customDiv),
			style = this.getStyle('background-repeat', 'repeat');
			
		select.val(style.value);
		
		select.change(function() {
			self.updateStyle('background-repeat', $(this).val());
		});
	},
	
	/**
	 * ��ʼ�����뷽ʽ
	 */
	initBkPosition: function() {
		var self = this,
			inputs = $('dl.bk-position input', this.customDiv),
			style = this.getStyle('background-position', 'left top'),
			value = style.value;
		
		inputs.filter(function() {
			return $(this).data('value') === value;
		}).addClass('checked');
		
		inputs.click(function() {
			var input = $(this);
				
			inputs.removeClass('checked');
			input.addClass('checked');
			
			self.updateStyle('background-position', input.data('value'));
		});
	},
	
	/**
	 * ȡ�ñ�����ʽ
	 * @param {string} property
	 * @param {string} defaultValue Ĭ��ֵ
	 * @return {object} 
	 * 		- property
	 * 		- value
	 */
	getStyle: function(property, defaultValue) {
		var style = this.CssParser.getStyle(this.styleJson, '.content-wrap', property);
		if (!style && defaultValue) {
			style = this.CssParser.setStyle(this.styleJson, '.content-wrap', property, defaultValue);
		}
		return style;
	},
	
	/**
	 * ������ʽ
	 * @param {boolean} noUpdate �Ƿ���������ݽṹ, ������ҳ��
	 */
	updateStyle: function(property, value, noUpdate) {
		this.CssParser.setStyle(this.styleJson, '.content-wrap', property, value);
		this.updateStyleConfig(this.subject);
	}
	
};
//~

	
})(jQuery, Platform.winport);
