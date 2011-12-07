/**
 * @fileoverview ����֤����
 * @author qijun.weiqj
 */
(function($, WP) {
	
	
var Util = WP.Util,
	UI = WP.UI;
	
	
var CertificationInfoBase = {
	
	init: function(div, config) {
		this.div = div;
		this.config = config;
		
		var self = this,
			url = config.certificateQueryUrl;
			
		$.ajax(url, {
			data: {
				memberId: WP.Component.getDocConfig().uid,
				pageSize: config.displayCount
			},
			dataType: 'jsonp',
			success: function(ret) {
				ret.success && self.render(ret.data || []);
			}
		});
	},
	
	render: function(certs) {
		var self = this,
			content = $('div.m-content', this.div);
		this.filterData(certs);
		
		UI.sweetTemplate(content, this.template, {
			certs: certs,
			moreUrl: this.config.moreUrl
		}, function() {
			self.afterRender && self.afterRender();
		});
	},
	
	filterData: function(certs) {
		var self = this,
			detailBase = this.config.creditDetailBaseUrl,
			imageBase = WP.Component.getDocConfig().imageServer + '/img/certify/';
		$.each(certs, function() {
			var cert = this;
			cert.name = $.util.escapeHTML(cert.name);
			cert.origin = $.util.escapeHTML(cert.origin);
			cert.detailUrl = detailBase + '/' + cert.certifyInfoId + '.html';
			cert.smallImg = imageBase + cert.tnImgPath;
			cert.dateDesc = self.formatDateDesc(cert);
		});
	},
	
	formatDateDesc: function(cert) {
		return cert.dateStart + (cert.dateEnd ? ' �� ' + cert.dateEnd : ' ��');
	}
};


/**
 * ����������֤����
 */
var CertificationInfoMain = Util.mkclass(CertificationInfoBase, {
	template: 
		'<% if (certs.length) { %>\
		<table>\
			<tr>\
				<th class="img">֤��ͼƬ</th>\
				<th class="name">֤������</th>\
				<th class="origin">��֤����</th>\
				<th class="date">��Ч��</th>\
			</tr>\
			<% jQuery.each(certs, function(index, cert) { %>\
			<tr>\
				<td class="img"><a href="<%= cert.detailUrl %>" target="_blank"><img src="<%= cert.smallImg %>" alt="<%= cert.name %>" /></a></td>\
				<td class="name"><a href="<%= cert.detailUrl %>" target="_blank"><%= cert.name %></a></td>\
				<td class="origin"><%= cert.origin %></td>\
				<td class="date"><%= cert.dateDesc %></td>\
			</tr>\
			<% }); %>\
		</table>\
		<div class="m-content-footer"><a href="<%= moreUrl %>" target="_blank" class="more">���� &gt;&gt;</a></div>\
		<% } else { %>\
		<div class="no-content">����֤������</div>\
		<% } %>'
});


/**
 * ���������֤����
 */
var CertificationInfoSub = Util.mkclass(CertificationInfoBase, {
	template: 
		'<% if (certs.length) { %>\
		<ul>\
			<% jQuery.each(certs, function(index, cert) { %>\
			<li>\
				<div class="img"><a href="<%= cert.detailUrl %>" target="_blank"><img src="<%= cert.smallImg %>" alt="<%= cert.name %>" /></a></div>\
				<div class="name"><a href="<%= cert.detailUrl %>" target="_blank"><%= cert.name %></a></div>\
				<div class="date"><%= cert.dateDesc %></div>\
			</li>\
			<% }); %>\
		</ul>\
		<div class="m-content-footer"><a href="<%= moreUrl %>" target="_blank" class="more">���� &gt;&gt;</a></div>\
		<% } else { %>\
		<div class="no-content">����֤������</div>\
		<% } %>',
		
	afterRender: function() {
		var imgs = $('div.img img', this.div);
		UI.resizeImage(imgs, 64);
	}
});



WP.ModContext.register('wp-certification-info-main', CertificationInfoMain);
WP.ModContext.register('wp-certification-info-sub', CertificationInfoSub);

	
})(jQuery, Platform.winport);
