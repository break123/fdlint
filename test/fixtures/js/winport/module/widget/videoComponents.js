/*
* ��Ƶ����ͨ�����
* ��ȡ��Ƶ����
* @param {url,callback}  url��Ƶ�����ַ callback�ص�
* @author deming.wei
*/
(function($, WP) {
var VasVideoData = function(){
	}
	VasVideoData.prototype = {
		// TOOD rename
		RequestData:function(url,callback){
		jQuery.ajax({
				url:url+"?t="+new Date().getTime(),
				dataType:'script',
				type:'get',
				complete:function(){
					callback && callback(window.resultdata);
				},
				error: function(){
				}
			});
		 
		}
	}
var VasVideoDataList = new VasVideoData();
/**
 * ��Ƶ����ͨ�����
 * @param {num}  ��Ƶչʾ����
 * @param {url}  ��Ƶ�����ַ
 * @param {data} ��Ƶ����
 * @param {type} �Ѿ���Ƶ�������� id,vid(Default)
 * @param {videoUsed}  �Ѿ�ʹ����ƵvideoUsed
 * @param  ������·��Platform.winport.widget
*/
	var InsertVideo = function(obj){
		this.init.apply(this, arguments);
	};
	InsertVideo.prototype={
		init:function(obj){
			var SELF = this;

			this.num = obj.num;
			this.data = obj.data;
			if(obj.type == "id"){
				this.type = 2;
			}else{
				this.type = "" ;
			}

			this.videoUsed = obj.videoUsed;
			this.insert =obj.insert

			function a(c){
				SELF.data = c;
				SELF._init();
			};
			this.data.RequestData(this.data.config.url,a);

		},
		_init:function(data){
			var SELF = this;
			var videoList = this.data;
			if(videoList.isSuccess=="true"){
				SELF.VideoRender(videoList);
			}else{
				alert(videoList.data.message);
			}
			},
		bind:function(){
			var SELF = this;
			$('.vas_videoComponents_insert').bind('click',function(){
				if(this.getAttribute("Status") == "refused"||this.innerHTML == "�Ѳ�����Ƶ"){
					return false;
				} else {
					if(SELF.insertVideo(this.getAttribute("vid"+SELF.type))){
						SELF.insert(SELF.insertVideo(this.getAttribute("vid"+SELF.type)));
					}
				}
			});
			$(".vas_videoComponents_myvideo_video").bind('mouseover',function(){
				$(this).addClass('vas_videoComponents_bg');
			});
			$(".vas_videoComponents_myvideo_video").bind('mouseout',function(e){
				var e = e || window.event, relatedTarget = e.toElement || e.relatedTarget;
				while(relatedTarget && relatedTarget != this)
					relatedTarget = relatedTarget.parentNode;
				if(!relatedTarget){
					$(this).removeClass('vas_videoComponents_bg');
				}
			});
		},
		insertVideo:function(vid){
			var SELF = this;
			var EL = $('.vas_videoComponents_insert'),
				EL2 = $('.vas_videoComponents_myvideo_video');
			for (i = 0 ; i<EL.length; i++){
				EL[i].innerHTML = $(EL[i]).attr("vid"+SELF.type)==vid?"�Ѳ�����Ƶ":$(EL[i]).attr("Status")=="refused"?"":"������Ƶ";
				if(EL[i].innerHTML == "�Ѳ�����Ƶ"){
					var a = SELF.data.data[i];
					$(EL2[i]).addClass("vas_videoComponentsbg");
				}else{
					if(EL[i].innerHTML == ""){
						$(EL[i]).addClass("vas_videoComponentbg2");
					}
					$(EL2[i]).removeClass("vas_videoComponentsbg");
				}
			}
			return a;
		},
/**
 * ��Ƶ����ͨ�������������Ƶ���״̬�����
 * @param {approved}
 * approved:�ɹ� init:����� refused:���ʧ��
*/
		checkapproved:function(approved){
			var a = [];
			if(approved.auditStatus=="approved"){
				a.push('<li>');
				a.push('<object id="video_player" type="application/x-shockwave-flash" data="http://player.ku6.com/refer/'+approved.videoInfo.id+'/v.swf&amp;auto=0&amp;deflogo=0&amp;adss=0&amp;jump=0&amp;fu=1&amp;recommend=0" height="194" width="200">');
				a.push('<!--[if lt IE 9.0]><param name="movie" value="http://player.ku6.com/refer/'+approved.videoInfo.id+'/v.swf&amp;auto=0&amp;deflogo=0&amp;adss=0&amp;jump=0&amp;fu=1&amp;recommend=0"><![endif]-->');
				a.push('<param name="quality" value="high">');
				a.push('<param name="allowScriptAccess" value="always">');
				a.push('<param name="allowFullScreen" value="true">');
				a.push('<param name="wMode" value="Transparent">');
				a.push('<param name="swLiveConnect" value="true">');
				a.push('<param name="flashvars" value="">');
				a.push('<video controls height="194" width="200" src="http://v.ku6.com/fetchwebm/'+approved.videoInfo.id+'.m3u8"></video>');
				a.push('</object></li>')
			}else{
				a.push('<li style=" position:relative">');
				a.push('<img src="http://img.s.aliimg.com/vaspool/video/images/pic_01.jpg" width="200" height="194" />');
				a.push('<ul class="vas_videoComponents_fail clearFix">');
				if(approved.auditStatus=="init"){
				a.push('<li class="vas_videoComponents_failicon1"></li>');
				a.push('<li class="vas_videoComponents_failmsg">��Ƶ�����...<br />��ɺ���Զ���ʾ</li>');
				}else if(approved.auditStatus=="refused"){
				a.push('<li class="vas_videoComponents_failicon"></li>');
				a.push('<li class="vas_videoComponents_failmsg">��Ƶ'+approved.refuseMessage+'<br />��˲�ͨ��</li>');
				}
				a.push('</ul></li>')
			}
			return a.join('')
		},
		VideoRender:function(videoList){
			var SELF = this;
			var b = [];
				b.push('<div class="vas_videoComponents_myvideo">');
				b.push('<div class="vas_videoComponents_myvideo_T clearFix">');
				b.push('<h2>�ҵ���Ƶ</h2><h2 class="vas_videoComponents_myvideo_C">');
				b.push('<p>���������ϴ�<span class="vas_videoComponents_myvideo_N">'+this.num+'</span>����Ƶ�����ϴ�<span class="vas_videoComponents_myvideo_N" id="offervideoNum">'+videoList.data.length+'</span>����Ƶ</p>');
				b.push('<span class="vas_videoComponents_check"><a href="'+this.data.basePath+'" target="_blank" id="offer_video_upload">�ϴ���Ƶ</a></span>');
				b.push('</h2></div>');
			if(videoList.data==undefined||resultdata.data.length==0){
			//����Ƶ����
				b.push('<div class="vas_videoComponents_myvideo_videoList clearFix">');
				b.push('<p class="vas_videoComponents_myvideo_novideo">�㻹û���ϴ���Ƶ����������<a href="'+this.data.basePath+'" target="_blank" style="color:#ff7300;">��Ƶ����</a>���ϴ���Ƶ</p></div>');
			}else{
			//����Ƶ����
				b.push('<div class="vas_videoComponents_myvideo_trip clearFix" id="offer_Tips">');
				b.push('<p>��ܰ��ʾ���ɲ�������е���Ƶ����Ƶ���ͨ�����ڲ����ҳ�����Զ�չʾ��</p>');
				b.push('</div><div class="vas_videoComponents_myvideo_videoList clearFix">');
				for(var i = 0;i<videoList.data.length; i++){
					b.push('<div class="vas_videoComponents_myvideo_video"><ul>');
					b.push(SELF.checkapproved(videoList.data[i]));
					b.push('<li class="vas_videoComponents_myvideo_videoName">'+resultdata.data[i].fileName+'</li>');
					b.push('<li class="vas_videoComponents_myvideo_videoRevise">');
					b.push('<a href="javascript:void(0);" class="vas_videoComponents_insert" hidefocus="true" Status="'+videoList.data[i].auditStatus+'" vid="'+resultdata.data[i].videoInfo.id+'" vid2="'+resultdata.data[i].id+'">������Ƶ</a>');
					b.push('</li></ul></div>');
				}
			}
			b.push('</div></div>');
			$('#vas_videoComponents_wrap').html(b.join(''));
			SELF.insertVideo(SELF.videoUsed);
			this.bind();
		}
	}

WP.widget.InsertVideo = InsertVideo;
WP.widget.VasVideoDataList = VasVideoDataList;

})(jQuery, Platform.winport);
