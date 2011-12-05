/**
 * NodeContext���ڹ���ڵ�ĳ�ʼ��
 * @author qijun.weiqj
 */
(function($, WP) {


/**
 * ͳһ����ҳ��ڵ�ĳ�ʼ������
 * @param {string} name Context����, ��ͬ��Context��Ҫ�в�ͬ������, ��ModContext, PageContext��
 * @param {object} defaultOptions Ĭ��������Ϣ
 *      - entityName {string} ģ���ʼ��ʱ, ����õķ�������, Ĭ��Ϊinit
 *      - configField {string} �ڵ�ĸ����Ƶ�html5 data����ֵ�ᴫ����ʼ������, Ĭ��Ϊ node-config(data-node-config)
 *      						ModeContextΪmod-config(data-mod-config)
 *		- lazy {boolean} �Ƿ��ӳٳ�ʼ��
 *      - once {boolean} Ĭ��Ϊtrue, ��ε���NodeContext::refresh()�Ƿ�ֻ�Խڵ��ʼ��һ��
 *      - root {selector} Context��ؽڵ����������selector, queryNodes��ʹ��
 *      
 */
var NodeContext = function(name, defaultOptions) {
	this._defaultOptions = $.extend({
		entryName: 'init',
		configField: 'nodeConfig',
		lazy: false,
		once: true,
		root: null
	}, defaultOptions);
	
	this.name = name;
	this.length = 0;

	this._nodes = {};
	this._guid = 0;
	
	this._handleDomReady();
};

$.extend(NodeContext.prototype, {
	
	/**
	 * ע����Ҫ��ʼ���Ľڵ�
	 * @param {string} name ����, Context�ڳ�ʼ��ʱ����ݴ�����ȡ��ʵ��DOM���
	 *      �� ModContext ��ȡ��class = name��DOM�ڵ���г�ʼ��
	 *         PageContext ���� jQuery(name) �ķ�ʽȡ�� DOM�ڵ���г�ʼ��
	 *         
	 *      ����Ϊ��, ��ʾ�˳�ʼ��������ض��ڵ�
	 *      PageContext.register(function() {...});  // �ô˷�ʽ����domready, �����Ϳ��ܶ�������ڽ���ͳһ����
	 *         
	 * @param {object|function} config ������Ϣ
	 * 			���г�ʼ������ǩ��Ϊ�� function(context, config) 
	 *      
	 */
	register: function(name, config, options) {
		// ��ʡ�Բ���name
		if (typeof name !== 'string') {	
			options = config;
			config = name;
			name = '~' + this.name.toLowerCase() + this._guid++;	// �ڵ�Ϊbody
		}
		
		// �����ظ�ע��
		if (this._nodes[name]) {
			$.log('warn: ' + this.name + ' ' + name + ' already exist, ignore it.');
			return;
		}
		
		options = $.extend({}, this._defaultOptions, options);
		
		// config��function, ���ģ��Ϊ��ʵ��ģ��
		options.context = $.isFunction(config);
		if (options.context) {
			config = { init: this._wrapProtoInit(name, config) };
		} else {
			config.init = this._wrapStaticInit(name, config);
		}
		
		var self = this,
			data = { name: name, config: config, options: options };
		this._nodes[name] = data;
		this.length++;
		$.log(this.name + ' ' + name + ' registered.');
		
		// �����domready��ע��, ���Ҳ����ӳٳ�ʼ��, ��ֱ�ӳ�ʼ��
		if (this._isDomReady && !options.lazy) {
			this.init(name);
		}
		
		return this;
	},

	/**
	 * ����DomReady�¼�, ��ʼ����lazy�ڵ�
	 */
	_handleDomReady: function() {
		var self = this;
		$(function() {
			self.init();
			self._isDomReady = true;
		});	
	},

	isNodeAllReady: function() {
		return this._isDomReady;
	},
	
	/**
	 * ��ʼ��context, �ɿ�ܵ���, �����������ע��
	 * @param {string|element} name (��ѡ)��Ҫ��ʼ����node���ƻ�dom
	 */
	init: function(name) {
		var self = this;
		
		// 1. ָ��name
		if (typeof name === 'string') {
			var node = this._nodes[name];
			if (!node) {
				$.error(this.name + ' ' + name + ' is not exists.');
			}
			return this._initNode(node);
		}
		
		// 2. �Խڵ���г�ʼ��
		if (name) {
			$(name).each(function() {
			  	var node = self._resolveNode(this);
			  	if (!node) {
				  	$.log(self.name + ' can not resolve node');
				  	$.log(this);	// for debug easy in firefox
					return;
			  	}
				self._initElement(this, node);
			});
		} else {
		  $.each(this._nodes, function() {
			  var node = this;
			  if (!node.options.lazy) {
				  self._initNode(node);
			  }
		  });
		  this.trigger('nodeallready');
		  $.log(self.name + ' nodeallready');
		}
	},
	
	
	refresh: function(name, data) {
		this._refreshData = data === undefined ? true : data;
		this.init(name);
		this._refreshData = null;
	},
	
	/**
	 * ������ʵ��ģ��init�İ�װ����, ��ÿ��ִ��initʱ���ж�����context(this����)
	 * @param {string} name ģ������
	 * @param {function} init
	 */
	_wrapProtoInit: function(name, init) {
		var self = this,
			delegate = function() {};
		delegate.prototype = init.prototype;
		return function(elm, params, refreshData) {
			elm = $(elm);
			var proxy = self._getElementInstance(elm, name);
			if (!proxy) {
				proxy = new delegate();
				self._setElementInstance(elm, name, proxy);
			}

			return self._beforeInit(elm, params, refreshData, proxy) &&
					init.apply(proxy, arguments);
		};
	},

	/**
	 * ������ʵ��ģ���װ����, thisָ��config
	 */
	_wrapStaticInit: function(name, config) {
		var self = this,
			init = config.init; // ��Ҫ����init����, ��Ϊ֮��config.init�ᱻ�滻
		return function(elm, params, refreshData) {
			return self._beforeInit(elm, params, refreshData, config) &&
					init.apply(config, arguments);
		};
	},

	/**
	 * ����beforeinit�¼��ɳ�ʼ����װ�������
	 */
	_beforeInit: function(element, params, refreshData, context) {
		data = { 
			element: element, 
			config: params,
			refreshData: refreshData,
			context: context
		};
		return this.triggerHandler('beforeinit', data) !== false
	},


	/**
	 * ȡ�ýڵ�ʵ������
	 */
	_getElementInstance: function(elm, name) {
		var cache = this._getElementCache(elm, 'nodeContextInstance'),
			instanceName = this.name + '.' + name;
		return cache[instanceName];
	},

	/**
	 * ���ýڵ��ʵ������
	 */
	_setElementInstance: function(elm, name, proxy) {
		var cache = this._getElementCache(elm, 'nodeContextInstance'),
			instanceName = this.name + '.' + name;
		cache[instanceName] = proxy;
	},
	
	/**
	 * ȡ�ýڵ��������
	 * @param {jquery} elm �ڵ����
	 * @name ����
	 */
	_getElementCache: function(elm, name) {
		var cache = elm.data(name);
		if (!cache) {
			cache = {};
			elm.data(name, cache);
		}
		return cache;
	},

	
	/**
	 * ��ʼ����ע���һ���ڵ�
	 * @param {object} node
	 */
	_initNode: function(node) {
		var self = this,
			elms = this._queryNodes(node.name);
		elms && $(elms).each(function() {
			self._initElement(this, node);
		});
	},
	
	/**
	 * ����ע�������ȡ�ö�Ӧdom�ڵ�
	 * ����ǰ׺Ϊ'~'������, ����body
	 * ��id��class��ʽ���Ƶ���class����
	 * 
	 * @param {string} name ע�������
	 * @return {array<element>} ����DOM�ڵ�����
	 */
	_queryNodes: function(name) {
		name = name.indexOf('~') === 0 ? 'body' : 
				/^#|\./.test(name) ? name : '.' + name;
		return $(name, this.root);
	},
	
	/**
	 * ����DOM�ڵ�ȡ��ע����Ϣ
	 * ������˳���߼�ȡ��ע����Ϣ
	 * 	1. data context-name��, attr data-context-name
	 * 	2. className
	 * 	3. ��ע���nodes name, ʹ��$(elm).is(node.name)
	 * @param (element) DOM�ڵ�
	 */
	_resolveNode: function(elm) {
		elm = $(elm);

		var cache = this._getElementCache(elm, 'nodeContextName'),
			contextName = this.name;

		// 1 from data and attr
		var name = cache[contextName];
		if (name) {
			return this._nodes[name];
		}
		
		// 2 from class name
		var cns = (elm[0].className || '').split(/\s+/);
		for (var i = 0, c = cns.length; i < c; i++) {
			var node = this._nodes[cns[i]];
			if (node) {
				cache[contextName] = node.name;
				return node;
			}
		}
		
		// 3 from registers
		for (var k in this._nodes) {
			var node = this._nodes[k];
			if (node.name.indexOf('~') !== -1 && elm.is(node.name)) {
				cache[contextName] = node.name;
				return node;
			}
		}
	},
	
	/**
	 * �Խڵ�elm���г�ʼ��
	 * @param {element} elm ��Ҫ��ʼ���Ľڵ�
	 * @param {object} node �ڵ���Ϣ���ݽṹ { name, config, options }
	 */
	_initElement: function(elm, node) {
		var elm = $(elm),
			
			config = node.config,
			options = node.options,
			
			name = options.entryName,
			entry = config[name],
			params = elm.data(options.configField),
			data = null,
			
			// һ���ڵ����ע������ʼ��context
			guard = this._getElementCache(elm, 'nodeContextGuard'),					
			guardName = this.name + '.' + node.name,

			start = $.now();

		if (!entry) {
			$.error('entry function [' + name + '] for ' + elm[0] + ' is no exist.');
		}
		// �����Ҫ, ��֤ÿ��nodeֻ��ʼ��һ��
		if (options.once && guard[guardName]) {
			return;
		}
		
		// ��try catch�е��ó�ʼ������, �Ա���һ���ڵ��ʼ��ʧ�ܲ�Ӱ�������ڵ�ĳ�ʼ��
		try {
			// ��ʼ����������false, ��ʾ�˴γ�ʼ��ʧ��(��refreshʱ���ٴγ�ʼ��)
			// ���ô����Խ����ӳټ���
			if (entry(elm[0], params, this._refreshData) === false) {
				return;
			}

			data = { element: elm[0], config: params };
			data.context = options.context ? 
					this._getElementInstance(elm, node.name) : config;
			this.triggerHandler('afterinit', data);
			options.once && (guard[guardName] = true);
			
			$.log(guardName + ' initialized, cost: ' + ($.now() - start) + ' ms');
		} catch (e) {
			$.log(node.name + ' init failed: ');
			$.error(e);
		}
	},

	getContext: function(elm) {
		var node = this._getElementNode(elm);
		if (!node) {
			return null;
		}
		return node.options.context ? 
				this._getElementInstance($(elm), node.name) : node.config;
	},

	/**
	 * ȡ��node�ṹ
	 * @param {string|element} elm ģ�����ƻ�ڵ�
	 */
	_getElementNode: function(elm) {
		return typeof elm === 'string' ? 
				this._nodes[elm] : this._resolveNode(elm);
	},

	/**
	 * ��ѯģ���ڵ��Ƿ��ѳ�ʼ��
	 * @param {element} elm ����ѯ�Ľڵ�
	 */
	isInited: function(elm) {
		elm = $(elm);

		var guard = this._getElementCache(elm, 'nodeContextGuard'),	
			node = this._resolveNode(elm);

		return guard[this.name + '.' + node.name] || false;
	},

	/**
	 * ִ��ģ���еķ���
	 * @param {element|string} elm �ڵ��������
	 * @param {string} ������
	 * @param {array} args ����
	 */
	execute: function(elm, name, args/*...*/) {
		var node = this._getElementNode(elm); 
		if (!node) {
			$.log(this.name + '.exeute(' + name +  '): node not exist, return undefined');
			return;	
		}

		var config = node.config,
			instance = null;

		args = [].slice.call(arguments, 2);

		if (node.options.context === true) {
			if (typeof elm === 'string') {
				elm = this._queryNodes(elm);
			}
			instance = this._getElementInstance($(elm), node.name);
			if (!instance) {
				$.error('instance not exist');
			}

			$.log(this.name + '.execute: ' + node.name + '#' + name);
			return instance[name].apply(instance, args);
		} else {
			$.log(this.name + '.execute: ' + node.name + '.' + name);
			return config[name].apply(config, args)
		}
	}


}, $.EventTarget);
//~ NodeContext


WP.NodeContext = NodeContext;


})(jQuery, Platform.winport);

