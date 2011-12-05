/**
 * @fileoverview �����������
 * 
 * @author qijun.weiqj
 */
(function($, WP){


var Util = WP.Util,
	FormUtil = WP.widget.FormUtil,
	Msg = WP.diy.Msg,
	ModBox = WP.diy.ModBox,
	Diy = WP.diy.Diy;


var BaseHandler = {
	
	init: function(form, config, box) {
		this.form = form;
		this.config = config;
		this.box = box;
	},
	
	validate: function() {
		return true;
	},
		
	submit: function(form) {
		var self = this,
			form = this.form;
		
		if (this.isSubmitting) {
			return;
		}
		this.dialog.showLoading('���ڱ���..');
		this.isSubmitting = true;

		this.__$saveBox(function(result) {
			self.dialog.showLoading(false);
			self.isSubmitting = false;
			
			var changed = self._afterSubmit(result);
			if (changed === undefined) {
				changed = result.success;
			}
			changed && $(window).trigger('diychanged', { type: 'save-box' });
		});
	},

	__$saveBox: function(callback) {
		var self = this, 
			docCfg = $('#doc').data('doc-config'),
			contentCfg = $('#content').data('content-config'),
			boxCfg = this.box.data('box-config'),
		
			url = contentCfg.saveParamUrl,
			data = {
				_csrf_token: docCfg._csrf_token,
				pageSid: contentCfg.sid,
				cid: boxCfg.cid,
				sid: boxCfg.sid
			};
		
		data = $.extend(data, this._getFormData() || {});
		
		Diy.authAjax(Util.formatUrl(url, '_input_charset=UTF-8'), {
			type: 'POST',
			data: data,
			dataType: 'json',
			success: callback,
			error: function() {
				Msg.error('���ð��ʧ�ܣ���ˢ�º�����');
			}
		});
	},

	_getFormData: function() {
		var form = this.form;
		return form ? FormUtil.getFormData(form) : null;
	},

	_afterSubmit: function(result) {
		return result.success;
	},

	_refreshBox: function() {
		ModBox.reload(this.box);
	}

};



WP.diy.form.BaseHandler = BaseHandler;

    
})(jQuery, Platform.winport);
//~
