/**
 * @fileoverview ��鸡�㹤����
 * @author long.fanl
 */
(function($,WP){
	var WPD = WP.diy,
		UI = WP.UI,
		isIE6=$.util.ua.ie6,
		isIE = $.util.ua.ie,
		isIE67 = $.util.ua.ie67,
		
		BoxOperateChecker = WPD.BoxOperateChecker,
		
		uniqBoxBar, // ȫ��ΨһToolbar,jQuery���� 
		
		lastBox, // ���һ�Σ���һ�Σ�boxBar���ڵ�box����
		
		operations = $(["left","up","down","right","edit","del"]),
		
		operate = {};
		
		/**
		 * ��鸡�㹤����(���� ����/����/����/���� ,�༭,ɾ����ť)
		 */
		var BoxBar = {
			
			init : function(){
				
				uniqBoxBar = genBoxBar();
			
				operations.each(function(i,op){
					operate[op] = $("a."+op,uniqBoxBar);
				});
				// fix IE67�£�mod-box�߶����⣨����մ�ҳ��ʱ�������hover�����ӻ�ť�ϣ��ɵ�����⣩
				if(isIE67){
					$("div.mod-box").each(function(i,box){
						fixIE67Hover(box);
					});
				}
				initBoxBarEvent();
				initBoxBarItemEvent();
				
				// ddstop movestop reloaded ����Ҫ���¼���shim�ĸ߶�
				$("div.mod-box:not(.ui-portlets-placeholder)").live("movestart",function(){
					hideBoxBar();
				}).live("ddstop movestop",function(ev){
					fixIE67Hover(this);
					isIE67 && $(this).mouseover();
					updateBoxBar(this);
				}).live("reloaded",function(ev){
					isIE67 && $(this).mouseover();
				});
				$('div.mod').live('afterinit', function() {
					isIE67 && $(this).mouseover();
				});
			}
		}
		
		function genBoxBar(){
			var boxToolbar = $("<div>",{
				"class" : "box-bar fd-hide"
			}),
			operationsHTML = [],
			operationTitles = ["����","����","����","����","����","ɾ��"];
			operations.each(function(i,op){
				operationsHTML.push('<a href="#" class="'+op+'" title="'+operationTitles[i]+'"></a>');
			});
			boxToolbar.html(operationsHTML.join(""));
			return boxToolbar;
		}
		
		/**
		 * ��ʼ��toolbar����ʾ/�����߼�
		 * @param {Object} b
		 * @param {Object} t
		 */
		function initBoxBarEvent(){
			var boxes = $("div.mod-box:not(.ui-portlets-placeholder)"),
				wpContent = $('#winport-content');
			
			// �������boxʱ,��ʾboxShim��boxBar
			boxes.live("mouseenter",function(ev){
				// �����߼� : ����������,����ʾtoolbar
				if($("div.mod",this).hasClass("wp-top-nav")){
					showBoxBar(this);
					uniqBoxBar.css("visibility","hidden");
					operate["edit"].css("visibility","visible");
					return false;
				}else{
					uniqBoxBar.css("visibility","visible");
				}
				showBoxShim(this);
			});
			
			// ����Ƴ�boxʱ,����boxShim��boxBar
			boxes.live("mouseleave",function(){
				hideBoxShim(this);
				hideBoxBar();
			});
			
			// ˫���򿪱༭��
			boxes.live("dblclick",function(ev){
				var box = $(this);
				// toolbar��֧��˫��
				if ($("div.mod", this).hasClass("wp-top-nav")) {
					return;
				}
				try {
					WPD.BoxOperateHandler["edit"].operate(box, ev);
				}catch (e) {
					$.log("dbl edit error: " + e);
				}
				return false;
			});
		};
		
		// ��ʾtoolbar
		function showBoxShim(box){
			// ���������һ����box,����������һ��box��shim
			if(lastBox !== box){
				hideBoxShim(lastBox);
			}
			var boxShim = $("div.box-shim",box);
			boxShim.addClass("box-shim-in");
			fixIE67Hover(box);
			
			boxShim.stop();
			boxShim.animate({
				"opacity":0.5
			},200,function(){
				showBoxBar(box);
			});
			lastBox = box;
		}
		
		// �޸�ie67��shim�߶�����
		function fixIE67Hover(box){
			if(isIE67) {
				box = $(box);
				
				var boxShim = $("div.box-shim",box), 
					boxHeight=box.height();
					
				if($("div.m-body",box).length >0){
					boxShim.height(boxHeight - 8);
				}else{
					boxShim.height(boxHeight);
				}
	        }
		}
		
		// ��ʾboxBar
		function showBoxBar(box){
			updateBoxBar(box);
			uniqBoxBar.appendTo(box);
			uniqBoxBar.removeClass("fd-hide");
			uniqBoxBar.css("display","");
		}
		
		// ����toolbar
		function hideBoxShim(box){
			var boxShim = $("div.box-shim",box);
			boxShim.removeClass("box-shim-in");
			boxShim.stop();
			boxShim.css("opacity",0);
		}
		
		// ����boxBar
		function hideBoxBar(){
			uniqBoxBar.addClass("fd-hide");
		}
		
		/**
		 * ����boxBar
		 * @param {Object} box
		 */
		function updateBoxBar(box){
			box = $(box);
			if(box.length === 0){
				box = uniqBoxBar.parents("div.mod-box");
			}
			operations.each(function(i,op){
				if(BoxOperateChecker.check(box,op,true).pass){
					operate[op].css("display","");
				}else{
					operate[op].css("display","none");
				}
			});
		}
		
		/**
		 * ��ʼ��boxBar�е�item�¼������������ƶ�/����/ɾ����
		 */
		function initBoxBarItemEvent(){
			$(".box-bar a").live("click",function(ev){
				var box = $(this).closest("div.mod-box"),
				operation = this.className;
				try {
					WPD.BoxOperateHandler[operation].operate(box,ev);
				}catch(e){
					$.log("Box Operate Error : "+e);
				}
				return false;
			});
		}
		
		WP.diy.BoxBar = BoxBar;
		WP.PageContext.register('~BoxBar', BoxBar);
		
})(jQuery,Platform.winport);
