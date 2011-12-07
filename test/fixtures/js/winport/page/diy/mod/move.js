/**
 * @fileoverview ����ƶ�
 * @author long.fanl
 */
(function($,WP){
	var WPD = WP.diy,
		WPU = WP.Util,
		isIE6=WPU.isIE6,
		UI = WP.UI,
		BoxUtil = WPD.BoxUtil,
		RequestHandler = WPD.RequestHandler,
		BoxOperateChecker = WPD.BoxOperateChecker,
		BaseOperateHandler = WP.diy.BaseOperateHandler;
		
	/**
	 * �ƶ� Box, ���� BoxOperateHandler
	 */
	var BoxMoveHandler = $.extend({},BaseOperateHandler,{
		operation : "move", 
		direction : "", // up | down | left | right
		// ����Ŀ����,���Ŀ�����������/�����ƶ�
		_prepare : function(){
			this._setDst();
			this.__placeHolder = this.__initPlaceHolder();
		},
		
		_setDst : $.noop,
		
		// ����box�ƶ�ʱ��ռλ��
		__initPlaceHolder : function(){
			var placeHolder = $('<div class="box-move-placeholder"></div>');
			if(isIE6){
				placeHolder.css("padding-bottom",0).css("margin-bottom",0);
			}
			return placeHolder;
		},
		
		_beforeUI : function(src){
			src.trigger("movestart");
			BaseOperateHandler.bgiframe("open");
		},
		_afterUI : function(src){
			src.trigger("movestop");
			BaseOperateHandler.bgiframe("close");
		},
		// �ƶ����� �첽֪ͨ��̨����
		_save : function(){
			RequestHandler.savePageLayout(this.src,this.operation);
		}
	});
	
	BoxMoveHandler.base = BoxMoveHandler;
	
	/**
	 * ��ֱ�ƶ�Box, ����BoxMove
	 */
	var BoxVerticalMoveHandler = $.extend({},BoxMoveHandler,{
		// ��֤Դ��Ŀ�����Ƿ�ɲ���
		_check : function(){
			// down��ת������up
			return BoxOperateChecker.check(this.src,"up") && BoxOperateChecker.check(this.dst,"down");
		},
		
		_handleUI : function(save){
			var self = this,
			src = this.src,
			dst = this.dst,
			srcContent = $("div.m-content,div.m-footer",src),
			dstContent = $("div.m-content,div.m-footer",dst),
			dir = this.operation,
			base = this.base;
			
			if(dst.length < 1){
				return;
			}
			self._beforeUI(self._src);
			self._src.css("z-index",198);
			src.add(dst).wrapAll(this.__placeHolder);
			srcContent.css("opacity",0.2);
			dstContent.css("opacity",0.2);
			// src ����
			src.animate({
				top:"-"+(dst.height()) // ��IE������FF��8px
			},500,function(){
				$(this).css("top",0);
				srcContent.css("opacity","");
			});
			// dst����
			dst.animate({
				top:"+"+(src.height())
			},500,function(){
				$(this).css("top","");
				dstContent.css("opacity","");
				self._src.css("z-index","");
				src.insertBefore(dst);
				src.unwrap();
//				$.proxy(self._afterUI,self);
				self._afterUI(self._src);
				save();
			});
		}
		
	});
	/**
	 * �����ƶ�Box, ���� BoxVerticalMoveHandler
	 * @param {Object} boxes
	 */
	var BoxMoveUpHandler = $.extend({},BoxVerticalMoveHandler,{
			operation : "up",
			
			_setDst : function(){
				this._src = this.src;
				this.dst = BoxUtil.prevBox(this.src);
			}
		});	
		
	/**
	 * �����ƶ�Box, ���� BoxVerticalMoveHandler
	 */
	var BoxMoveDownHandler = $.extend({},BoxVerticalMoveHandler,{
			operation : "down",
			
			// ������ת��������
			_setDst : function(){
				var src = (this._src = this.src);
				this.src = BoxUtil.nextBox(src);
				this.dst = src;
			}
		});
	
	/**
	 * ˮƽ�ƶ�Box, ���� BoxMoveHandler
	 */
	var BoxHorizontalMoveHandler = $.extend(BoxMoveHandler,{
		
		_setDst : function(){
			var src = this.src,
			dir = this.operation,
			dstRegion = BoxUtil.getDstRegion(src, dir);
			this.dst = $("div.box-adder",dstRegion.obj); // ˮƽ�ƶ���dst�ǡ���Ӱ�顱��ť
		},
		
		// ע��ˮƽ�ƶ���ʱ��,û��check dst,����Ϊˮƽ�ƶ�ʱ,src����insertBefore��box-adder(��Ȼ���ڵ�dst)
		_handleUI : function(save){
			var self = this,
			src = this.src, srcContent = $("div.m-content,div.m-footer",src),
			dst = this.dst,
			srcOffset = src.offset(), dstOffset = dst.offset(),
			base = this.base;
			
			if(dst.length > 0){
				var placeHolder = this.__placeHolder;
				placeHolder.height(src.height());
				placeHolder.css("overflow","visible");
				
				src.wrap(placeHolder);
				self._beforeUI(src);
				// ���������򶨿�İ�� �Ƶ��������ſ�
				src.css("overflow", "hidden").css("z-index",198);
				srcContent.css("opacity",0.2);
				// ��Ӱ�ť����
				dst.fadeOut();
				// src��鿪ʼ�ƶ�
				src.animate({
					top: +(dstOffset.top - srcOffset.top),
					left: +(dstOffset.left - srcOffset.left),
					width : dst.width()
				},500,function(){
					src.unwrap();
					src.insertBefore(dst);
//					$.proxy(base._afterUI,base);
					self._afterUI(src);
					// src���top��left��Ϊ0
					src.css("top","").css("left","");
					srcContent.css("opacity","");
					// "��Ӱ��"����
					dst.fadeIn();
					// ����
					var srcOffset = src.offset(),doc = $(document),docScrollTop = doc.scrollTop(),
					upScroll = (srcOffset.top < docScrollTop) , 
					downScroll = (srcOffset.top+src.height() > $(window).height()+docScrollTop);
					if(upScroll || downScroll){
						$(document).scrollTop(src.offset().top-43);
					}
					// �Ƿ���Ҫ���¼���
					if(src.data('box-config').needReload){
						UI.showLoading($("div.m-content",src));
						RequestHandler.reloadBox(src);
					}
					// ����ƶ�������box�ӵ�������ʽ
					src.css("width","").css("overflow","").css("z-index","");
					save();
				});
				// jqĬ�ϸ�context����overflow:hidden(������Ϊ�˷�ֹ����ʱ����)������stepÿһ����ʽ����overflow:visible
				src.closest("div.box-move-placeholder").animate({
						height : 0
					},{
						duration : 500,
						step:function(){
							$(this).css("overflow","visible");
						}
					});
				}
			}
		});
		
	/**
	 * �����ƶ�Box, ���� BoxHorizontalMoveHandler
	 * @param {Object} boxes
	 */
	var BoxMoveLeftHandler = $.extend({},BoxHorizontalMoveHandler,{
			operation : "left"
		}
	);
	/**
	 * �����ƶ�Box, ���� BoxHorizontalMoveHandler
	 * @param {Object} boxes
	 */
	var BoxMoveRightHandler = $.extend({},BoxHorizontalMoveHandler,{
			operation : "right"
		}
	);
		
	WPD.BoxOperateHandler.up = BoxMoveUpHandler;
	WPD.BoxOperateHandler.down = BoxMoveDownHandler;
	WPD.BoxOperateHandler.right = BoxMoveRightHandler;
	WPD.BoxOperateHandler.left = BoxMoveLeftHandler;
		
})(jQuery,Platform.winport);