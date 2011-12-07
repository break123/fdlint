/**
 * �ҵ�ģ��
 * @author chao.xiuc
 */
(function($, WP) {

var Tabs = WP.widget.Tabs,
	 Msg = WP.diy.Msg,
	 Template = WP.diy.Template;
	
var TemplatePagePersonal = {
	
	init: function(div, config, pageData) {
		this.div = div;
		this.config = config;

		var tabs = $('ul.template-list-tabs>li',this.div),
		    bodies = $('.template-list-body',this.div);
		if (tabs.length && bodies.length) {
			new Tabs(tabs, bodies);
		};
		this.tabs=tabs;
		
		this.bind();
		//���ݲ�����ȷ���л�������tabҳ
		if(pageData!=null){
			if(pageData.showBackup){
				this.tabs.eq(2).click();
			}
		}

	},
	
	bind: function(){
		var self = this;
		var templateList =$(".template-list",self.div);
		
		//����
		$(".backup",self.div).bind("click", function(e){
			e.preventDefault();
			
			//���ÿ�� ����ģ��
			Template.backup({
				success:function(){
					//��������ҳ�棬�л�������tabҳ
					WP.TemplatePageContext.loadPage(0,{"showBackup":true});
				},
				error:function(message){
					Msg.error('����ģ��ʧ�ܣ���ˢ�º����ԡ�');
				}
			});
		});
		
		//ģ��Ӧ��
		templateList.delegate('a.apply', 'click', function(e) {
			e.preventDefault();
			
			var li = $(this).closest('li'),
				template = li.data('template');
			self.currentTemplate = template;
			//�����Ƿ�Ӧ�öԻ���
			self.applyTemplateDialog();
		});
		
		//�޸�����
		templateList.delegate('a.rename', 'click', function(e) {
			e.preventDefault();
			
			var li = $(this).closest('li'),
				template = li.data('template');
				
			self.currentTemplate = template;
			
			var renameDiv = $(".template-rename-panel",self.div);
			
			$("input.name",renameDiv).val(template.name);
			renameDiv.show();
			li.append(renameDiv);
		});
		
		//�޸����ƣ����¼�,��֤�ַ�
		var name = $(".template-rename-panel>.name",self.div);
		var error = $(".template-rename-panel>.error",this.div);
		name.bind('input propertychange', function() {								   
			self.validateName(name.val(),error);
		});
		this.error=error;
		
		//�޸�����ȷ��
		$(".confirm",self.div).bind("click", function(e) {
			e.preventDefault();
			//������ڴ��������޸�����
			if(self.error.text()!=""){ 
				return;
			};
			
			$(".template-rename-panel",self.div).hide();
			var li = $(this).closest('li'),
				template = li.data('template');
			self.currentTemplate = template;
			//����ajax����
			$.ajax(self.config.renameUrl, {
				type: 'POST',
				data:{
						"id":self.currentTemplate.id,
						"name":self.currentTemplate.name,
						"_csrf_token": $('#doc').data('doc-config')._csrf_token
					},
				dataType: 'json',
				success: function(result){
					if (result.success) {
						//�����޸ĳɹ��� ˢ��������
						var renameDiv = $(".template-rename-panel",self.div);
						$(".name",li).text($("input.name",renameDiv).val());
					} else {
						Msg.error('�޸�ģ������ʧ�ܣ���ˢ�º����ԡ�');
					}
				},
				error: function(){
					Msg.error('���緱æ����ˢ�º����ԡ�');
				}
			});
			
		
		});
		
		//ɾ��
		templateList.delegate('a.delete', 'click', function(e) {
			e.preventDefault();
			//����ɾ��ȷ�Ͽ�, ȷ��֮����ɾ��ajax����
			self.node = $(this);
			self.delTemplateDialog();
		});
		
	},
	
	delTemplateAction: function(){
		var self = this;
		var li = self.node.closest('li'),
			template = li.data('template');
		self.currentTemplate = template;
		//����ajax����
			$.ajax(self.config.delUrl, {
				type: 'POST',
				data:{
						"id":self.currentTemplate.id,
						"_csrf_token": $('#doc').data('doc-config')._csrf_token
					},
				dataType: 'json',
				success: function(result){
					if (result.success) {
						//ɾ���ɹ����Ƴ�Ԫ��
						li.remove();
					} else {
						Msg.error('ɾ��ģ��ʧ�ܣ���ˢ�º����ԡ�');
					}
				},
				error: function(){
					Msg.error('���緱æ����ˢ�º����ԡ�');
				}
			});
	},
	
	/**
	* ɾ��ģ��Ի���
	*/
	delTemplateDialog: function(){
		var self = this;
		delDialog = Dialog.open({
		header: 'ɾ��ģ��',
		className: 'del-template-dialog',
		hasClose: true,
		buttons: [{'class': 'd-confirm',value: 'ɾ��'},{'class': 'd-cancel',value: '��ɾ��'}],
		draggable : true,
		content : "�Ƿ�ɾ����ģ��",
		confirm : function(dialog){
				self.delTemplateAction();
				delDialog.close();
			}
		});
	},
	
	/**
	 * Ӧ��ģ�嵽���̵ĶԻ���
	 */
	applyTemplateDialog: function(){
		var self = this;
		applyDialog = Dialog.open({
		header: 'Ӧ��ģ��',
		className: 'apply-template-dialog',
		hasClose: true,
		buttons: [{'class': 'd-confirm',value: '��'},{'class': 'd-cancel',value: '��'}],
		draggable : true,
		content : "Ӧ�������Ƿ��Զ�����ģ��",
		confirm : function(dialog){
				//���ñ���ǰ�����������Ƿ�����ʾ���Ƿ񱸷� �����ÿ�� Ӧ��ģ��
				Template.apply(self.currentTemplate,{
					success:function(){
						//�ɹ�����
						
					},
					error:function(message){
						Msg.error('Ӧ��ģ��ʧ�ܣ���ˢ�º����ԡ�');
					}
				});
				applyDialog.close();
			}
		});
	},
	
	validateName: function(nameValue,error) {
		error.text("");
		var value = $.trim(nameValue);
		if(!value) {
			error.text('���ⲻ��Ϊ��');
		}
		if (/[~'"@#$?&<>\/\\]/.test(value)) {
			error.text('������������ַ�');
		}
	}

  };
	
	WP.TemplatePageContext.register('template-page-personal', TemplatePagePersonal);
	
})(jQuery, Platform.winport);
