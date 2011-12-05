/**
 * �Զ�������FormHandler��Ԫ����
 * @author qijun.weiqj
 */
(function($, WP) {

module('diy.form.CustomContentHandler');

WP.diy.form.SimpleHandler = WP.diy.form.SimpleHandler || {};

require('page/diy/mod/form/custom-content-handler-source');


test('fitlerValue-���˱�ǩ�е�id��class����', function() {
	var html = 
'<div id="header" class="mod" style="width: 100px; height: 100px;">\
	<div id="helloabc" class="myclass">\
		������Զ�������\
	</div>\
</div>',
		expect =
'<div   style="width: 100px; height: 100px;">\
	<div  >\
		������Զ�������\
	</div>\
</div>',
	Handler = WP.diy.form.CustomContentHandler;

	equal(Handler.filterValue(html), expect);
});

	
})(jQuery, Platform.winport);


