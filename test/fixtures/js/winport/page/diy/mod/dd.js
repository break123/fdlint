/**
 * @fileoverview �����ק
 * @author long.fanl
 */
(function($, WP){

    var WPD = WP.diy, 
		isIE6 = $.util.ua.ie6, 
		isIE = $.util.ua.ie, 
		isIE67 = $.util.ua.ie67, 
		UI = WP.UI,
		ModBox = WP.diy.ModBox,
		BoxUtil = WPD.BoxUtil, 
		BoxBar = WPD.BoxBar, 
		Msg = WPD.Msg, 
		RequestHandler = WPD.RequestHandler, 
		OperateChecker = WP.diy.BoxOperateChecker, 
		lastRegion, porletSort, 
		REGION_EXPR = /.*\s(main-wrap|grid-sub|extra)\s.*/i, 

	msgEnum = {
		"canNotIn" : "��Ǹ��������֧��������",
		"notSingle" : "��Ǹ��������������ͬ��飬�����ٴ�����"
	},
	currentMsgCode;
	
	var BoxDDHandler = {
        init: function(){
            disableUnmovableBox();
            initPortlets();
        }
    };
    
    // �������ƶ���box���ui-portlets-disable��ʽ
    function disableUnmovableBox(){
        $("div.mod-box").each(function(i, b){
            var box = $(b);
            if (!box.data("box-config").movable) {
                box.addClass("ui-portlets-disable");
            }
        });
    }
    
    // ��ʼ����ק
    function initPortlets(){
        var wpContent = $('#winport-content'), configs = {
            items: " div.mod-box:not(.ui-portlets-disable)",
            columns: "div.region",
            placeholder: "box-dd-placeholder",
            helper: boxDDHelper,
            cursorAt: { "top": 14 },
            revert: 250,
			revertOuter: true,
            start: startHandler,
			dropOnEmpty: dropOnEmptyHandler,
            over: overHandler,
            stop: stopHandler
        };
        
        wpContent.portlets(configs);
    }
    // �����϶��Ķ���
    function boxDDHelper(ev, item){
        var helper = $('<div class="box-dd-helper">\
			<div class="mod">\
				<div class="m-body"></div>\
			</div>\
			<div class="dd-helper-shim"></div>\
		</div>');
        $("div.m-body", helper).append($("div.m-header", item).clone());
        return helper;
    }
	
	
    function boxDDPlaceHolder(ev, ui){
        return $('<div class="box-dd-placeholder"></div>');
    }
    
    // ��ʼ��קʱ�¼�����
    function startHandler(event, ui){
        var box = ui.currentItem, helper = ui.helper, ph = ui.placeholder;
        
        reCalcPlaceHolderHeight(box, ph);
        // ��ʼ��קʱ trigger һ���¼�������������״̬data
        $('#winport-content').data('sorting', true);
		box.trigger('ddstart');
		
		$.each(ui.columns,function(i,column){
			var region = $(column.dom);
			// ����ǵ�ǰregion,����
			if(region[0] === ui.originalColumn[0]){
				return;
			}
			// ��Ŀ����������ͬ�����singletonInRegionΪtrueʱ����ǲ�������
	        if (!isSingleBoxInRegion(ui.currentItem, region)) {
	            region.addClass("ui-portlets-unreceivable");
				currentMsgCode = "notSingle";
				return;
	        }
	        // ����canIn/canNotIn�жϰ���Ƿ���ƶ���Ŀ������
	        var regionMatch = REGION_EXPR.exec(" " + region[0].className + " "), regionName;
	        if (regionMatch && regionMatch[1]) {
	            regionName = regionMatch[1];
	        }
	        else {
	            $.log("box-dd : cannot match regionName : " + region);
	            return;
	        }
	        if (!OperateChecker.ddCheck(box, regionName)) {
				region.addClass("ui-portlets-unreceivable");
				currentMsgCode = "canNotIn";
	            return;
	        }
		});
    }
    
    // ���¼���placeHolder�ĸ߶ȣ���ȥborder-width��
    function reCalcPlaceHolderHeight(box, ph){
		//noformat
        var phBorderTopHeight = parseFloat(ph.css("border-top-width")), 
			phBorderBottomHeight = parseFloat(ph.css("border-bottom-width")), 
			phBorderHeight = phBorderTopHeight + phBorderBottomHeight, 
			phMarginBottom = parseFloat(ph.css("margin-bottom")), 
			boxHeight = box.height();
		// FF�±���Ӧ��ȥphMarginBottom������ʵ�ʲ��Լ�ȥ�����ȶ�
        phHeight = isIE67 ? boxHeight - phBorderHeight - phMarginBottom : boxHeight - phBorderHeight - phMarginBottom;
        // ���IE��max-heightʧЧ������
        ph.height(phHeight);
    }
	
	// Ϊ��region���������Ż����������뵽��region��box-adder��ǰ�棨��Ϊ�����й̶��İ�� �繩Ӧ����Ϣ���)
	function dropOnEmptyHandler(ev,ui){
		$("div.box-adder", ui.currentColumn).before(ui.placeholder);
		return false;
	}
	
    // �жϸ�region���Ƿ�ֻ��һ����cid����ͬ��box
    function isSingleBoxInRegion(box, region){
        var boxCfg = box.data("box-config"), isSingleBox = true;
        
        if (boxCfg.singletonInRegion) {
            $("div.mod-box:not(.ui-portlets-placeholder)", region).each(function(i, b){
                var b = $(b);
                if (b.data("box-config")["cid"] === boxCfg["cid"]) {
                    isSingleBox = false;
                    return false;
                }
            });
        }
        return isSingleBox;
    }
	
	// ����regionʱ�������ɱ����룬����currentMsgCode������ʾ
	function overHandler(ev, ui){
        if (ui.currentColumn.hasClass("ui-portlets-unreceivable")) {
            Msg.warn(msgEnum[currentMsgCode]);
        }
    }
	
    // ��ק����ʱ�¼�����
    function stopHandler(event, ui){
		
        var box = ui.currentItem, boxCfg = box.data("box-config"),
		triggerFlag = false;
		
		// ����boxλ��cache
        updateBoxLocation(box);
        //�Ƴ�����״̬data
        $("#winport-content").removeData('sorting');
        WPD.RequestHandler.savePageLayout();
        if (boxCfg.needReload && ui.currentColumn[0] !== ui.originalColumn[0]) {
			UI.showLoading($("div.m-content",box));
			// ��reload֮ǰ����fire ddstop�¼�
			box.trigger("ddstop");
			triggerFlag = true;
			ModBox.reload(box);
        }
		!triggerFlag && box.trigger("ddstop");
		$("div.region",this).removeClass("ui-portlets-unreceivable");
    }
    
    // ����boxλ��
    function updateBoxLocation(box){
        var region = box.parents("div.region");
        box.data("region", BoxUtil.getComponentArea(region));
        var layout = region.parents("div.layout");
        box.data("layout", BoxUtil.getComponentArea(layout));
        var segment = layout.parents("div.segment");
        box.data("segment", segment[0].id);
    }
    
    WP.diy.BoxDDHandler = BoxDDHandler;
    WP.PageContext.register('~BoxDDHandler', BoxDDHandler);
	
})(jQuery, Platform.winport);