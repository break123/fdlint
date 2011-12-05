/**
 * @fileoverview ���������
 * @author long.fanl
 */
(function($, WP){
    var BoxUtil = WP.diy.BoxUtil, 
	MOVE_EXPR = /move|up|down|left|right/i;
    
    // WARN ����ͼƬ���,��ʼ��default_page_configҪ��ʼ��ÿ��page
    var BoxOperateChecker = {
        /**
         * ���box�Ƿ���Խ���operation����(ͬʱ������box-bar�ĳ�ʼ��)
         * @param {Object} box
         * @param {Object} operation
         */
        check: function(box, operation, isDetact){
            var result;
            if (operation === "edit") {
                result = editCheck(box);
            }
            else 
                if (operation === "del" || operation === "delConfirm") {
                    result = delCheck(box);
                }
                else 
                    if (operation.match(MOVE_EXPR)) {
                        result = moveCheck(box, operation, isDetact);
                    }
            if (!result.pass) {
                result.resultCode = "warn";
            }
            return result;
        },
        /**
         * ���box�Ƿ���Դ���dst����,��Ҫ������ק����
         * @param {Object} box
         * @param {Object} dst
         */
        ddCheck: function(box, dst){
            if (!box.data("box-config")["movable"]) {
                return false;
            }
            return canIn(box, dst);
        }
    };
    
    // �༭���� ���ð���ܷ�༭
    function editCheck(box){
        var result = {};
        result.pass = box.data("box-config")["editable"];
        return result;
    }
    
    // ɾ������ ���ð���ܷ�ɾ��
    function delCheck(box){
        var result = {};
        result.pass = box.data("box-config")["deletable"];
        return result;
    }
    // �ƶ�����
    function moveCheck(box, moveOperation, isDetact){
        var result = {}, canMove = false, mo = moveOperation, config = box.data("box-config");
		isDetact = isDetact || false;
        result.pass = false;
        result.message = "��Ǹ��������֧��������";
        if (config && !config.movable) {
            return result;
        }
        if (mo === "move") {
            canMove = true;
        }
        else 
            if (mo === "up") {
                canMove = _upMoveCheck(box);
            }
            else 
                if (mo === "down") {
                    canMove = _downMoveCheck(box);
                }
                else 
                    if (mo === "left" || mo === "right") {
                        var dstRegion = BoxUtil.getDstRegion(box, mo), dstRegionName = dstRegion.name, dstRegionObj = dstRegion.obj;
                        
                        if (typeof dstRegionName !== "undefined") {
                            if (!dstRegionName || !canIn(box, dstRegionName)) {
                                return result;
                            }
                            if (!isDetact && exceedMaxCountInRegion(box, dstRegionObj)) {
                                result.message = "��Ǹ��������������ͬ��飬�����ٴ�����";
                                return result;
                            }
                            canMove = true;
                        }
                    }
        result.pass = canMove;
        return result;
    }
    
    function _upMoveCheck(box){
        var prevBox = BoxUtil.prevBox(box);
        return prevBox.length > 0 && prevBox.data("box-config")["movable"];
    }
    
    function _downMoveCheck(box){
        var nextBox = BoxUtil.nextBox(box);
        return nextBox.length > 0 && nextBox.data("box-config")["movable"];
    }
    
    /**
     * ���ݹ����жϣ���box�ܷ�����dstRegion��
     *
     * ʾ�� : "canIn" : "winport-content.p32-m0s5.*,winport-content.p32-s5m0.*"
     * ʾ�� : "canIn" : "winport-content.*.grid-sub"
     *           "canIn" : "winport-content.*.*"
     *           "canIn" : "winport-header.p32-m0.*"
     * 			 "canNotIn" : "winport-content.*.main-wrap"
     * ʾ�� : "canNotIn" : "*.p32-m0.*,*.p32-m0s5.main-wrap,*.p32-s5m0.main-wrap"
     * @param {Object} box
     * @param {Object} dstRegion
     */
    function canIn(box, dstRegion){
        var layout = BoxUtil.getComponentArea(box.closest("div.layout")), 
			segment = BoxUtil.getComponentArea(box.closest("div.segment")), 
			locationRule = box.data("location-rule") || initLocationRule(box);
        
        return matchCanIn(locationRule.canIn, segment, layout, dstRegion) && !matchCanNotIn(locationRule.canNotIn, segment, layout, dstRegion);
        
    }
    
    /**
     * ��ʼ��box��canIn �� canNotIn ����
     * @param {Object} box
     */
    function initLocationRule(box){
        var config = box.data("box-config"), canNotIn = config.canNotIn, canIn = config.canIn, locationRule = {
            canIn: parseLocationRule(canIn),
            canNotIn: parseLocationRule(canNotIn)
        };
        
        box.data("location-rule", locationRule);
        return locationRule;
    }
    
    /**
     * ��������
     * @param {Object} originalRule
     */
    function parseLocationRule(originalRule){
        var originalRuleList, transferredRuleList = [], transferredRule;
        if (typeof originalRule === "undefined" || originalRule === "") {
            return transferredRuleList;
        }
        
        originalRuleList = originalRule.split(",");
        
        for (var i = 0; i < originalRuleList.length; i++) {
        
            originalRule = originalRuleList[i].split(".");
            transferredRule = {};
            
            for (var j = 0; j < originalRule.length; j++) {
                var area = j === 0 ? "segment" : (j === 1 ? "layout" : "region");
                transferredRule[area] = originalRule[j];
            }
            
            transferredRuleList.push(transferredRule);
        }
        return transferredRuleList;
    }
    
    /**
     * ����segment-layout-region�ж��Ƿ�ƥ��canIn����
     */
    function matchCanIn(rule, segment, layout, region){
        if (rule === []) { //���ruleΪ�գ�����false
            return false;
        }
        return matchRule(rule, segment, layout, region);
    }
    
    /**
     * ����segment-layout-region�ж��Ƿ�ƥ��canNotIn����
     */
    function matchCanNotIn(rule, segment, layout, region){
        if (rule === []) { // ���ruleΪ�գ�����true
            return true;
        }
        return matchRule(rule, segment, layout, region);
    }
    
    /**
     * ����segment-layout-region�ж��Ƿ�ƥ��rule����
     * @param {Array} rule
     * @param {String} segment
     * @param {String} layout
     * @param {String} region
     */
    function matchRule(rule, segment, layout, region){
        var segmentMatch = false, layoutMatch = false, regionMatch = false, match = false;
        $.each(rule, function(i, ruleItem){
        
            segmentMatch = (ruleItem.segment === "*" || ruleItem.segment === segment);
            layoutMatch = (ruleItem.layout === "*" || ruleItem.layout === layout);
            regionMatch = (ruleItem.region === "*" || ruleItem.region === region);
            
            if (segmentMatch && layoutMatch && regionMatch) {
                match = true;
                return false;
            }
        });
        return match;
    }
    
    /**
     * ��dstRegion��ͬ����(cid)box�������Ƿ񳬳�������(�����Ƿ������жϣ�
     * @param {Object} box
     * @param {Object} dstRegion
     */
    function exceedMaxCountInRegion(box, dstRegion){
        var config = box.data("box-config"), cid = config.cid, singletonInRegion = config.singletonInRegion, dstCount = 0, exceed = false;
        $("div.mod-box", dstRegion).each(function(i, b){
            if (cid === $(b).data("box-config")["cid"] && singletonInRegion) {
                exceed = true;
                return false;
            }
        });
        return exceed;
    }
    
    WP.diy.BoxOperateChecker = BoxOperateChecker;
	
})(jQuery, Platform.winport);
