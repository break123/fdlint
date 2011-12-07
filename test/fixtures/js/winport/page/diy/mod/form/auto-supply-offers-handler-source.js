/**
 * @fileoverview ��Ӧ��Ʒ�Զ� 
 * 
 * @author long.fanl
 */
(function($, WP){
	
	var SimpleHandler = WP.diy.form.SimpleHandler,
		InstantValidator = WP.widget.InstantValidator,
		previewUrl = ""; // Ԥ��offerlist url
	
	WP.diy.form.AutoSupplyOffersHandler = $.extendIf({
		init: function(){
			SimpleHandler.init.apply(this, arguments);

			var form = this.form;

			previewUrl = $("a.auto-offer-preview-a", form)[0].href;
			
			togglePriceScope(form);
			initPriceInput();
			initPreviewFilter(form);
		}
	}, SimpleHandler);
	
	// ����/��ʾ �۸�ɸѡ��
	function togglePriceScope(form){
		var priceFilter = $("#price-filter"),
		priceStart = $("input.price-start"),
		priceEnd = $("input.price-end"),
		priceScopeWrap = $("div.price-scope-wrap",form);
		
		//���Ĭ��ѡ�У�����ʾ�۸�����
		if(priceFilter[0].checked){
			priceScopeWrap.css("visibility","visible");
		}
		
		priceFilter.click(function(){
			if(this.checked){
				priceScopeWrap.css("visibility","visible");
			}else{
				priceScopeWrap.css("visibility","hidden");
				priceStart.val("");
				priceEnd.val("");
			}
		});
	}
	
	// ���Ƽ۸������
	function initPriceInput() {
		InstantValidator.validate("input.price-start,input.price-end","price");
	}
	
	// Ԥ��ɸѡ���
	function initPreviewFilter(form){
		$("a.auto-offer-preview-a",form).bind("click",function(){
			var params = {};
			params.userDefined = true;
			// �ؼ���
			var keywords = $("input.keywords",form).val();
			if($.trim(keywords) !== ""){
				params.keywords = keywords;
			}
			// ��Ʒ����
			params.catId = $("select[name=catId]",form).val();
			// ��Ϣ����
			if(!$("#all-type-offers-radio")[0].checked){
				params.groupFilter = $("#group-offers-radio")[0].checked;
				params.privateFilter = $("#private-offers-radio")[0].checked;
				params.mixFilter = $("#mix-offers-radio")[0].checked;
			}
			// �۸�Χ
			params.priceFilter = $("#price-filter")[0].checked;
			if(params.priceFilter){
				params.priceStart = $("input.price-start",form).val();
				params.priceEnd = $("input.price-end",form).val();
			}
			this.href = WP.Util.formatUrl(previewUrl,$.paramSpecial(params)+"#search-bar-in-column");
		});
	}
    
})(jQuery, Platform.winport);
//~
