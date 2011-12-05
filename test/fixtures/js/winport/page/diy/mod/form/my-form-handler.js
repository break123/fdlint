/**
 * @fileoverview ��������ӿ��ĵ�
 * @author qijun.weiqj
 */
(function($, WP) {

/**
 * ��������������Ҫ���ļ������Ӧ, �� my-form-hander -> MyFormHandler
 * ������Ҫ�ҽ��� WP.diy.form�ļ��ռ���
 * ��ͨ�ı������ñ� mixin BaseHandler
 */
var MyFormHandler = {
	
	/**
	 * ��ʼ������, ��FormDialog�Զ�����
	 * @param {element} form ָ��༭ҳ���е�form��
	 * @param {object} config ���������Ӧ��������Ϣ data-form-config, ��ᱻ������config����
	 * @param {element} box ��ǰ�༭��box
	 * @this.dialog ָ��ǰ�򿪵�FormDialogʵ��
	 */
	init: function(form, config, box) {
		var dialog = this.dialog;  // this.dialogָ��ǰ�򿪵�FormDialogʵ��
	},
	
	/**
	 * ����֤����, �����ύʱ�Զ�����
	 * @return {boolean} �Ƿ���֤�ɹ�, �����֤ʧ��,����ֹ�����
	 */
	validate: function(form) {
		return true;
	},
	
	/**
	 * �����ύʱ�Զ�����(��validate�ɹ���) 
	 */
	submit: function(form) {
		
	},
	
	/**
	 * ����ȡ���༭ʱ�Զ�����
	 */
	cancel: function(form) {
		
	},
	
	/**
	 * �����ر�ǰ�Զ�����, ����submit��cancel�������
	 * @return {boolean} ����false����ֹ���ر�
	 */
	beforeClose: function(form) {
		
	}
	
};
//~ MyFormHandler


/**
 * ��Ҫ�ҽ���WP.diy.form���ֿռ��£��Ա㱻FormDialog����
 */
WP.diy.form.MyFormHandler = MyFormHandler;

	
})(jQuery, Platform.winport)
//~


