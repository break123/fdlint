/**
 * @fileoverview �����Զ������ݰ��
 * @author qijun.weiqj
 */
(function($, WP) {

var CustomContent = new WP.Class({

	init: function(div, config) {
		this.div = div;

		var self = this,
			url = config.requestUrl,
			detailInfoId = config.detailInfoId;

		this.isEdit = $('#doc').data('docConfig').isEdit;

		if (detailInfoId === '0') {
			this.renderHtml(false);
			return;
		}

		$.ajax(url, {
			dataType: 'jsonp',
			data: {
				detailInfoId: detailInfoId,
				cid: config.cid,
				_env_mode_: this.isEdit ? 'EDIT' : 'VIEW'
			},
			success: function(o) {
				self.renderHtml(o.success ? o.data : false);
			}
		});
	},

	renderHtml: function(html) {
		var content = $('div.m-content', this.div);
		html = html ? '<div class="custom-content-wrap">' + html + '</div>' : 
				this.getBlankHtml();
		content.html(html);
	},

	getBlankHtml: function() {
		return this.isEdit ? '<div class="no-content">����Ҳ�����ð�ť������ͨ���༭��������֡�ͼƬ���Զ������ݣ�չʾ������������Ϣ��</div>' : '<div class="no-content">��������</div>';
	}

});


WP.ModContext.register('wp-custom-content', CustomContent);


})(jQuery, Platform.winport);
