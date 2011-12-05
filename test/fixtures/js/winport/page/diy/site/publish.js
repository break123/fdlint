/**
 * @fileoverview ����
 * 
 * @author long.fanl
 */

(function($,WP){
	
var WPD = WP.diy,
	Diy = WPD.Diy,
	Util = WP.Util,
	Msg = WPD.Msg,
	Dialog = WP.widget.Dialog,
	
	docCfg,
	contentCfg,
	isHomepage, // �Ƿ���ҳ
	needSyncSide, // �Ƿ�ͬ����������ҳ��
	publishDialogContent, // �����Ի�������
	publishSuccessDialogContent, // �����ɹ��Ի�������
	publishFailedDialogContent; // ����ʧ�ܶԻ�������


var SitePublish = {
	
	init:function(){
		var self = this;
		
		docCfg = $("#doc").data("doc-config");
		contentCfg = $("#content").data("content-config");
		isHomepage = contentCfg.isHomepage;
		$("#header div.setting-bar a.publish").click(function(e){
			e.preventDefault();
			self._openPublishDialog();
			return false;
		});
		
		$("#header div.setting-bar a.backup-tool-item").click(function(e){
			e.preventDefault();
			//���ÿ�� ����ģ��
			WP.diy.Template.backup({
				success:function(){
					//��������ҳ�棬�л�������tabҳ
					Platform.winport.SettingContext.loadPage(2,{"showBackup":true});
				},
				error:function(message){
					Msg.error('����ģ��ʧ�ܣ���ˢ�º����ԡ�');
				}
			});
			return false;
		});
	},
	
	// �򿪷����Ի���
	_openPublishDialog:function(){
		publishDialogContent = publishDialogContent || 
				this._getPublishAreaContent("textarea.site-publish");
		
		var self = this;
		
		this.publishDialog = Dialog.open({
			header: '����',
			className: 'publish-dialog',
			hasClose: false,
			buttons: [
				{
					'class': 'd-confirm',
					value: 'ȷ�Ϸ���'
				},
				{
					'class': 'd-cancel',
					value: 'ȡ��'
				}
			],
			draggable : true,
				
			content : publishDialogContent,
			
			contentSuccess : function(dialog){
				dialog = dialog.node;
				
				// checkbox���У���ʾ��ͬ�����á�
				$("#sync-page").change(function(){
					
					if($(this)[0].checked){
						$("a.sync-setting",dialog).css("display","inline-block");
						var syncSettingPanel = $("div.sync-setting-panel",dialog);
						// ����Ѽ��ء�ͬ���б���壬��ѡ�����е�checkbox
						if(syncSettingPanel.length > 0){
							$(".input-checkbox",syncSettingPanel).each(function(i,checkbox){
								checkbox.checked = true;
							});
						}
					}else{ // ȡ�������ء�ͬ�����á��͡�ͬ���б�
						$("a.sync-setting",dialog).css("display","none");
						$("div.sync-setting-panel",dialog).css("display","none");
					}
				});
				
				//��ͬ�����á���ť�������ʾ��ͬ���б�
				$("a.sync-setting",dialog).click(function(ev){
					ev.preventDefault();
					var settingWrap = $("div.sync-setting-wrap",dialog),
					syncPageList = $("div.sync-setting-panel",dialog);
					
					if(syncPageList.length === 0 && !settingWrap.data("hasPageList")){
						self._getSyncPageList(settingWrap);
					}
					
					$("div.sync-setting-panel",dialog).css("display","block");
				});
			},
			
			confirm : function(dialog){
				self._publish($("form", dialog.node));
			}
		});
	},
	
	/**
	 * ����textarea selector��ȡ����[�ɹ�|ʧ��]������
	 */
	_getPublishAreaContent: function(selector){
		var textarea = $(selector),
			content = textarea.val();
		textarea.remove();
		return content;
	},
	
	/**
	 * ��ȡ����ͬ���ļ۸��б�
	 */
	_getSyncPageList: function(settingWrap){
		var self = this,
			listSyncPageUrl = docCfg.listSyncPageUrl;
		
		settingWrap.data("hasPageList", true);
		
		$.ajax(listSyncPageUrl, {
			cache: false,
			success: function(result){
				self.syncPageList = $(result);
				$(result).insertAfter(settingWrap);
			},
			error: function(){
				Msg.warn("���緱æ����ˢ�º�����");
			}
		});
	},
	
	// ���ͷ�������
	_publish: function(form){
		var self = this,
			publishSiteUrl = docCfg.publishSiteUrl+"?_input_charset=UTF-8",
			syncPageList = [],
			formData = form.serializeArray();
		
		self.publishDialog.showLoading("���ڷ���..");
		needSyncSide = $('input[name="is-sync-page-side"]', form).prop('checked');

		$(formData).each(function(i,v){
			if(v.name === "sync-page"){
				syncPageList.push(parseInt(v.value, 10));
			}
		});
		var syncSettingPanel = $("div.sync-setting-panel",form);
		// ���ѡ���ˡ�ͬ��������������ǡ�ͬ���б�Ϊ�գ�����Ҫͬ��
		if(needSyncSide && syncSettingPanel.length > 0 && syncPageList.length === 0){
			needSyncSide = false;
		}
		
		Diy.authAjax(publishSiteUrl, {
			type: "POST",
			data: {
				_csrf_token: docCfg._csrf_token,
				pageSid: contentCfg.sid,
				needSyncSide : needSyncSide,
				syncPageList : JSON.stringify(syncPageList)
			},
			
			dataType:"json",
			
			timeout: 20000,  // ��ͬ��ҳ��Ƚ϶࣬Ҫͬ���İ��Ƚ϶�ʱ����̨�����Ƚ����������ʱ�賤20��
			
			success : function(result){
				self.publishDialog.close();
				if (result.success){
					self._publishSuccess(result);
				} else {
					self._publishFailed();
				}
			},
			error : function(){
				self.publishDialog.showLoading(false);
				Msg.warn("���緱æ����ˢ�º�����");
			}
		});
	},
	
	// �򿪷����ɹ��Ի���
	_publishSuccess:function(result){
		
		if(!publishSuccessDialogContent){
			publishSuccessDialogContent = this._getPublishAreaContent("textarea.site-publish-success");
		}
		
		Dialog.open({
			header: '����',
			className: 'publish-success-dialog',
			
			content : publishSuccessDialogContent,
			draggable: true,
			contentSuccess : function(dialog){
				// �鿴��������
				$("a.open-wp",dialog.node).click(function(e){
					dialog.close();
					if(!isHomepage && needSyncSide){
						window.location.reload();
					}
				});
				// ����
				$("a.back-diy",dialog.node).click(function(e){
					e.preventDefault();
					dialog.close();
					// ���������ҳ ����ѡ����Ҫͬ������� Ϊ�ˡ�ͬ�����¡����� ���ص�ǰҳ��
					if(!isHomepage && needSyncSide){
						window.location.reload();
					}
					return false;
				});
				
				var resultData = result.data,
					errList = null,msgList = "";
				// ����20�����ʾ
				if (resultData && (errList = resultData.MAX_WIDGETS_ERR)) {
					if(errList.length > 0 ){
						msgList += "<li>"+errList.join("��")+errList.length+"��ҳ��ͬ���󳬹�20����飬ͬ��ʧ�ܣ���ɾ�����ֲ�����������ԣ�</li>";
					}
				}
				// ����������ʾ
				if (resultData && (errList = resultData.OTHER_ERR)) {
					if(errList.length > 0 ){
						msgList += "<li>"+errList.join("��")+errList.length+"��ҳ��ͬ��ʧ�ܣ�</li>";
					}
				}
				
				if(msgList !== ""){
					$("<ul>",{
						"class" : "pub-result-msg"
					}).html(msgList).insertAfter($("p.d-msg",dialog));
				}
			}
			
		});
	},
	// �򿪷���ʧ�ܶԻ���
	_publishFailed : function(){
		
		if(!publishFailedDialogContent){
			publishFailedDialogContent = this._getPublishAreaContent("textarea.site-publish-failed");
		}
		
		var self = this;
		
		Dialog.open({
			header: '����',
			className: 'publish-failed-dialog',
		
			content : publishFailedDialogContent,
			
			contentSuccess : function(dialog){
				// ����
				$("a.back-diy",dialog.node).click(function(e){
					e.preventDefault();
					dialog.close();
					return false;
				});
			}
			
		});
	}
};
	

WP.PageContext.register('~SitePublish', SitePublish);


})(jQuery,Platform.winport);
