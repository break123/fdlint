/**
 * @fileoverview ɾ�����
 * @author long.fanl
 */
(function($,WP){
	var RequestHandler = WP.diy.RequestHandler,
		Dialog = WP.widget.Dialog,
		BaseOperateHandler = WP.diy.BaseOperateHandler;
		
		/**
		 * ɾ��Boxȷ�Ͽ�
		 */
		var BoxDelDialog = {
			
			operate : function(box,ev){
				
				var editConfig = box.data('editConfig'),
					boxTitle = editConfig.widgetName;
				
				Dialog.open({
					header: 'ɾ�����',
					className: 'operate-delete-box-dialog',
					buttons: [
						{
							'class': 'd-confirm',
							value: 'ȷ��ɾ��'
						},
						{
							'class': 'd-cancel',
							value: 'ȡ��'
						}
					],
					draggable: true,
					
					content : '<p class="d-msg"><span class="warn">ȷ��Ҫɾ�����"'+boxTitle+'"��?</span></p>',
					
					confirm : function(dialog){
						dialog.close();
						BoxDelHandler.operate(box);
					}
				});
			}
		};
		
		/**
		 * ɾ��Box
		 */
		var BoxDelHandler = $.extend({},BaseOperateHandler,{
				operation : "del",
				
				// ����DOM
				_handleUI : function(save){
					var src = this.src;
					$("div.m-content,div.m-footer",src).css("opacity",0.2);
					BaseOperateHandler.bgiframe("open");
					src.animate({
						height : 0
					},500,function(){
						src.remove();
						BaseOperateHandler.bgiframe("close");
						save();
					});
				},
				// ɾ������ ��ʱ֪ͨ��̨����
				_save : function(){
					var boxCfg = this.src.data("box-config"),
						sid = boxCfg.sid,
						cid = boxCfg.cid;
					RequestHandler.delBox(sid,cid);
				}
			}
		);
		
	WP.diy.BoxOperateHandler.del = BoxDelDialog;
	
})(jQuery,Platform.winport);
