/**
 * @fileoverview ������wwͨ���߼�
 * 
 * @author long.fanl
 */
(function($, WP) {

	var WPAlitalk = {
		init : function(alitalkSelector){
			var docCfg = $("#doc").data("doc-config"),
			uid = docCfg.uid,
			isTP = docCfg.isTP,
			isTopDomain = docCfg.isTopDomain,
			xunpanUrl = docCfg.xunpanUrl,
			memberLevel = isTP ? "PM" : "COMMON",
			companyId = docCfg.companyId;
			
			FE.util.alitalk(alitalkSelector);
			
			alitalkSelector.mousedown(function(ev){
				aliclick(this,"?tracelog=wp_infowidget_alitalk");
				aliclick(this,"?info_id="+companyId);
				traceXunpanLog(this,uid,"","",isTopDomain,xunpanUrl);
				traceParrotStatLog(this,"alitalk",uid,"athena",memberLevel,isTopDomain);
				return false;
			});
		}
	};
	
	/**
	 * ѯ�̴��
	     param toId        seller memberId
	     param offerId     offer id
	     param sourceUrl   offer detail url
	    */
	function traceXunpanLog(obj, toId, offerId, sourceUrl,isTopDomain,xunpanUrl){
	    if(isTopDomain){
			xunpanInfo(obj, "true", xunpanUrl, toId, offerId, sourceUrl);
		}else{
			xunpanInfo(obj, "false", "", toId, offerId, sourceUrl);
		}
	}
	
	/**
	 ����¼tracelog�İ�װ����
	 param toid        ���շ��Ļ�Աid
	 param categoryId  ��Ŀid
	 param fromid      ���ͷ��Ļ�Աid
	 param sourcetype  Դ����
	 param tracelog    tracelog
	*/
	function traceParrotStatLog(obj, type, toid, sourcetype,memberLevel,isTopDomain){
	    var param = "";
		param = param + "?type=" + type;
		param = param + "&sourcetype=" + sourcetype;
		param = param + "&toid=" + toid;
		param = param + "&memberLevel=" + memberLevel;
		logStatInfo(obj, param,isTopDomain);
		return true;
	}
	
	/**
	    �����߼�
	*/
	function logStatInfo(obj, param,isTopDomain){
	    d = new Date();
	    if(document.images) {
			var domainType = isTopDomain ? "www" : "";
			var cosite = "";
			try{ 
		        cosite = document.cookie.match(/track_cookie[^;]*cosite=(\w+)/)[1]; 
		    }catch(e){}
	
			var digurl = "http://stat.china.alibaba.com/feedback/click.html";
		    if(cosite.length > 0){
		 		    param = param + "&fromsite=" + cosite;
			    }
			if(domainType.length > 0){
		 		    param = param + "&domainType=" + domainType;
			    }
			
			logurl =digurl + param + "&time=" + d.getTime();
			try{
				(new Image()).src = logurl;
			}catch(e){}
	    }
	    return true;
	}
	
	WP.mod.unit.WPAlitalk = WPAlitalk;

})(jQuery, Platform.winport);
//~
