/**
 * @fileoverview ���������߷���
 * @author long.fanl
 */
(function($,WP){
		
		var PATH_MAP = {
			"winport-header .p32-m0":["main-wrap"], // header ͨ������(inuse)
			"winport-content .p32-m0":["main-wrap"], // content ͨ������(inuse)
			"winport-content .p32-s5m0":["grid-sub","main-wrap"], // content 1:4����(inuse)
			"winport-content .p32-m0s5":["main-wrap","grid-sub"], // content 4:1����(inuse)
			"winport-footer .p32-m0":["main-wrap"] // footer ͨ������
		}
		var BoxUtil = {
			/**
			 * ��ȡbox����һ���ֵܽڵ�
			 * @param {Object} box
			 */
			prevBox : function(box){
				var prevBox = $(box).prev("div.mod-box:not(.ui-portlets-placeholder)");
				// �����߼� ����һ��TP�пյĹ��λ���
				if ($('div.mod', prevBox).length === 0) {
					prevBox = prevBox.prev("div.mod-box:not(.ui-portlets-placeholder)");
				}
				return prevBox;
			},
			
			/**
			 * ��ȡbox����һ���ֵܽڵ�
			 * @param {Object} box
			 */
			nextBox : function(box){
				var nextBox = $(box).next("div.mod-box:not(.ui-portlets-placeholder)");
				// �����߼� ����һ��TP�пյĹ��λ���
				if ($('div.mod', nextBox).length === 0) {
					nextBox = nextBox.next("div.mod-box:not(.ui-portlets-placeholder)");
				}
				return nextBox;
			},
			
			/**
			 * ����direction��ȡbox��Ŀ������һ�������ƶ�������
			 * @param {Object} box
			 * @param {String} direction
			 */
			getDstRegion : function(box,direction){
				var dstRegion = null,region = this.getComponentArea(box.closest("div.region")), layout = this.getComponentArea(box.closest("div.layout")),segment = this.getComponentArea(box.closest("div.segment")),
				layoutPath = segment+" ."+layout,
				regions = PATH_MAP[layoutPath];
				if($.isArray(regions) && regions.length > 0){
					var pos = $.inArray(region,regions);
					len = regions.length;
					if(direction === "right" && pos < len-1){
						dstRegion = regions[pos+1];
					}else if(direction==="left" && pos >0){
						dstRegion = regions[pos-1];
					}
				}else{
					$.log(box+" is illegal!","error");
				}
				return {
					name : dstRegion,
					obj : $("#"+layoutPath+" ."+dstRegion)
				};
			},
			
			/**
			 * ��ȡcomponent aear�ľ������ƣ�eg: grid-sub, main-wrap
			 * @param {Object} component
			 */
			getComponentArea : function(component){
				var area,
				cmptName = " "+component[0].className+" ";
				if(component.hasClass("region")){
					return /.*\s(main-wrap|grid-sub|extra)\s.*/i.exec(cmptName)[1];
				}else if(component.hasClass("layout")){
					return /.*\s(p32-s5m0|p32-m0s5|p32-m0)\s.*/i.exec(cmptName)[1];
				}else if(component.hasClass("segment")){
					return /(winport-header|winport-content|winport-footer|winport-fly)/i.exec(component[0].id)[1];
				}else{
					return null;
				}
			},
			
			/**
			 * ����Ƿ����Ӿ������
			 * �ر��, ����1:2:1 �� 1:1:2 ����������, ֻ�� ��������������,����ȫ���ұ�
			 * @param {Object} box
			 */
			boxInLeft : function(box){
				var inleft = box.data("inleft");
				if(typeof inleft === "undefined"){
					inleft = _boxInLeft(box);
				}
				return inleft;
			}
		};
		
		function _boxInLeft(box){
			var inleft,region = BoxUtil.getComponentArea(box.closest("div.region")), layout = BoxUtil.getComponentArea(box.closest("div.layout")),segment = BoxUtil.getComponentArea(box.closest("div.segment")),
			layoutPath = PATH_MAP[segment+" ."+layout];
			if($.isArray(layoutPath) && layoutPath.length > 0){
				inleft = layoutPath[0] === region;
				box.data("inleft",inleft);
			}else{
				$.error(box+" is illegal!","error");
				return;
			}
			return inleft;
		}
		
		if(!WP.diy.BoxUtil){
			WP.diy.BoxUtil = BoxUtil;
		}
})(jQuery,Platform.winport);
