/**
 * @fileoverview �����Զ�����--���
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	Diy = WP.diy.Diy,
	Msg = WP.diy.Msg,
	Component = WP.diy.Component;


var Helper = {
	
	applyStyle: function(json, enabled) {
		var sheet = this._getSheet(); 

		if (typeof json === 'string') {
			json = CssParser.parseCss(json);
		}

		$.each(json, function() {
			var o = this,
				selector = o.selector,
				styles = o.styles,
				css = null;
				
			$.each(styles, function() {
				var style = this,
					property = Util.toCamelString(style.property);
				if (enabled !== false && style.value) {
					css = {};
					css[property] = style.value;
					sheet.set(selector, css);
					$.log('set style: ' + selector + ' ' + style.property + ':' + style.value);
				} else {
					sheet.unset(selector, property);
					$.log('unset style: ' + selector + ' ' + style.property);
				}
			});
		});

	},

	_getSheet: function() {
		if (!this._sheet) {
			this._sheet = new FE.ui.StyleSheet($('#custom-style')[0]);
		}
		return this._sheet;
	}

};


var CustomStyles = {
	
	init: function(div, config) {
		this.div = div;
		this.config = config;
	
		this.CssParser = WP.widget.CssParser;

		this._styleConfig = this._parseStyleConfig(this.config.customStyleConfig)
		
		this.name = 'SiteCustomStyles';
		Util.initParts(this);
	},
	
	_parseStyleConfig: function(config) {
		var self = this,
			ret = {};
		$.each(config, function() {
			var o = this;
			o.styleJson = self.CssParser.parseCss(o.styleContent || '');
			ret[o.subject] = o;
		});
		return ret;
	},
	
	/**
	 * ȡ���Զ�����ʽ��Ϣ
	 * @param {string} subject ��ʽ��������
	 * @param {object|boolean} defaultConfig
	 * 	- object Ĭ����ʽ��Ϣ
	 *  - true ����Ĭ����ʽ��Ϣ
	 */
	getStyleConfig: function(subject, defaultConfig) {
		if (defaultConfig === true) {
			defaultConfig = {
				subject: subject,
				isEnable: false,
				styleJson: []
			};
		}
		return this._styleConfig[subject] || 
				(this._styleConfig[subject] = defaultConfig);
	},

	/**
	 * �����Զ�����ʽ
	 * @param {string} ��ʽ��������
	 */
	updateStyleConfig: function(subject) {
		var config = this.getStyleConfig(subject);
		Helper.applyStyle(config.styleJson, config.isEnable);
		this._saveStyleConfig(config);
	},

	/**
	 * �����Զ�����ʽ��Ϣ
	 */
	_saveStyleConfig: function(config) {
		var self = this,
			action = null,
			url = this.config.customizeStyleUrl;
		
		action = function() {
			Diy.authAjax(url, {
				type: 'POST',
				data: self._wrapSaveStyleData(config),
				dataType: 'json',
				success: function(ret) {
					if (ret.success) {
						$(window).trigger('diychanged', { type: 'custom-style' });
						Msg.info('�Զ��������óɹ�');
					} else {
						Msg.error('�Զ���������ʧ��');
					}
				}
			});
		};
		
		Util.schedule('style-' + config.subject, action);
	},
	
	_wrapSaveStyleData: function(config) {
		config.styleContent = this.CssParser.toCss(config.styleJson);
		return {
			pageSid: Component.getContentConfig().sid,
			_csrf_token: Component.getDocConfig()._csrf_token,
			subject: config.subject,
			enabled: config.isEnable,
			styleContent: config.styleContent || '/* custom style */'
		}
	}
	
};

CustomStyles.Parts = {};

$.namespace('Platform.winport.diy.site');
WP.diy.site.CustomStyles = CustomStyles;

WP.SettingContext.register('custom-styles', CustomStyles, { configField: 'stylesConfig' });

})(jQuery, Platform.winport);
