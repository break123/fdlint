/**
 * @fileoverview ���̲�Ʒ����༭�Ի�������
 *
 * @author qijun.weiqj
 */
(function($, WP) {
	
var ModBox = WP.diy.ModBox,
	SimpleHandler = WP.diy.form.SimpleHandler;
	
	
var CategoryNavHandler = $.extendIf({

	init: function(form, config) {
		SimpleHandler.init.apply(this, arguments);
		
		this.managePart = $('p.manage-part', form);
		this.openCatPart = $('p.open-cat-part', form);
		
		this.initForm();
	},
	
	/**
	 * �����Ƿ��������Զ�����Ŀ����ʾ����ʼ�����ʵ�����
	 */
	initForm: function() {
		var self = this;
		
		$.ajax(this.config.offerUserDefCatUrl, {
			dataType: 'jsonp',
			
			success: function(o) {
				var data = o.data || {};
				if (o.success && 
						// ���δ��ͨ�Զ������
						// ���� ���㿪ͨ����
						!data.hasOpen && data.isShowTips) {
					
					// ��ʾ��ͨ����
					self.openCatPart.show();
					self.initOpenCatPart();
				} else {
					self.showManagePart();
				}
			},
			
			error: function() {
				self.showManagePart();
			}
		});
	},
	
	/**
	 * ��ʼ����ͨ�����¼�
	 */
	initOpenCatPart: function() {
		var self = this,
			open = $('a.open', self.openCatPart);
		open.click(function() {
			self.openUserDefCat();
			return false;
		});
	},
	
	/**
	 * �����Զ�����Ŀ
	 */
	openUserDefCat: function() {
		var self = this,
			loading = $('p.open-cat-loading', this.form);
		loading.show();
		
		$.ajax(this.config.openUserDefCatUrl, {
			data: { open: 'true' },
			dataType: 'jsonp',
			success: function(o) {
				if (o.success) {
					self.showManagePart('���������������Զ�����࣡');
					loading.hide();
					
					self.openCatPart.hide();
					self.refreshModBox();
				}
			},
			complete: function() {
				loading.hide();
			}
		});
	},
	
	/**
	 * ��ʾ�����Զ����������
	 */
	showManagePart: function(info) {
		var span = $('span.info', this.managePart);
		this.managePart.show();
		info && span.html(info);
	},
	
	/**
	 * ��ͨ�Զ�����Ŀ�ɹ�����Ҫˢ�·�����
	 */
	refreshModBox: function() {
		var modCat = $('div.wp-category-nav-main,div.wp-category-nav-sub');
		modCat.each(function() {
			var box = $(this).closest('div.mod-box');
			ModBox.reload(box);
		});
	}
	
}, SimpleHandler);

WP.diy.form.CategoryNavHandler = CategoryNavHandler;
	
})(jQuery, Platform.winport);
