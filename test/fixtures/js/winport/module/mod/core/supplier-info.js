/**
 * @fileoverview ��Ӧ����Ϣ���, ��ʵ��
 * 
 * @author qijun.weiqj
 */
(function($, WP) {
	
var Util = WP.Util,
	UI = WP.UI,
	Component = WP.Component,
	WPAlitalk = WP.mod.unit.WPAlitalk,
	FloatPanel = WP.widget.FloatPanel,
	DataStore = WP.widget.DataStore;

var SupplierInfo = {
	init: function(div, config) {
		this.div = div;
		this.config = config;
		this.docConfig = Component.getDocConfig() || {};
		
		this._initContact();
		
		this.name = 'SupplierInfo';
		Util.initParts(this, [div, config]);
	},
	
	/**
	 * ��ϵ��ʽ
	 */
	_initContact: function() {
		var alitalk = $('a[data-alitalk]', this.div);
		WPAlitalk.init(alitalk);
	}
};
//~ SupplierInfo


/**
 * �������߼�����
 */
var Parts = (SupplierInfo.Parts = {});


/**
 * ����ͨ������Ϣ
 */
Parts.TPSummary = {
	init: function(div, config) {
		var self = this,
			url = config.tpCombineInfoUrl,
			uid = this.docConfig.uid;
		
		if (!url) {
			return;
		}
		
		$.ajax(url, {
			dataType: 'jsonp',
			data: {
				member_ids: this.docConfig.uid,
				combine: 'logo;period;type;score',
				'logo.type': 'WINPORT_V2'
			},
			success: function(o) {
				self.render(o[uid] || {});
			}
		});
	},
	
	render: function(info) {
		this.renderTpLogo(info);
		this.renderTpScore(info.score.score);
	},
	
	/**
	 * ��Ⱦ����ͨLOGO�����
	 */
	renderTpLogo: function(info) {
		var tpinfo = $('div.tpinfo', this.div),
			tplogo = $('a.tplogo', tpinfo),
			tpyear = $('a.tpyear', tpinfo);
			
		tpyear.addClass('time-point-' + info.period.year).show();
		
		// TODO ��˽ӿڷ������Ͳ���ȷ
		if (info.tpType.product.isLimitEdition === 'true') {
			tpinfo.addClass('tpinfo-limit');
		}
		
		info.logo.url && tplogo.append($('<img>', { src: info.logo.url }));
		
		tpinfo.css('visibility', 'visible');
	},
	
	/**
	 * ��Ⱦ����ָͨ��
	 */
	renderTpScore: function(score) {
		var scoreValue = $('dl.tp-score a.score-value', this.div);
		score ? scoreValue.text(score) : 
				scoreValue.replaceWith('--');
	}
};
//~ TPSummary

/**
 * ���ű���
 */
Parts.Guarantee = {
	
	init: function(div, config) {
		var self = this,
			panel = $('div.guarantee', div),
			url = config.guardUrl;
		if (!url || !panel.length) {
			return;
		}
		
		DataStore.request('supplier-info-guarantee', url, {
			dataType: 'jsonp',
			data: { 
				summarys: 'guarantee',
				memberId: this.docConfig.uid
			},
			success: function(o) {
				var data = o.data || {};
				o.success && data.guarantee && 
						self.render(panel, data.guarantee);
			}
		});
	},
	
	render: function(panel, guarantee) {
		var group = $('a.group-trust', panel),
			moneySpan = $('p.guarantee-money span.value', panel),
			pos = guarantee.position;
		
		if (pos === 'NON_GUARANTEE') {
			return;
		}
		
		if (pos !== 'GUARANTEE') {
			group.show();
		}
		
		moneySpan.text(parseInt(guarantee.totalBalanceMoney, 10) || 0);
		panel.show();
	}
	
};

/**
 * �ӹ�����
 */
Parts.ProcessPanel = {
	
	init: function() {
		var self = this,
			feature = $('div.feature', this.div),
			wrap = $('dd.process-panel-wrap', feature),
			handler = $('a.process-ability', feature);
			
		if (!wrap.length) {
			return;
		}
		
		// ��Ҫʱ����������, ���Ҵ����ڵ�
		handler.one('mouseenter', function() {
			var url = self.config.manufactureUrl;
			$.ajax(url, {
				dataType: 'script',
				success: function() {
					var ret = window.WP_MANUFACTURE_INFO;
					if (!ret) {
						return;
					}
					o = $.parseJSON(ret);
					if (o.success && !o.isEmpty) {
						self.render(wrap, handler, o);
						handler.mouseenter();
					}
				}
			});
		});
	},
	
	/**
	 * ��Ⱦwrap�ڵ�, ��ʼ�����������
	 */
	render: function(wrap, handler, o) {
		UI.htmlTemplate(wrap);
		var panel = $('div.process-panel', wrap),
			show = function(elm, text) {
				text ? elm.text(text.replace(/\.\.$/, '��')) :
					elm.hide().prev('dt').hide() 
			};
		
		show($('dd.style-value', panel), o.mfType);
		show($('dd.craft-value', panel), o.mfTechnologyType);
		show($('dd.domain-value', panel), o.mfServiceArea);
		
		new FloatPanel(panel, {
			handler: handler,
			event: 'mouseenter',
			autoClose: 300
		});
	}
};
//~ ProcessPanel

/**
 * ��Ա����
 */
Parts.PrivatePanel = {

	init: function() {
		var self = this,
			memberService = $('dl.member-service', this.div),
			wrap = $('dd.private-panel-wrap', memberService),
			handler = $('a.private,a.discount', memberService);
			
		if (!wrap.length) {
			return;
		}
		
		handler.eq(0).closest('dd').one('mouseenter', function() {
			var url = self.config.partnerRelationAjaxUrl;
			$.ajax(url, {
				dataType: 'jsonp',
				data: { 
					supplierId: self.docConfig.uid 
				},
				success: function(o) {
					self.render(wrap, handler, o);
					handler.mouseenter();
				}
			});
		});
	},
	
	render: function(wrap, handler, o) {
		UI.htmlTemplate(wrap);
		var panel = $('div.private-panel', wrap),
			// �ǻ�Ա��ʾ���
			noAuthPart = $('div.not-auth-member', panel),
			// ��Ա��ʾ���
			authPart = $('div.is-auth-member', panel),
			// �ۿ۲���
			discountPart = $('.discount-part', panel);
		
		// �ۿ���Ϣ
		if (o.discount) {
			$('span.discount-value em', discountPart).text(o.discount);
		} else {
			discountPart.hide();
		}
		
		// ��Ա
		if (o.isMember) {
			// ���ط���Ȩ��������
			noAuthPart.hide();
			
			// û�м۸���Ȩ, ���ؼ۸���Ȩ��������
			!o.priceAuth && $('p.price-part', authPart).hide();
			
			// û��ͼƬ��Ȩ, ����ͼƬ��Ȩ��������
			!o.picAuth && $('p.pic-part', authPart).hide();
			
			// ��Ա����
			$('span.partner-level', authPart).text(o.partnerLevel);
		} else {
			// ��������Ȩ��������
			authPart.hide();
			
			// ���û����Ȩ��Ʒ, ��Ҫ������Ȩ��Ʒ��������
			var offerPart = $('dl.offer-part', noAuthPart),
				count = parseInt($('span.offer-count em', offerPart).text(), 10);
			!count && offerPart.hide();
			
			var isLogin = this.docConfig.isLogin,
				applyBtn = $('a.apply-btn', noAuthPart),
				loginBtn = $('a.login-btn', noAuthPart);
			if (isLogin) {
				applyBtn.click(function(){
					$('#winport-apply-partner-form').submit();
					return false;
				});
				loginBtn.hide();
			} else {
				loginBtn.attr('href', 
						this.config.ssoLoginLink + document.location.href);
				applyBtn.hide();
			}
		}
		
		new FloatPanel(panel, {
			handler: handler,
			event: 'mouseenter',
			autoClose: 300
		});
	}
	//~ render
	
};

/**
 * Ԥ��� 
 */
Parts.Precharge = {
	init: function() {
		var self = this,
			service = $('dl.spec-service', this.div),
			wrap = $('dd.precharge-panel-wrap', service),
			handler = $('a.precharge', service);
			
		if (!wrap.length) {
			return;
		}
		
		// ��Ҫʱ����������, ���Ҵ����ڵ�
		handler.one('mouseenter', function() {
			var url = self.config.prechargeUrl;
			$.ajax(url, {
				dataType: 'script',
				success: function() {
					var ret = window.WP_PRECHARGE_INFO,
						o = null;
					if (ret && (o = ret.prechargeSummInfo)) {
						self.render(wrap, handler, o);
						handler.mouseenter();
					}
				}
			});
		});
	},
	
	render: function(wrap, handler, o) {
		UI.htmlTemplate(wrap);
		var panel = $('div.precharge-panel', wrap);
		
		this.renderPanel(panel, o);
		
		new FloatPanel(panel, {
			handler: handler,
			event: 'mouseenter',
			autoClose: 300
		});
	},
	
	renderPanel: function(panel, o) {
		var apply = $('a.apply', panel);
		
		//�״γ�ֵ����
		$('span.first-inpour-limit em', panel).text(o.firstInpourLimit);
		
		// ��������˻�����
		$('span.refund-rate em', panel).text(o.refundRate);
		
		// ��������ң���ʾ "�����ΪԤ������" ��Ť(��������������ҽ��г�ΪԤ������)
		if (o.isOwner) {
			apply.css('display', 'block');
			return;
		}
		
		//�����Ԥ����Ա
		if (o.isPrecharger) {
			// Ԥ�����ҿ������
			$('span.available-fund', panel).text(o.availableFund);
			$('dd.available-fund-part', panel).show();
			$('a.charge', panel).css('display', 'block');
		} else{
			apply.css('display', 'block');
		}
	}
};
//~ Precharge


/**
 * ��Ʒ������
 */
Parts.SatRate = {
	init: function() {
		var self = this,
			root = $('dl.sat-rate', this.div),
			url = this.config.satisfactionRateUrl;
			
		if (!root.length || !url) {
			return;
		} 
		
		$.ajax(url, {
			data: { memberId: this.docConfig.uid },
			dataType: 'jsonp',
			success: function(ret) {
				ret.success && self.success(root, ret.data);
			}
		});
	},
	
	success: function(root, data) {
		var span = $('a.rate-value', root),
			rate = parseFloat(data.satisfactionRate),
			remarkCount = data.remarkCount,
			panel = $('div.sat-rate-panel', root);

		if (rate <= 0) {
			return;
		}
		
		rate && span.text(rate + '%');
		remarkCount && $('span.remark-count', panel).text(remarkCount);
		root.show();
		
		new FloatPanel(panel, {
			handler: span,
			event: 'mouseenter',
			autoClose: 300
		});
	}
};
//~ SatRate


/**
 * ���̲��������������
 */
Parts.HonorFeature = {
	init: function() {
		var self = this,
			url = this.config.honorFeatureRequestUrl,
			uid = this.docConfig.uid;

		if (!url) {
			return;
		}
		
		$.ajax(url, {
			dataType: 'jsonp',
			data: {
				appName: 'winport',
				vAccountIds: uid,
				code: 'WP_CODE'
			},
			success: function(o) {
				o.success && o.data && self.render(o.data[uid]);
			}
		});
	},

	render: function(data) {
		var honorFeature = $('dl.honorfeature', this.div),
			ul = $('ul', honorFeature),

			template = '<li><a href="{targetUrl}" target="_blank"><img src="{imageUrl}" alt="" /></a></li>',
			imageServer = this.docConfig.imageServer,
			targetServer = 'http://view.china.alibaba.com',

			show = false,
			parts = null;

		parts = $.map(data, function(item, key) {
			var imageUrl = imageServer + '/' + item.imageUrl,
				targetUrl = targetServer + '/' + item.targetUrl;

			show = true;
			return $.util.substitute(template, { targetUrl: targetUrl, imageUrl: imageUrl });
		});

		ul.append(parts.join(''));
		show && honorFeature.show();
	}
};


WP.ModContext.register('wp-supplier-info', SupplierInfo);
	
})(jQuery, Platform.winport);

