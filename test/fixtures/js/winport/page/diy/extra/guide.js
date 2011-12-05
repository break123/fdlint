/*
* �����°�װ����
* @param DATA ����չʾ������ ���ӣ�����Ҫ���ӵ�λ�ò���һ����׼���ݼ��ɣ� ɾ����ɾ��DATA�е�ָ�����ݼ��ɣ�DATA�е����ݲ���С��3����
* @param 0 ����
* @param 1 ����
* @param 2 �󱳾�ͼƬ��ַ
* @param 3 ���� ������ʾͼƬ���� ��Ӧ 0 ͼƬ��ַ 1 ��߽���� 2 �������� 
* @param 4 dialog ����tip��ʽ 1,2,3Ϊ�ϣ�1,2,3λ�ò�ͬ��  4Ϊ��  5Ϊ�� Ϊ�ձ�ʾû��tip
* @param 5 ���� dialog��λ 0 ��߽���� 1 ��������
* @author deming.wei
*/
(function(window,undefined){
var DATA =[
   ["ģ�������","���ݰ汾��ͬ���ṩ���80�׵�ģ��ɹ�ѡ���������á����ַ��ҳ���������ɣ�","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_02.jpg",["http://img.china.alibaba.com/cms/upload/detail/11011015/images/Highlight01.jpg","25","37"],"1",["200","359"]],
   ["���Ƹ�����","���Ƹ߶���ԭ��90�������ӵ�200���أ���ҵ�����ͻ����������������ӡ��","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_01.jpg",["http://img.china.alibaba.com/cms/upload/detail/11011015/images/Highlight02.png","25","45"],"2",["445","425"]],
   ["��������","��ɵ���������򵥵Ĳ�����ƣ�˫�����а�����ã��϶��ƶ����λ�ã�������ʽ�������ã�","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_03.jpg",["http://img.china.alibaba.com/cms/upload/detail/11011015/images/Highlight03.png","0","0"],"5",["400","498"]],
   ["�����ḻ","���ḻ�İ�����ݣ���ֱ�۵İ��ѡ�񣬰������������Ӱ�����ݣ�","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_01.jpg",["http://img.china.alibaba.com/cms/upload/detail/11011015/images/Highlight04.png","0","0"],"3",["45","420"]],
   ["�Զ������","�Զ������ò�Ʒ������𣬶������ࡢͼƬչʾ��ʹ��Ʒ�����רҵ��","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_06.jpg",["http://img.china.alibaba.com/cms/upload/detail/11011015/images/Highlight05.png","0","0"],"4",["235","359"]],
   ["�Զ�����","�Զ�����������ƣ��������ͼƬ���ݣ�����д����ƴ��룬չʾ��ʽ��Ѥ����","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_07.jpg",["http://img.china.alibaba.com/cms/upload/detail/11011015/images/Highlight06.png","0","0"],"5",["500","87"]],
   ["��������װ��������̰�","&nbsp;","http://img.china.alibaba.com/cms/upload/detail/11011015/images/Guide_01.jpg","","",["307","400"]]
  ];
var Guide = function(DATA){
	this.init.apply(this,arguments);
}
	
Guide.prototype={
	init:function(){
		this.DATA = DATA;
		this.TITLE = jQuery('h2','.dialog_main');
		this.CONTENT = jQuery('p','.dialog_main');
		this.DIALOGMAIN = jQuery('div.dialog_main');
		this.HIGHLIGHT = jQuery('div.dialog_main2');
		this.TIPBAR = jQuery('div.tipbar');
		this.BOTTON = jQuery('.botton','.dialog_main');
		this.TOPCLOSE = jQuery('.topclose');
		this.DIALOG_CLOSE = jQuery('span.dialog_close');
		this.DIALOG = jQuery('.dialog');
		this.LISTNUM =jQuery('span.listnum');
		this.ELM = jQuery('span.btn1');
		this.NUM = DATA.length;
		this.BGIMG = jQuery('img','.container');
		this.STEP = 0;
		this.bind();
		this.tipbar();
	},
	bind:function(){
		var self = this;
			jQuery(self.ELM).bind('click',function(e){
				e.preventDefault();
				if(self.STEP>self.NUM-1){
					window.close();
					return false;
				}
				self.HIGHLIGHT.fadeOut(0);
				self.render(self.STEP)
				self.STEP = self.STEP+1;
			});
			jQuery(self.DIALOG_CLOSE).bind('click',function(e){
				e.preventDefault();
				window.close();
			})
	},
	bindPrev:function(){
		var self = this;
			jQuery('span.prev').bind('click',function(e){
				e.preventDefault();
				self.HIGHLIGHT.fadeOut(0);
				if(self.STEP<2){
					return false;
				}else if(self.STEP===2){
					jQuery('span').remove('.prev');
				}
				self.render(self.STEP-2);
				self.STEP = self.STEP-1;
			})
	},
	render:function(i){
		var self = this;
		this.DIALOG.addClass('dialogclass')
		this.BGIMG.attr('src',DATA[i][2]);
		this.TITLE.html(DATA[i][0]);
		this.HIGHLIGHT.css({"left":""+DATA[i][3][1]+"px","top":""+DATA[i][3][2]+"px"});
		this.HIGHLIGHT.html('<img src="'+DATA[i][3][0]+'" />');
		this.DIALOGMAIN.animate({"left":""+DATA[i][5][0]+"px","top":""+DATA[i][5][1]+"px"},500);
		this.CONTENT.html(DATA[i][1]);
		jQuery(self.ELM).html('��һ��');
		this.tipbar(DATA[i][4]);
		switch(i){
			case 1: 
			jQuery('span').remove('.prev');
			self.BOTTON.prepend('<span class="prev">��һ��</span>');
			self.bindPrev();
			break;
			case self.NUM-1:
			jQuery('span').remove('.prev');
			jQuery('span').remove('.listnum');
			self.DIALOG.removeClass('dialogclass');
			this.HIGHLIGHT.html('');
			jQuery(self.ELM).html('��ʼ');

		}
		if(self.LISTNUM){
			jQuery(self.LISTNUM).html(""+(i+1)+"/"+(self.NUM-1)+"");
		}
		self.HIGHLIGHT.fadeIn(1000);
	},
	tipbar:function(i){
		switch(i-0){
			case 1:
			this.TIPBAR.css({
							"display":"block",
							"left":"25px",
							"top":"-30px",
							"background-position":"0 0"
							});
			break;
			case 2:
			this.TIPBAR.css({
							"display":"block",
							"left":"20px",
							"top":"-30px",
							"background-position":"0 -40px"
							});
			break;
			case 3:
			this.TIPBAR.css({
							"display":"block",
							"left":"340px",
							"top":"-30px",
							"background-position":"0 0"
							});
			break;
			case 4:
			this.TIPBAR.css({
							"display":"block",
							"left":"-30px",
							"top":"75px",
							"background-position":"0 -120px"
							});
			break;
			case 5:
			this.TIPBAR.css({
							"display":"block",
							"left":"312px",
							"top":"200px",
							"background-position":"0 -80px"
							});
			break;
			default:
			this.TIPBAR.css({"display":"none"});

		}
	}
}
window.Guide  = Guide;
})(window)
jQuery(function(){
	new Guide();
	jQuery.use('ui-dialog', function(){
			var dialog1 = jQuery('div.dialogbg');
			dialog1.dialog({
				draggable: false,
				bgiframe: true
			});
	});
})

