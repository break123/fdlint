/**
 * �ṩһ�ַ��㴴����
 * @author qijun.weiqj
 */
(function($, WP) {


/**
 * ����һ����
 * @param {object|function} parent  ����(��ѡ)
 * @param {object} o ��Ա
 */
WP.Class = function(parent, o) {
	// ʡ�Ե�һ������
	if (!o) {
		o = parent;
		parent = null;
	}
	
	parent = typeof parent === 'function' ? 
			parent.prototype : parent;
		
	var klass = function() {
			this.parent = this.parent || parent;
			this.init && this.init.apply(this, arguments);
		},
		proto = parent ? $.extend({}, parent, o) : o;

	klass.prototype = proto;
	return klass;
};


})(jQuery, Platform.winport);
