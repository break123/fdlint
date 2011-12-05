/**
 * @fileoverview ���̻����� NodeContext
 * 
 * @author qijun.weiqj
 */
(function($, WP) {

/**
 * ModeContext����������mod�ĳ�ʼ��
 * ÿ��modͨ�� ModContext.register(modId, config) �ķ�ʽע�ᵽcontext��, �����ֵ��÷�ʽ
 * 	����
 *  - ModContext.register('wp-supplier-info', { init: function()... });    // singleton ��ʽ 
 *  - ModContext.register('wp-rec-advertisement', function(...);   // prototype��ʽ
 * 
 * Ĭ�������mod��config��Ϣ��JSON��ʽ���ڽڵ�� data-mod-config ������
 */
WP.ModContext = new WP.NodeContext('ModContext', { configField: 'modConfig' });


/**
 * ��ʹ��PageContext����ԭ����DomReady����, �Խ���ͳһ����
 */
WP.PageContext = new WP.NodeContext('PageContext');


})(jQuery, Platform.winport);
//~



