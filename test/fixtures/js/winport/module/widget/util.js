/**
 * @fileoverview �ǽ�����صĹ��߷���
 * 
 * @author qijun.weiqj
 */
(function($, WP) {

var Util = {
	isIE6: $.util.ua.ie6,
	isIE67: $.util.ua.ie67,
	
	/**
	 * ����һ����
	 * @param {object|function} parent  ����(��ѡ)
	 * @param {object} o ��Ա
	 */
	mkclass: function(parent, o) {
		return WP.Class(parent, o);
	},
	
	/**
	 * ͬһname���ƵĲ�������ִ��
	 * @param {string} name ����
	 * @param {function} action
	 * @param {number} delay
	 */
	schedule: function(name, action, delay) {
		this._schedule = this._schedule || {};
		this._schedule[name] && clearTimeout(this._schedule[name]);
		action && (this._schedule[name] = setTimeout(action, delay || 1000));
	},
	
	/**
	 * ƴ��url
	 * @param {string} url
	 * @param {object} param
	 */
	formatUrl: function(url, param){
		if (!url || !param) {
			return url || '';
		}
		param = (typeof param === 'string') ? param : $.param(param);
		return param ? url + (url.indexOf('?') === -1 ? '?' : '&') + param : url;
	},
	
	/**
	 * ��ȡָ���ֽ���
	 * @param {string} str
	 * @param {integer} len
	 * 
	 */
	cut: function(str, len) {
		if (Util.lenB(str) <= len) {
			return str;
		}
		
		var cl = 0;
        for(var i = 0, c = str.length; i < c; i++) {
			if (cl >= len) {
				return str.substr(0, i); 
			}
			var code = str.charCodeAt(i);
			cl += (code < 0 || code > 255) ? 2 : 1;
        }
        return '';
	},
	
	/**
	 * �����ַ����ֽ���
	 * @param {string} str
	 */
	lenB: function(str) {
		return str.replace(/[^\x00-\xff]/g,'**').length;
	},
	
	
	/**
	 * ��ģ������װ
	 * 
	 * @param {string} name ���� ��ѡ
	 * @param {object} o ģ�����
	 * @param {array} args
	 */
	initParts: function(name, o, args) {
		return new WP.Parts(name, o, args);
	},

	escape: function(str){
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	},
	
	toCamelString: function(str) {
		return str.replace(/-(\w)/g, function(r, m) {
			return m.toUpperCase();
		});
	},

	evalScript: function(html) {
		var re = /<script\b[^>]*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/i,
			match = re.exec(html || '');
		match && $.globalEval(match[1]);
	},

	delegate: function(o, fields) {
		var proxy = {};
		$.each($.makeArray(fields), function(index, field) {
			var v = o[field];
			proxy[field] = typeof v === 'function' ? $.proxy(v, o) : v;
		});
		return proxy;
	}
};
//~ Util

WP.Util = Util;
$.add('wp-util');


})(jQuery, Platform.winport);
//~
