/**
 * @fileoverview �򵥽���/������css�ַ���
 * 
 * @author qijun.weiqj
 */
(function($, WP) {


var CssParser = {

	/**
	 * ����css�ַ�������json
	 * @return {array}
	 * 	[
	 * 		{ 
	 * 			selector: 'div.custom-bg', 
	 * 			styles:  [
	 * 				{
	 * 					property: 'background-color',
	 * 					value: '#FFFFFF'
	 * 				},
	 * 				{
	 * 					property: 'background-image',
	 * 					value: url(...)
	 * 				},
	 * 			]
	 * 		},
	 * 		...
	 * 	]
	 */
	parseCss: function(css) {
		var self = this,
			ret = [],
			regexp = /([^\{\}]+)\{([^\}]+)\}/gm,
			match = null,
			reComment = /\/\*[^*]*\*+([^/][^*]*\*+)*\//gm;
			
		css = css.replace(reComment, '');
		
		while ((match = regexp.exec(css))) {
			ret.push({
				selector: $.trim(match[1]),
				styles: self._parseStyleBody(match[2])
			});
		}
		
		return ret;
	},
	
	/**
	 * ������ʽ��
	 */
	_parseStyleBody: function(body) {
		var styles = [],
			regexp = /([^:]+):([^;]+);/gm,
			match = null;
		
		while ((match = regexp.exec(body))) {
			styles.push({
				property: $.trim(match[1]),
				value: $.trim(match[2])
			});
		}
		
		return styles;
	},
	
	/**
	 * ����json����css�ַ���
	 * @return {string}
	 */
	toCss: function(json) {
		var css = [];
		$.each(json, function() {
			var o = this;
			css.push(o.selector + ' { ');
			$.each(o.styles, function() {
				var style = this;
				if (style.value) {
					css.push(style.property + ': ' + style.value + '; ');
				}
			});
			css.push(' }\n');
		});
		return css.join('');
	},
	
	/**
	 * ����ʽjson�ṹ��ȡ��ָ����ʽ
	 * @return {object}
	 * 	- property
	 * 	- value
	 */
	getStyle: function(json, selector, property) {
		for (var i = 0, c = json.length; i < c; i++) {
			var o = json[i],
				styles = o.styles;
			if (o.selector === selector) {
				return this._getStyle(o, property);
			}
		}
	},
	
	_getStyle: function(o, property) {
		var styles = o.styles,
			style = null;
		if (!property) {
			return o;
		}
		
		for (var i = 0, c = styles.length; i < c; i++) {
			style = styles[i];
			if (style.property === property) {
				return style;
			}
		}
	},
	
	/**
	 * ������ʽ����ʽjson�ṹ, ������ӵĻ��޸ĵ���ʽ����
	 * @return {object}
	 * 	- property
	 * 	- value
	 */
	setStyle: function(json, selector, property, value) {
		var o = this.getStyle(json, selector);
		if (!o) {
			o = { selector: selector, styles: [] };
			json.push(o);
		}
		
		var styles = o.styles,
			style = null;
		for (var i = 0, c = styles.length; i < c; i++) {
			style = styles[i];
			if (style.property === property) {
				style.value = value;
				return style;
			}
		}
		
		style = { property: property, value: value };
		styles.push(style);
		return style;
	},
	
	/**
	 * ��������css�ַ���, ����ͼƬ��ַ
	 * @return {string}
	 */
	getBkImgUrl: function(css) {
		var pattern = /url\(([^)]+)\)/;
		return (pattern.exec(css) || {})[1];
	}
};

WP.widget.CssParser = CssParser;
$.add('wp-cssparser');

})(jQuery, Platform.winport);
