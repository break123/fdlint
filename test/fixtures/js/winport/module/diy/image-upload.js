/**
 * @fileoverview DIY��̨ͼƬ�ϴ���
 * 
 * @author qijun.weiqj
 */
(function($, WP) {


var Util = WP.Util;


var ImageUpload = Util.mkclass({
	
	init: function(panel, config){
		this.panel = panel;
		this.config = config;
		
		var preview = (this.preview = $('div.preview', panel));
		this.img = $('img', preview);
		this.remove = $('a.remove', preview);
		this.pathInput = $('input.path', preview);
		this.message = $('div.message', panel);
		
		this.initPreview();
		this.handleUpload();
		this.handleRemove();
	},
	
	/**
	 * ��ʼ��Ԥ��ͼ
	 */
	initPreview: function(){
		if (!this.img.length) {
			this.img = $('<img />').prependTo(this.preview);
		}
		
		var src = this.img.attr('src'),
			path = this.pathInput.val();
		if (!src && path) {
			this.img.attr('src', path);
			src = path;
		}
		src && this.preview.show();
	},
	
	/**
	 * �����ϴ�
	 */
	handleUpload: function(){
		var self = this, 
			config = this.config, 
			url = config.imageUploadUrl, 
			upload = $('div.upload', this.panel), 
			loading = $('div.loading', this.panel);
		
		$.use('ui-flash-uploader', function(){
			upload.flash({
				module: 'uploader'
			});
			
			upload.bind('fileSelect.flash', function(e, data) {
				$(this).flash('uploadAll', url, {
					_csrf_token: config._csrf_token,
					name: 'file1',
					memberId: config.uid,
					source: 'winport_diy',
					drawFootTxt: false,
					noScale: config.noScale
				});
			});
			
			upload.bind('uploadStart.flash compressStart.flash', function(e) {
				$.log('ImageUpload: ' + e.type);
				
				self.showMessage(false);
				loading.show();
			});
			
			upload.bind('uploadCompleteData.flash', function(e, o) {
				$.log('ImageUpload: uploadComplete');
				
				loading.hide();

				var data = o.data || {};
				if(typeof data === 'string') {
					data = $.parseJSON(data);
				}
				
				if (data.result === 'success') {
					self.uploadSuccess(data.imgUrls);
					return;
				}
				
				var errMsg = data.errMsg || '',
					errCode = typeof errMsg === 'string' ? 
						errMsg.split(',')[0] : errMsg[0];
						
				self.uploadError(errCode);
			});
		});
	},
	//~ handleUpload
	
	/**
	 * �����ϴ�ʧ��
	 */
	uploadError: function(errCode) {
		var msg = this.getErrorMessage(errCode);
		this.showMessage('error', msg);
	},
	
	/**
	 * ������ʾ��Ϣ
	 */
	getErrorMessage: function(errCode) {
		var map = {
			TYPEERR: '��Ǹ��ͼƬ��ʽ����ȷ�����ϴ�jpg��jpeg��gif��png��bmp��ʽ��ͼƬ',
			IMGTYPEERR: '��Ǹ��ͼƬ��ʽ����ȷ�����ϴ�jpg��jpeg��gif��png��bmp��ʽ��ͼƬ',
			IMGSIZEERR: '��Ǹ��ͼƬ��С����������ƣ����ϴ�1MB���ڵ�ͼƬ',
			IMGREQUIRED: '��Ǹ��ͼƬ��С����������ƣ����ϴ�1MB���ڵ�ͼƬ'
		};
		errCode = (errCode || '').toUpperCase();
		return map[errCode] || '���緱æ��ͼƬ�ϴ�ʧ�ܣ�������';
	},
	
	/**
	 * �ϴ��ɹ�, ����Ԥ��ͼ, �����ص�
	 */
	uploadSuccess: function(imgUrl){
		this.pathInput.val(imgUrl);
		this.img.attr('src', imgUrl);
		this.preview.show();
		this.showMessage('success', 'ͼƬ���ϴ��ɹ�');
		
		this.config.onUpload && this.config.onUpload(imgUrl);
	},
	
	/**
	 * �����Ƴ�ͼƬ�¼�
	 */
	handleRemove: function(){
		var self = this;
		this.remove.click(function(){
			self.pathInput.val('');
			self.preview.hide();
			
			self.config.onRemove && self.config.onRemove();
			return false;
		});
	},
	
	/**
	 * ��ʾ��ʾ��Ϣ
	 * @param {string} type ��Ϣ���� 'success' | 'error'
	 * @param {string} message
	 */
	showMessage: function(type, message){
		var elm = this.message;
		elm.removeClass('error success').stop(true);
		if (type === false) {
			elm.hide();
		} else {
			elm.addClass(type).text(message).show();
		}
	}
});


WP.diy.ImageUpload = ImageUpload;	

	
})(jQuery, Platform.winport);
