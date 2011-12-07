/**
 * @fileoverview �Ƽ������
 * 
 * @author long.fanl
 */
(function($, WP) {
	
	var UI = WP.UI,
		Util = WP.Util,
		isIE67=$.util.ua.ie67,
		Paging = WP.widget.Paging,
		NO_PHOTO_PIC_150,
		NO_PHOTO_PIC_64,
		NO_COVER_PIC_150,
		NO_COVER_PIC_64,
		LOCK_PIC_150,
		LOCK_PIC_64,
		uid,
		recommendAlbumListUrl,
		albumTemplate = null,
		albumLink = null,
		imageServer = null,
		linkUrl,
		unionData = [];  // �ص���������
	
	
	function BaseAlbumMod() {
		this.init.apply(this, arguments);
	}
	
	BaseAlbumMod.prototype = {
		init : function(context,config, inrefresh){
			this.context = context;
			this.config = config;
			this.inMainRegion = $(context).closest("div.region").hasClass("main-wrap");
			var self = this,
				content = $("div.m-content",context);
				
			UI.showLoading(content);
			unionData.push({
				context: context,
				config: config,
				callback: function(albumsJson){
					if (albumsJson.result === "success") {
						if (albumsJson.dataList[config.albumName].length === 0) {
							showEmpty(content);
							return;
						}
						self.renderAlbumList(albumsJson);
						// ���������������Ҫ����
						if (!self.inMainRegion) {
							resizeSubAlbums(context);
						}
						// ���DIY��̨��ק/�ƶ�ʱ��resize bug
						if (isIE67) {
							var box = $(context).closest("div.mod-box");
							$("div.box-shim", box).height(box.height() - 8);
						}
						// �����Ҫ��ҳ������pagesize���ɷ�ҳ
						if (config.needPaging) {
							// ��һ������ ��Ȼ�ǵ�һҳ
							$("ul.album-list-main",context).addClass("album-page-1");
							self.pagingAlbumList(albumsJson, config.pageSize, context);
						}
					}else {
						showError(content);
					}
				},
				error: function(){
					showError(content);
				}
			});

			inrefresh && loadAlbums();
		},
		
		// ��Ⱦ����б�
		renderAlbumList : function(albumsJson){
			var content = $("div.m-content",this.context),
				albumsData = {},
				end =  this.config.end;
				
			albumsData.albumList = albumsJson.dataList[this.config.albumName];
			
			// end��pageSize�������
			if (end) {
				albumsData.albumCount =(albumsData.albumList.length < end) ? albumsData.albumList.length : end;
			} else {
				albumsData.albumCount = albumsData.albumList.length;
			}
			albumsData.inMainRegion = this.inMainRegion;
			albumsData.className = this.inMainRegion ? "album-list-main" : "album-list-sub";
			
			content.html(initAlbumListTemplate(albumsData));
		},
		
		// Ϊ�����Ŀҳ���ɷ�ҳ
		pagingAlbumList: function(albumsJson, pageSize, context){
			var self = this,
				content = $("div.m-content", context);
				modPaging = new Paging(content,{
					css: {
						className: "wp-album-paging"
					},
					pageClick: function(pnum){
						doPaging(pnum, self.context, self.config, self.inMainRegion);
					},
					pageSubmit: function(pnum){
						doPaging(pnum,self.context, self.config, self.inMainRegion);
					}
				});
				
		    modPaging.init(1, pageSize, albumsJson.total);
		}
	};
	
	// �Բ������ͼƬ��������
	function resizeSubAlbums(context){
		var imgs = $('div.cover img', context);
		UI.resizeImage(imgs, 64);
	}
	
	// ��������б��ĳһҳ
	function doPaging(pageNum, context, config, inMainRegion){
		
		var thePage = $("ul.album-page-"+pageNum,context);
		// ���thePage�Ѿ��������ֱ����
		if(thePage.length > 0){
			$("ul.album-list-main",context).not(thePage).hide();
			thePage.fadeIn("slow");
			return;
		}
		
		var pagingParams = constructPagingParams(config.pageSize, pageNum),
			content = $("div.m-content", context);
		
		$.ajax(recommendAlbumListUrl, {
			type: "GET",
			dataType: "script",
			data : pagingParams,
			success:function(){
				var albumsJson = window[pagingParams.jsResponseDataName];
				// ���IE��script����δ������Ȼ���ߵ�success�߼�������
				if(!albumsJson){
					showError(content);
					return;
				}
				
				if(albumsJson.result === "success"){
					var albumList = albumsJson.dataList[config.albumName];
					if(albumList.length === 0){
						showEmpty(content);
						return;
					}
					
					var albumListMain = $("ul.album-list-main",context),
						albumsData = {
							albumList: albumList,
							albumCount: albumList.length,
							inMainRegion: inMainRegion,
							className: inMainRegion ? "album-list-main" : "album-list-sub"
						};
					
					var newPage = $(initAlbumListTemplate(albumsData));
					newPage.addClass("album-page-"+pageNum).hide();
					// ��֤cache��album�ڵ㲻����5��
					if($("ul.album-list-main",context).length >=5){
						$("ul.album-list-main:first",context).remove(); // FIFO
					}
					// ����album�ڵ�嵽��� ���Գ���
					$("ul.album-list-main",context).hide();
					$("ul.album-list-main:last",context).after(newPage);
					newPage.fadeIn("slow");
				} else {
					showError(content);
				}
			},
			
			error: function() {
				showError(content);
			}
		});
		return false;
	}
	
	// ���췭ҳ�������
	function constructPagingParams(pageSize, pageNum){
		return {
			memberId: uid,
			jsResponseDataName: "albumList" + new Date().getTime(),
			hasAlbums: true,
			start: (pageNum - 1) * pageSize +1,
			end: pageNum * pageSize
		};
	}
	
	// ��ʼ������б�ģ��
	function initAlbumListTemplate(albumsData){

		return FE.util.sweet(
			'<ul class="<%= className %>">\
				<% for (var i=0; i< albumCount; i++) { %>\
					<% var album = this.initAlbumData(albumList[i]);%>\
					<li>\
						<div class="cover">\
						<% var albumTitle = this.escape(album.title); %>\
							<a target="_blank" href="<%= album.link %>" title="<%= albumTitle %>"><img alt="<%= albumTitle %>" src="<%= album.cover %>"></a>\
							<div class="cover-label"></div>\
						</div>\
						<div class="title">\
							<a target="_blank" title="<%= albumTitle %>" href="<%= album.link %>"><%= $util.escape(album.subTitle) %></a>\
						</div>\
						<div class="count">\
							<%= album.count %>��ͼƬ\
						</div>\
					</li>\
				<% } %>\
			</ul>').applyData(albumsData, {
				initAlbumData: albumsData.inMainRegion ? initMainAlbumData: initSubAlbumData,
				escape : Util.escape
			});
	}
	
	// ��ʼ���������������
	function initMainAlbumData(album){
		// ������
		album.cover = (album["lock"] === 1) ? LOCK_PIC_150 : // ˽����� ��ʾ������ͼƬ��\
								(album["coverId"] !== null) ? album["coverSumm"].replace(".summ.jpg",".search.jpg") : // ��������ʾ��150������ͼƬ\
								(album["count"] === 0) ? NO_PHOTO_PIC_150 : NO_COVER_PIC_150;// �޷�������ͼչʾno_photo.gif���޷��浫��ͼչʾno_cover.gif\
		
		album.coverWidth = album.coverHeight = 150;
		// �������
		album.link = albumLink.replace("(ALBUM_ID_PLACEHOLDER)",album["id"]);
		album.subTitle = album["title"];
		
		return album;
	}
	
	// ��ʼ��������������
	function initSubAlbumData(album){
		// ������
		album.cover = (album["lock"] === 1) ? LOCK_PIC_64 : // ˽����� ��ʾ������ͼƬ��\
								(album["coverId"] !== null ) ?  album["coverSumm"] : // �������ʾ��100������ͼƬ��������Ϊ64���\
								(album["count"] === 0) ? NO_PHOTO_PIC_64 : NO_COVER_PIC_64;// �޷�������ͼչʾno_photo.gif���޷��浫��ͼչʾno_cover.gif\
		
		album.coverWidth = album.coverHeight = 64;
		// �������
		album.link = albumLink.replace("(ALBUM_ID_PLACEHOLDER)",album["id"]);
		// �������ȡ�����⣨42���ַ� ��3�У�
		var title = album["title"];
		album.subTitle = (Util.lenB(title) > 42) ? (Util.cut(title,40)+"..") : title;
		
		return album;
	}
	
	// ��ҳ������mod׼����Ϻ���һ��������ȡ����б������
	WP.ModContext.bind('nodeallready', loadAlbums);
	
	// ��ҳ������mod׼����Ϻ���һ��������ȡ����б������
	function loadAlbums() {
		if(unionData.length <= 0){
			return;
		}
		initGlobalParams(unionData[0].config);
		
		var unionParams = constructUnionParams();
		$.ajax(recommendAlbumListUrl,{
			type:"GET",
			dataType:"script",
			timeout: 20000,
			data : unionParams,
			success:function(){
				var albumsJson = window[unionParams.jsResponseDataName];
				// ���IE��script����δ������Ȼ���ߵ�success�߼�������
				if(!albumsJson){
					$.each(unionData, function(i,data){
						data.error();
					});
					return;
				}
				$.each(unionData, function(i,data){
					data.callback(albumsJson);
				});
				unionData = [];
			},
			
			error: function() {
				$.each(unionData, function(i, data){
					data.error();
				});
			}
		});
	}
	
	function initGlobalParams(config){
		var docCfg = $("#doc").data("doc-config");
		
		albumLink = config.albumLink;
		recommendAlbumListUrl = config.recommendAlbumListUrl;
		imageServer = docCfg.imageServer;
		uid = docCfg.uid;
		
		NO_PHOTO_PIC_150 = NO_PHOTO_PIC_150  ? NO_PHOTO_PIC_150 : imageServer+"/images/app/platform/winport/mod/albums/no-photo-150.gif";
		NO_PHOTO_PIC_64 = NO_PHOTO_PIC_64  ? NO_PHOTO_PIC_64 : imageServer+"/images/app/platform/winport/mod/albums/no-photo-64.gif";
		NO_COVER_PIC_150 = NO_COVER_PIC_150  ? NO_COVER_PIC_150 : imageServer+"/images/app/platform/winport/mod/albums/no-cover-150.gif";
		NO_COVER_PIC_64 = NO_COVER_PIC_64  ? NO_COVER_PIC_64 : imageServer+"/images/app/platform/winport/mod/albums/no-cover-64.gif";
		LOCK_PIC_150 = LOCK_PIC_150  ? LOCK_PIC_150 : imageServer+"/images/app/platform/winport/mod/albums/lock-150.gif";
		LOCK_PIC_64 = LOCK_PIC_64  ? LOCK_PIC_64 : imageServer+"/images/app/platform/winport/mod/albums/lock-64.gif";
	}
	
	// ���������������
	function constructUnionParams(){
		var maxAlbumsCount = 0,
			params = {
				memberId: uid,
				jsResponseDataName: "albumList"+new Date().getTime()
			};
		
		$.each(unionData,function(i, data) {
			var cfg = data.config;
			
			if (cfg.hasRecAlbums) {
				params.hasRecAlbums = true;
				params.recommendAlbumIds = cfg.recommendAlbumIds; // �Ƽ����Ŀǰ��һ��
			}
			if (cfg.hasAlbums) {
				params.hasAlbums = true;
				params.start = 1;
				if (cfg.end > maxAlbumsCount) {
					maxAlbumsCount = params.end = cfg.end; // ֻ���¼�����������
				}
			}
		});
		return params;
	}
		
	// ��ʾ��������İ�
	function showEmpty(content){
		content.html('<p class="empty-album">�������</p>');
	}
	// ��ʾ�쳣��Ϣ
	function showError(content){
		content.html('<p class="album-error">���緱æ����ˢ�º�����</p>');
	}
	
	/**
	 * ����б���
	 */
	WP.ModContext.register('wp-albums',BaseAlbumMod);
	
	/**
	 * �Ƽ������
	 */
	WP.ModContext.register('wp-recommend-albums',BaseAlbumMod);
	
	/**
	 * ����б���Ŀҳ�����
	 */
	WP.ModContext.register('wp-albums-column',BaseAlbumMod);
	
})(jQuery, Platform.winport);
//~
