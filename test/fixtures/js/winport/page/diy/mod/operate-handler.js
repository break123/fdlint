/**
 * @fileoverview �������߼�
 * @author long.fanl
 */
(function($,WP){
	var WPD = WP.diy,
		BoxOperateChecker = WPD.BoxOperateChecker,
		Msg = WPD.Msg;
		
		/**
		 * BoxOperateHandler ����������л���Box�Ĳ���(toolbar���)
		 * ���� : ���/ɾ��/����/����/����/���� -> Ӱ��ҳ�沼��(PageLayout)
		 *           ���� ->  Ӱ������������(BoxData)
		 * ���� mod,������ region , layout , segment������֧��, Ŀǰ����ֻ��mod�ɲ���
		 */
		var BaseOperateHandler = {
			// ��������,��box-config�ж�Ӧ
			operation : null,
			// �ò�����Ӧ��Դbox
			src : null,
			// ����/ɾ��/�ƶ����� �����߼�
			operate : function(box){
				this.src = box;
				this._prepare();
				var checkResult = this._check();
				if(!checkResult.pass){
					Msg.warn(checkResult.message);
					return;
				}
				var save = $.proxy(this._save,this);
				this._handleUI(save);
			},
			// ���� : �ڲ���֮ǰ��׼������
			_prepare:$.noop,
			// ��֤����Ƿ�ɲ���
			_check : function(box){
				return BoxOperateChecker.check(this.src,this.operation);
			},
			// �������,��ɺ�ص�save����
			_handleUI : function(save){
				save();
			},
			// UI����֮ǰ��Ҫ����,Ĭ������flyadder
			_beforeUI : $.noop,
			// UI������Ϻ�ĸ���/׷�Ӳ���,Ĭ�ϸ���toolbar
			_afterUI : $.noop,
			// �첽֪ͨ��̨����
			_save : $.noop
		};
		
		BaseOperateHandler.base = BaseOperateHandler;
		
		BaseOperateHandler.bgiframe = function(op){
			if(op === "open"){
				$('body').bgiframe({
					zIndex : 199,
					force : true
				});
			}else if(op === "close"){
				$("body").bgiframe("close");
			}
		}
		
		
		WPD.BaseOperateHandler = BaseOperateHandler;
		WPD.BoxOperateHandler = {};
		
})(jQuery,Platform.winport);