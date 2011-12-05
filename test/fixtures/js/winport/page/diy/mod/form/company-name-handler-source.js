/**
 * @fileoverview �������Ʊ༭�Ի�������
 *
 * @author qijun.weiqj
 */
(function($, WP){
	
var Msg = WP.diy.Msg,
	Util = WP.Util,
	UI = WP.UI,
	Tabs = WP.widget.Tabs,
	FormUtil = WP.widget.FormUtil,
	Diy = WP.diy.Diy,
	ImageUpload = WP.diy.ImageUpload,
	ModBox = WP.diy.ModBox,
	BaseHandler = WP.diy.form.BaseHandler;


/**
 * ��ͨ����Handler
 */
var DefaultCompanyNameHandler = $.extendIf({
	
	/**
	 * ��ʼ��, ��FormDialog�Զ�����
	 */
	init: function() {
		BaseHandler.init.apply(this, arguments);

		this.mod = $('div.default-sub-mod', this.box).eq(0);
		
		// ��ǰ������(�ύʧ��, ��ȡ��ʱ��Ҫʹ��)
		this.lastData = this._getData();
		
		this.docCfg = $('#doc').data('doc-config');
		
		this.name = 'CompanyNameHandler';
		Util.initParts(this);
	},

	getFormConfig: function(box) {
		return { width: '800px', height: '212px', centerFooter: true };
	},
	
	_afterSubmit: function(ret) {
		if (ret.success) {
			this.dialog.close();
			Msg.info('�������Ƴɹ�');
		} else {
			Msg.error("��������ʧ��");
		}
	},

	
	/**
	 * ȡ������, ��FormDialog�Զ�����
	 */
	cancel: function() {
		var data = this.lastData;
		$('input.path', this.part).val(data.bgImgPath);
		this.updateMod(data);
	},
	
	/**
	 * ȡ��ҳ�������
	 */
	_getData: function() {
		var data = FormUtil.getFormData(this.form),
			check = $('input.topbanner-custom', this.form);
			
		data.isUseCustomTopBanner = check.prop('checked');

		return data;
	},

	_getFormData: function() {
		var data = this._getData();
		return this._wrapSubmitData(data);
	},
	
	/**
	 * �ύ����̨ʱ��Ҫ��getData���ص����ݽ��д���
	 *  - ͼƬurlȥhost
	 */
	_wrapSubmitData: function(data) {
		var pattern = /^http:\/\/[^\/]+\//;
		data.bgImgPath = data.bgImgPath.replace(pattern, '');
		data.logoImgPath = data.logoImgPath.replace(pattern, '');
		return data;
	},
	
	/**
	 * ����������ʽ, ���������б仯ʱ����
	 * @param {object} data ��ʽ����
	 */
	updateMod: function(data) {
		data = data || this._getData();
		
		$.log(data);
		
		var mod = this.mod,
			logo = $('div.logo a', mod),
			logoImg = $('img', logo),
			chinaname = $('a.chinaname', mod),
			enname = $('a.enname', mod),
			
			bkImg = data.isUseCustomTopBanner && data.bgImgPath ? 
					'url(' + data.bgImgPath + ')' : '';
		
		// �����������¼�
		this.mod.triggerHandler('updatemod', data);
		
		
		// ���Ʊ���ɫ/����ͼƬ
		mod.css({
			'background-image': bkImg,
			'background-repeat': bkImg ? 'repeat' : ''
		});
		
		// LOGO
		if (!logoImg.length) {
			logoImg = $('<img />').appendTo(logo);
		}
		if (data.logoImgPath) {
			logoImg.attr('src', data.logoImgPath).show();
			UI.resizeImage(logoImg, 80);
		} else {
			logoImg.hide();
		}
		
		// ����������ʽ
		chinaname.toggleClass('hidden', !data.isShowCompanyNameCn);
		chinaname.css({
			'color': data.companyNameCnFontColor,
			'font-family': data.companyNameCnFontFamily,
			'font-size': data.companyNameCnFontSize,
			'font-weight': data.isCompanyNameCnFontBold ? 'bold' : 'normal',
			'font-style': data.isCompanyNameCnFontItalic ? 'italic' : 'normal'
		});
		
		
		// Ӣ������
		enname.toggleClass('hidden', !data.isShowCompanyNameEn);
		enname.css({
			'color': data.companyNameEnFontColor,
			'font-family': data.companyNameEnFontFamily,
			'font-size': data.companyNameEnFontSize,
			'font-weight': data.isCompanyNameEnFontBold ? 'bold' : 'normal',
			'font-style': data.isCompanyNameEnFontItalic ? 'italic' : 'normal'
		});
	},
	//~ updateMod
	
	
	/**
	 * �ϴ��ļ�ʱ, ��Ҫ��װ�Ĺ�������
	 */
	wrapUploadConfig: function(config) {
		return $.extend(config, {
			_csrf_token: this.docCfg._csrf_token,
			imageUploadUrl: this.config.imageUploadUrl,
			uid: this.docCfg.uid
		});
	}

}, BaseHandler);
//~ CompanyNameHandler


var Parts = (DefaultCompanyNameHandler.Parts = {});


/**
 * ���Ʊ����༭����
 */
Parts.TopbarPart = {
	
	init: function() {
		this.part = $('div.topbanner-part', this.form);
		this.initTabs();
		this.initImageUpload();
		this.handleUpdateMod();
	},
	
	/**
	 * ��ʼ������ͼƬ����Tabs
	 */
	initTabs: function() {
		var self = this,
			tabs = $('ul.topbanner-tabs :radio', this.part),
			bodies = $('ul.topbanner-bodies li', this.part);
			
		tabs.click(function() {
			var index = tabs.index(this);
			bodies.removeClass('selected').eq(index).addClass('selected');
			self.updateMod();
		});
		
		tabs.filter(':checked').click();
	},
	
	/**
	 * ��ʼ��ͼƬ�ϴ�flash���
	 */
	initImageUpload: function() {
		var self = this,
			preview = $('div.preview', this.part);
		config = this.wrapUploadConfig({
			onUpload: function() {
				UI.resizeImage($('img', preview), { width: 360, height: 68 });
				self.updateMod();
				self.dialog.node.trigger('topbanner-upload');
			}
		});
		
		new ImageUpload(this.part, config);
		UI.resizeImage($('img', preview), { width: 360, height: 68 });
	},
	
	
	/**
	 * ����ͼƬ�б䶯ʱ, ��Ҫ�������ư��ĸ߶�
	 * @param {string} custom �Ƿ�ʹ���Զ�������ͼƬ
	 */
	refreshBannerHeight: function(custom) {
		
		var self = this,
			heightInput = $('input.banner-height', this.part),
			path = $('input.path', this.part).val(),
			img = null;
			
		if (!custom) {
			this.mod.css('height', '');
			heightInput.val('');
			return;
		}
		
		if (!path) {
			return;
		}

		img = new Image();
		img.onload = function() {
			img.onload = null;	// �޸�ie7�¿��ܻᴥ�����onload�¼� QC 24065
			var height = self.calcBannerHeight(this.height);
			self.mod.css('height', height);
			heightInput.val(height);
		};
		img.src = path;
	},
	
	/**
	 * ��ͼƬ�߶� < minHeightʱ, ���Ƹ߶�Ϊ minHeight
	 * ��ͼƬ�߶� > maxHeightʱ, ���Ƹ߶�ΪmaxHeight
	 * �������, ���ư��߶�ΪͼƬ�߶�
	 */
	calcBannerHeight: function(h) {
		var minHeight = 90,
			maxHeight = 200;
		return h < minHeight ? '' :	// ��ͼƬ�߶� < minHeightʱ, ���Ƹ߶�Ϊ minHeight
				h > maxHeight ? maxHeight + 'px' : // ��ͼƬ�߶� > maxHeightʱ, ���Ƹ߶�ΪmaxHeight
				h + 'px';	// �������, ���ư��߶�ΪͼƬ�߶�
	},
	
	/**
	 * ���°��ʱ, ��Ҫ��������������Ƹ߶�
	 */
	handleUpdateMod: function() {
		var self = this;
		this.mod.unbind('updatemod.refreshbanner');
		this.mod.bind('updatemod.refreshbanner', function(e, data) {
			self.refreshBannerHeight(data.isUseCustomTopBanner);
		});
	}
};
//~ TopbarPart 


/**
 * ��˾LOGO�����Ʊ༭����
 */
Parts.NamePart = {
	
	init: function() {
		this.part = $('div.company-name-part', this.form);
		this.initNamePart();
		this.initImageUpload();
	},
		
	/**
	 * ��ʼ��ͼƬ�ϴ�flash���
	 */
	initImageUpload: function() {
		var self = this,
			logoPart = $('div.logo-part', this.part),
			preview = $('div.preview', logoPart);

		config = this.wrapUploadConfig({
			onUpload: function() {
				var img = $('img', logoPart);
				UI.resizeImage($('img', preview), 80);
				self.updateMod();
				self.dialog.node.trigger('logo-upload');
			},
			
			onRemove: function() {
				self.updateMod();
				self.dialog.node.trigger('logo-remove');
			}
		});
		
		new ImageUpload(logoPart, config);
		UI.resizeImage($('img', preview), 80);
	},
	
	/**
	 * ��ʼ��������Ӣ�ı༭
	 */
	initNamePart: function() {
		var namePart = $('div.name-part', this.part);
		this.initColorPicker(namePart);
		this.initNamePartSetting(namePart);
		this.initNamePartUpdate(namePart);
		
	},
	
	/**
	 * ��ʼ����ɫѡȡ��
	 */
	initColorPicker: function(part) {
		var self = this,
			picker = $('a.widget-color-picker', part);
		UI.colorPicker(picker);
		picker.bind('select', function() {
			self.updateMod();
		});
	},
	
	/**
	 * �Ƿ���ʾ��Ӣ�����ƽ����߼�
	 */
	initNamePartSetting: function(namePart) {
		var self = this,
			checks = $('input.show-zh,input.show-en', namePart),
			settings = $('a.setting', namePart);
		
		checks.click(function() {
			var setting = $(this).closest('dt').find('a.setting');
			setting[this.checked ? 'show' : 'hide']();
			setting.triggerHandler('click', true);
		});
		checks.triggerHandler('click');
		
		settings.click(function(e, hidden) {
			var dd = $(this).closest('dl').find('dd');
				hidden = hidden || dd.css('display') !== 'none';
			dd[hidden ? 'hide' : 'show']();
			
			return false;
		});
	},
	
	
	/**
	 * ����˾������ʽ�仯�¼�
	 */
	initNamePartUpdate: function(namePart) {
		var self = this,
			handler = function() {
				self.updateMod();
			};
		$('select', namePart).change(handler);
		$(':checkbox', namePart).click(handler);
	}
	
	
};
//~ NamePart

//~ DefaultCompanyNameHandler


/**
 * ��˾����Handler
 * ����Tab��ǰѡ��, �Ѳ����������ӦHandler
 */
var CompanyNameHandler = {
	
	init: function(form, config, box) {
		this.box = box;
		this.bodies = $('div.app-edit-body', this.dialog.node);
		this.parts = $('div.mod>div', box);	
		this.loadLetFormHandler($.proxy(this, '_init'));
	},

	getFormConfig: function(box) {
		return DefaultCompanyNameHandler.getFormConfig(box);
	},

	/**
	 * ����LetFormHandler
	 */
	loadLetFormHandler: function(callback) {
		if (WP.diy.form.LetFormHandler) {
			callback();
			return;
		}
		var url = 'http://style.china.alibaba.com/js/itbu/app/let-form-handler.js';
		$.ajax(url, {
			dataType: 'script',
			cache: false,
			success: callback
		});
	},

	_init: function() {
		this.initLetFormHandlerProxy();
		this.initTabs();
		this.initBodies();
	},

	initLetFormHandlerProxy: function() {
		this.LetFormHandlerProxy = $.extendIf({
			_getFormData: function() {
				var data = DefaultCompanyNameHandler._getFormData();
				$.extend(data, WP.diy.form.LetFormHandler._getFormData());
				return data;
			}
		}, WP.diy.form.LetFormHandler);
	},

	/**
	 * ��ʼ��Tabs
	 * TOOD: Tabs���л��߼���LetFormHandler������ˣ��������ﲻ��Ҫ��
	 * �����ƺ��ã�����~~
	 */
	initTabs: function() {
		var self = this,
			tabs = $('ul.app-edit-tabs li', this.dialog.node);
		
		tabs.click(function() {
			self.selectedIndex = $(this).index();	
		});	

		this.selectedIndex = tabs.filter('li.selected').index();
	},

	/**
	 * ��ʼ��tab body
	 */
	initBodies: function() {
		var self = this;

		this.bodies.each(function(index, body) {
			var handler = self.getHandler(index),
				form = $('form', body),
				config = form.data('formConfig');

			handler.dialog = self.dialog;
			handler.init(form, config, self.box);
		});
	},

	/**
	 * ȡ��tabҳ��ӦFormHandler
	 */
	getHandler: function(index) {
		return index === 0 ? DefaultCompanyNameHandler : this.LetFormHandlerProxy;
	},
	
	validate: function() {
		return this._delegate('validate', arguments);
	},

	submit: function() {
		return this._delegate('submit', arguments); 	
	},

	cancel: function() {
		this._delegate('cancel', arguments);
		ModBox.reload(this.box);
	},

	_delegate: function(name, args) {
		var handler = this.getHandler(this.selectedIndex);
		return handler[name].apply(handler, args);
	}
};



WP.diy.form.CompanyNameHandler = CompanyNameHandler;


})(jQuery, Platform.winport);
//~
