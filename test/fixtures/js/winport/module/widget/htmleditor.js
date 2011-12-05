/**
 * @fileoverview �༭��
 * @author qijun.weiqj
 */
(function($, WP) {

var HtmlEditorConfig = {
	// General options
	mode: 'exact',      //�༭��ʹ�õ�����Դ����textarea
	theme: 'advanced',  //�༭���Ļ�����������Ϊadvanced
	skin: 'aliRTE',     //�༭��Ƥ��aliRTE
	//������������û�б�Ҫʱ��Ҫ����Ķ�
	//pluginsΪ�༭�����صĲ�����ã�ɾ��plugins�еĲ�����Զ�ɾ����صİ�ť������ɾ���������İ�ť������ɾ����ع���
	//plugins����ali��ͷ�Ĳ����ΪaliRTE���Ʋ������ص���������ں�������
	plugins: 'contextmenu,aliwindow,paste,table,aliCCBUImage,advlink,aliFilter,aliGroup,aliViewAndCode,aliResize,aliTracelog,aliMultiLanguage',
	
	//�༭����С����
	width: 600,
	height: 350,
	
	// Theme options
	//�༭�����������ã�theme_advanced_buttons1����������һ�У�theme_advanced_buttons2���������ڶ���
	//�ڹ�������ɾ����ť������ɾ����ع��ܣ�Ʃ��ɾ��table��ť��������Ҽ��˵��н���Ȼ���Կ���������༭��񡱵Ĺ���
	//��ť�г��ֵ�group��ťΪ������ť��ϣ�����aliGroup�������ص��������49��
	theme_advanced_buttons1: 'image,table,module',
	theme_advanced_buttons2: 'undo,fontselect,fontsizeselect,forecolor,backcolor,|,bold,italic,underline,strikethrough,group,|,justifyleft,justifycenter,justifyright,|,group,group,|,charmap,|,link,unlink',
	theme_advanced_buttons3: '',
	theme_advanced_toolbar_location: 'top', //�����������ڱ༭������
	theme_advanced_toolbar_align: 'left', //�������а�ť���뷽ʽΪ�����
	theme_advanced_statusbar_location: 'bottom', //״̬�������ڱ༭���ײ�
	//�༭�����ִ�С�Զ������ã�Ĭ��Ϊ"1,2,3,4,5,6,7"
	//���÷���Ϊ����ʾ�İ�=��С�����硰һ��=26pt;Сһ=24pt��
	//ע�⣺Ϊ�˱�֤��utf-8��gb2312�Ȳ�ͬ�����ҳ���ж�����������ʾ���֣�����ĺ��ֶ�����unicode���룬�磺��һ�š�Ϊ��\u4E00\u53F7��
	theme_advanced_font_sizes: '\u4E00\u53F7=26pt;\u5C0F\u4E00=24pt;\u4E8C\u53F7=22pt;\u5C0F\u4E8C=18pt;\u4E09\u53F7=16pt;\u5C0F\u4E09=15pt;\u56DB\u53F7=14pt;\u5C0F\u56DB=12pt;\u4E94\u53F7=10pt;\u5C0F\u4E94=9pt;\u516D\u53F7=7.5pt;\u5C0F\u516D=6.5pt;\u4E03\u53F7=5.5pt;\u516B\u53F7=5pt',
	//�༭�����������Զ������ã�Ĭ��ΪӢ�����壬��������Ļ����£���������ô���
	//���÷���Ϊ����ʾ�İ�=���塱���硰����=simsun;����=simhei��
	//ע�⣺Ϊ�˱�֤��utf-8��gb2312�Ȳ�ͬ�����ҳ���ж�����������ʾ���֣�����ĺ��ֶ�����unicode���룬�磺�����塱Ϊ��\u5B8B\u4F53��
	theme_advanced_fonts: '\u5B8B\u4F53=simsun;\u9ED1\u4F53=simhei;\u6977\u4F53=\u6977\u4F53_GB2312;\u96B6\u4E66=\u96B6\u4E66;\u5E7C\u5706=\u5E7C\u5706;\u4EFF\u5B8B=\u4EFF\u5B8B_GB2312;\u5FAE\u8F6F\u96C5\u9ED1=\u5FAE\u8F6F\u96C5\u9ED1',
	//�����Ƿ�����༭���仯��С
	theme_advanced_resizing: true,
	
	
	//�༭����������
	//�������ģ�cn
	//�������ģ�zh
	//Ӣ�ģ�en
	language: 'cn',
	
	//�ڼ���ToolbarΪ�����У���������('0')
	strongToolbar: '1',
	
	//���⹦��Button��ʽ����
	strong_Button: {
	    'image': ['aliButtonS btn-f-left', 'aliButtonS btn-f-left aliButtonSmo'],
	    'table': ['aliButtonS btn-f-left', 'aliButtonS btn-f-left aliButtonSmo'],
	    'module': ['aliButtonS btn-f-left', 'aliButtonS btn-f-left aliButtonSmo']
	},
	
	//aliGroup Config
	//������ϰ�ť���������
	//group_setΪ�������飬ÿ�������Ӧһ����ϰ�ť������ĳ��Ⱥ͹�������ť�����е�"group"����������ͬ
	//ÿ��������iconΪ��ϰ�ť��ʾ��ͼ�꣬buttonsΪ���ܰ�ť���
	//titleΪ���߼���title
	group_set: [
	    {
	        title: '\u4E0A\u4E0B\u6807',
	        icon: '/themes/advanced/skins/aliRTE/img/icon-sup.gif',
	        buttons: 'sup,sub',
	        tracelog: 'topmark,submark'
	    }, {
	        title: '\u7F16\u53F7',
	        icon: '/themes/advanced/skins/aliRTE/img/icon-bullist.gif',
	        buttons: 'bullist,numlist',
	        tracelog: 'projectnum,digitalnum'
	    }, {
	        title: '\u7F29\u8FDB',
	        icon: '/themes/advanced/skins/aliRTE/img/icon-indent.gif',
	        buttons: 'indent,outdent',
	        tracelog: 'addindent,subindent'
	    }
	],
	
	//aliCount Config
	//�༭���ַ�������
	textTotal: 50000,
	
	//aliResize config
	//�༭����С�仯���ã��ֱ�Ϊ���߶ȣ���С�߶ȣ������߶�
	resize_set: {
	    maxHeight: 1500,
	    minHeight: 500,
	    stepHeight: 200
	},
	
	//aliTracelog Config
	//�༭��������ʱ���͵�tracelog
	tracelog: 'wpdiy_aliRTE',
	
	//i18n Rewrite Config
	//�Զ����İ����ã��������÷��������custom_i18n.docx
	custom_i18n: {
	    'cn.aliResize': {
	        isLargest: '\u7F16\u8F91\u5668\u5DF2\u7ECF\u662F\u6700\u5927\u4E86',
	        isSmallest: '\u7F16\u8F91\u5668\u5DF2\u7ECF\u662F\u6700\u5C0F\u4E86'
	    },
	    'en.advlink_dlg': {
	        msginfo: 'You can insert all links.',
	        errorMsg: 'URL permission denied'
	    },
	    'cn.aliimage': {
	        validFailNotLogin: '\u60A8\u9700\u8981\u767B\u5F55\u624D\u53EF\u4EE5\u4E0A\u4F20\u56FE\u7247',
	        validFailNormal: '\u62B1\u6B49\uFF0C\u670D\u52A1\u5668\u9519\u8BEF\uFF0C\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\u3002',
	        availableDomainsInfo: '\u53EA\u5141\u8BB8\u63D2\u5165\u4EE5\u4E0B\u57DF\u540D\u4E0B\u7684\u56FE\u7247\uFF08{#domain}\uFF09',
	        validFailInvalidDomain: '\u56FE\u7247\u5730\u5740\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165'
	    }
	},
	
	//table config
	//����༭���������
	table_default_border: 1, //���Ĭ�ϱ߿�
	table_default_width: '680', //���Ĭ�Ͽ��
	table_default_class: 'aliRTE-table', //���Ĭ��className��û�б�Ҫ�벻Ҫ�޸�
	table_col_limit: 12, //����������
	table_row_limit: 128, //����������
	//link config
	//����༭����������
	link_config: {
	    allow_all: false, //�Ƿ����������ⲿ����
	    is_ali_only: false, //�Ƿ�ֻ������Ͱ���������������
	    white_list: [ //��ʹ�õ��ⲿ���Ӱ�����
	        '*.aliui.com', '*.aliued.com'
	    ]
	},
	
	//ali-image-insert config
	//����༭ͼƬ������
	aliimage_config: {
	    //�Ƿ����������ⲿͼƬ����
	    allow_all: true,
	    //�Ƿ�ֻ������Ͱ�����������ͼƬ����
	    is_ali_only: false,
	    //ͼƬ��������
	    fileTypes: '',
	    //һ�ο��ϴ���ͼƬ��������
	    fileCountLimit: 10,
	    allowUpload: true,
	    allowAlbum: true,
	    allowWeb: true,
	    allow_all: true,
	    is_ali_only: false,
	    uploadVars_flash: { source: 'offer_biz' },
	    uploadVars_html: { source: 'offer_biz' },
	    //���뱾��ͼƬ-��Ҫ����ѹ����ͼƬ��С
	    compressSize: 5 * 1024 * 1024,
	    compressWidth: 1024,
	    compressHeight: 1024,
	    compressQuality: 93,
	    //�ڴ˴�С��Χ�ڵ�ͼƬ���ᴫ�䵽������
	    uploadSizeLimit: 1 * 1024 * 1024,
	    //���뱾��ͼƬ-ѹ���������ϴ���ͼƬ��С
	    sizeLimitEach: 640 * 1024,
	    //���뱾��ͼƬ-�ϴ�ͼƬ������
	    supportFileTypes: ['jpg', 'jpeg', 'gif', 'bmp', 'png'],
	    //���뱾��ͼƬ-һ���ϴ�ͼƬ������
	    fileCountLimit: 10,
	    fileFieldName: 'imgFile',
	    //�ϴ���ַ
	    uploadUrl: '',
	    //��֤��ַ
	    checkUrl: '',
	    //��ȡ����Ҫ��Ϣ�ӿڵ�ַ
	    fetch_summinfo_url: '',
	    //��ȡ���ͼƬ�ӿڵ�ַ
	    fetch_piclist_url: '',
	    //��ȡ����б�ӿڵ�ַ
	    fetch_albumlist_url: '',
	    //�����������ص�����ת������Ҫ�����ݸ�ʽ
	    response_to_result_object: function(data, str) {
	        var succ = data.result == 'success',
	        getString = function(s) {
	            if (!s) return ''; return typeof (s) == 'string' ? s : s[0];
	        },
	        errMsg = succ ? '' : getString(data.errMsg),
	        errCode;
	        switch (errMsg) {
	            case 'imgTooBig':
	            errCode = '1000';
	                break;
	            case 'maxImageSpaceExceed':
	                errCode = '1600';
	                break;
	            case 'maxImgPerAlbumExceeded':
	                errCode = '1700';
	                break;
	            case 'imgTypeErr':
	                errCode = '1100';
	                break;
	            default:
	                errCode = '1500';
	                break;
	        }
	        //1000 fail on file size check
	        //1100 fail on file type check
	        //1200 fail on token validation
	        //1300 fail on adding wartermark
	        //1400 fail on gererating thumbnails
	        //1500 unknown
	        //1600 max exceeded
	
	        return {
	            success: succ,
	            errorCode: errCode,
	            filePath: succ ? getString(data.imgUrls) : null,
	            thumb: succ ? getString(data.miniImgUrls) : null,
	            id: succ ? data.dataList[0] : null,
	            errMsg: errMsg
	        };
	    },
	    //ͼƬǰ׺����Arranda�ϴ���ʽ����
	    imgPrefix: '',
	    fetch_piclist_url: '/album/ajax/image_detail_list.json',
	    fetch_albumlist_url: '/album/ajax/album_puller_ajax.json',
	    break_after_image: '<br/><br/>'
	},
	
	paste_retain_style_properties: 'color,background-color,font,font-size,font-weight,font-family,font-style,border-top,border-right,border-bottom,border-left,border-color,border-width,border-style',
	paste_auto_cleanup_on_paste: true,
	paste_block_drop: true,
	invalid_elements: 'script,link,iframe,frame,frameset,style,embed,object,html,head,body,meta,title,base,!DOCTYPE,applet,textarea,xml,param,code,form',
	extended_valid_elements: 'marquee[align|behavior|bgcolor|direction|height|width|hspace|vspace|loop|scrollamount|scrolldelay]',
	
	
	//Example content CSS (should be your site CSS)
	//�ڱ༭���������ⲿCSS���Ա�ﵽ���������ã��ñ༭���ڵ���ʾЧ���ͷ��������ʵЧ������һ��
	content_css: '',
	
	// Drop lists for link/image/media/template dialogs
	template_external_list_url: '',
	external_link_list_url: '',
	external_image_list_url: '',
	media_external_list_url: '',
	
	// Replace values for the template plugin
	template_replace_values: {
	    username: 'Some User',
	    staffid: '991234'
	}
};
//~ HtmlConfig


$.getScript('http://style.china.alibaba.com/app/alirte/jscripts/tiny_mce/tiny_mce.js');


var Util = WP.Util;

var HtmlEditor = Util.mkclass({
	
	init: function(elm, config) {
		if (!HtmlEditor.isPrepared) {
			HtmlEditor.prepare();
		}

		this.elm = $(elm).eq(0);
		this.config = this._prepareConfig(config);

		this._initEditor();
	},
	
	_prepareConfig: function(config) {
		config = config || {};

		var ret = $.extend({}, HtmlEditorConfig);

		this.id = this._getEditorId();
		ret.elements = this.id;

		ret.aliimage_config = $.extend({}, ret.aliimage_config, {
			//�ϴ���ַ
			uploadUrl: config.uploadUrl,
			
			//��ȡ����Ҫ��Ϣ�ӿڵ�ַ
			fetch_summinfo_url: config.fetchSummInfoUrl,
			
			//��ȡ���ͼƬ�ӿڵ�ַ
			fetch_piclist_url: config.fetchPicListUrl,
			
			//��ȡ����б�ӿڵ�ַ
			fetch_albumlist_url: config.fetchAlbumListUrl,
			
			//��ȡ���ͼƬ�����ӿ�
			fetch_piccount_url: config.fetchPicCountUrl,
			
			//�½����ӿ�
			add_album_url: config.addAlbumUrl
		});

		if (config.focus) {
			ret.auto_focus = this.id; 
		}
		
		return ret;
	},
	
	_getEditorId: function() {
		var elm = this.elm,
			id = elm.attr('id');
		if (!id) {
			id = 'html-editor-' + $.now();
			elm.attr('id', id);
		}
		return id;
	},
	
	_initEditor: function() {
		var config = this.config;
		tinyMCE.init(config);
	},
	
	/**
	 * �ύ��ǰ, ��Ҫ����update��ͬ���༭�����ݵ�textarea
	 */
	update: function() {
		var editor = tinyMCE.get(this.id);
		editor.execCommand('beforeSubmit');
		editor.save();

		this._filterHTML();
	},

	_filterHTML: function(html) {
		var html = this.elm.val();
		html = html.replace(/<!--[^>]*-->/g, ''); // �༭�������ע��,���½���ע��ʱ�ᱨ��,����Ҫ���˺��ٱ���
		this.elm.val(html);
	},
	
	/**
	 * �رձ༭��ʱ����Ҫ����close���ͷ���Դ
	 */
	close: function() {
		if (this.isClosed) {
			return;
		}
		
		var editor = tinyMCE.get(this.id);
		editor.remove();
		editor.destroy();
		
		this.isClosed = true;
	},

	focus: function() {
		tinyMCE.execCommand('mceFocus', true, this.id);
	}
	
});


/**
 * ����ԭ�ȱ༭��ͼƬ�ܼ�������ҳ���е�һЩ�ڵ�
 * ����Щ�ڵ����������в�������,
 * ����Ϊ���ܹ��ñ༭����������, ��Ҫ������ҳ�������һЩ�ڵ�
 */
$.extend(HtmlEditor, {

	prepare: function() {
		if (this.isPrepared) {
			return;
		}

		var docCfg = $('#doc').data('doc-config'),
			html = [ 
				'<input id="has-album-value" type="hidden" value="true" />',
				'<input name="_csrf_token" type="hidden" value="{0}" />',
				'<input name="haswinport" type="hidden" value="true" />'
			].join('\n');

		html = $.util.substitute(html, [docCfg._csrf_token]);
		
		$('body').append(html);
		window.isTP = docCfg.isTP;

		this.isPrepared = true;
	}
});

//~ HtmlEditor

WP.widget.HtmlEditor = HtmlEditor;
$.add('wp-htmleditor');

	
})(jQuery, Platform.winport)
