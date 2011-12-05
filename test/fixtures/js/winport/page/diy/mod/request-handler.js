/**
 * @fileoverview �����������߼�
 * @author long.fanl
 */
(function($,WP){
	var ModContext = WP.ModContext,
		Util = WP.Util,
		FormUtil = WP.widget.FormUtil,
		ModBox = WP.diy.ModBox,
		WPD = WP.diy,
		Diy = WPD.Diy,
		Util = WP.Util,
		Component = WPD.Component,
		Msg = WPD.Msg,
		
		// doc�� config������_csrf_token��
		docCfg,
		_csrf_token,
		
		// page�� config������ pageSid,pageCid��
		content,
		contentCfg,
		pageSid,
		pageCid,
		editFormUrl, // ��ȡ�����á���url
		getBoxUrl, // ��ȡһ�����(box)��url
		saveLayoutUrl, // ���桰���֡�url
		
		// regionMap ������̨��Ҫ��һ��ӳ��
		regionMap = {
			"main-wrap":"MAIN",
			"grid-sub":"SIDE",
			"grid-extra":"EXTRA"
		},
		
		//ҳ�沼���Զ����涨ʱ��
		lastPageLayout = null,
		
		pageLayoutChanged = false,
		
		pageLayoutTimer = null,
		
		pageLayoutSaveInterval = 2000,
		
		pageLayoutHasSaved = true,
		
		//�Զ�����ʽ�Զ����涨ʱ��
		customStyleTimer = null,
		
		customStyleSaveInterval = 500;
		
		
		/**
		 * RequestHandler����DIY��̨ǰ�˺ͺ�̨֮�佻����������
		 * ����ΪUtil��,������ҵ���߼�
		 * @param {Object} box
		 */
		var RequestHandler = {
			
			init: function(){
				
				docCfg = $("#doc").data("doc-config");
				_csrf_token = docCfg._csrf_token;
				content = $("#content");
				contentCfg = content.data("content-config");
				pageSid = contentCfg.sid;
				pageCid = contentCfg.cid;
				
				// ��ȡ�����á�form��url, �μ� getEditFormUrl
				editFormUrl = contentCfg.editFormUrl;
				
				// ��ȡһ���������(box)��url
				getBoxUrl = contentCfg.getBoxUrl;

				// ���桰���֡�url
				saveLayoutUrl = contentCfg.saveLayoutUrl;
				
				lastPageLayout = Component.getPageLayout();
			},
			
			/**
			 * ��ȡһ��box����
			 * @param {Object} box
			 */
			getBox: function(box){
				ModBox.reload(box);
			},
			
			/**
			 * ���¸�box������(�������ݺ����)
			 * @param {Object} box
			 */
			updateBox : function(box){
				this.getBox(box);
			},
			
			/**
			 * ���¼��ظ�box������(�����ƶ����ʱʹ��)
			 * @param {Object} box
			 */
			reloadBox : function(box){
				this.getBox(box);
			},
			
			/**
			 * ��ȡ������ñ���url
			 * @param {Object} box
			 */
			getEditFormUrl : function(box){
				return editFormUrl + "-" + pageSid + "-" + box.data("box-config").sid + ".htm?__envMode__=EDIT";
			},
			
						
			/**
			 * ɾ��һ�����,��ҳ�沼��һ�𱣴�
			 * @param {Object} boxId
			 */
			delBox : function(sid,cid){
				// ����Ҫɾ����boxSid
//				delList.push(sid);
				// ����ɾ������ ͬʱҲ�ᱣ��ҳ�沼��, �����Ҫȡ����pageLayoutTimer
				if ( pageLayoutTimer ) {
		            clearTimeout(pageLayoutTimer);
		        }
				var pageLayout = Component.getPageLayout(),
				idObj = {}; idObj[sid] = cid;
				// Ȼ��ֱ�ӷ���,��ʱ����
				Diy.authAjax(saveLayoutUrl,{
					type: "POST",
					data: {
						_csrf_token:_csrf_token,
						version : contentCfg.version,
						pageSid : contentCfg.sid,
						pageContent : pageLayout,
						delList : '[{'+sid+':"'+cid+'"}]'
					},
					dataType : "json",
					success : function(result){
						if(result.success){
							$(window).trigger('diychanged', { type: 'del-box' });
							++contentCfg.version;
							if(pageLayoutChanged){
								Msg.info("�ƶ����ɹ�");
							}
							Msg.info("ɾ�����ɹ�");
							
							pageLayoutChanged = false;
						}else{
							if(result.data && result.data === "VERSION_EXPIRED"){
								window.location.reload();
								return;
							}
							Msg.error("ɾ�����ʧ�ܣ���ˢ�º�����");
						}
					}
				});
			},
			/**
			 * ����ҳ�沼��(�ӳٱ���)
			 * @param {Object} box
			 * @param {Object} operation
			 */
			savePageLayout : function(){
		        sendPageLayout();
			}
			
		}
		
		function sendPageLayout(){
			// 5�������в���,���¼�ʱ
	        if ( pageLayoutTimer ) {
				pageLayoutChanged = true;
	            clearTimeout(pageLayoutTimer);
	        }
	        pageLayoutTimer = setTimeout(function() {
				
				pageLayoutHasSaved = false;
				
				var pageLayout = Component.getPageLayout();
				if(pageLayout !== lastPageLayout){
					lastPageLayout = pageLayout;
					Diy.authAjax(saveLayoutUrl,{
						type: "POST",
						data: {
							_csrf_token:_csrf_token,
							version:contentCfg.version,
							pageSid : contentCfg.sid,
							pageContent : pageLayout,
							delList :  "[]"
						},
						dataType : "json",
						success : function(result){
							if(result.success){
								$(window).trigger('diychanged', { type: 'move-box' });
								++contentCfg.version;
								Msg.info("�ƶ����ɹ�");
							}else{
								if(result.data && result.data === "VERSION_EXPIRED"){
									window.location.reload();
									return;
								}
								Msg.error("�ƶ����ʧ�ܣ���ˢ�º�����");
							}
							pageLayoutHasSaved = true;
						}
					});
				}
	        }, pageLayoutSaveInterval);
		}
		
		WPD.RequestHandler = RequestHandler;
		
		WP.PageContext.register('~RequestHandler', RequestHandler);
		
})(jQuery,Platform.winport);
