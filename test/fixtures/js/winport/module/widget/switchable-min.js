(function(d,c){var b=d.extend({_initSwitchable:function(h,g){g=this.options=g||{};this.elements=d(h);this.length=this.elements.length;this.effect=this._getEffect(g.effect);this.index=-1},_getEffect:function(g){g=g||"default";return typeof g==="string"?this.Effect[g]:d.isFunction(g)?{show:g}:g},switchTo:function(l){if(!this.length){return}var o=this,g=this.elements,k=this.index||0,m=k===-1?null:g[k],h=this._getNewIndex(l||0),n=h===-1?null:g[h],i={lastIndex:k,lastElm:m,nowIndex:h,nowElm:n},j=this.effect.hide||this._empty;if(k===h||!this._confirm(i)){return}if(!m){return this._showElm(i)}j(m,function(){d(m).removeClass("selected");o._showElm(i)})},_getNewIndex:function(g){var h=this.index;if(g==="prev"){h--}else{if(g==="next"){h++}else{h=parseInt(g,10)}}return g===-1?-1:(h+this.length)%this.length},_empty:function(h,g){g()},_confirm:function(i){var h=this.options,g=h.onbefore;if(g&&g.call(h,i)===false){return false}return this.triggerHandler("before",i)!==false},_showElm:function(i){var h=this,k=this.options.onswitch,g=this.effect.show||this._empty,l=i.nowIndex,j=i.nowElm;if(l===-1){return}d.log("switch to "+l);g(j,function(){d(j).addClass("selected");h.index=l;k&&k.call(h.options,i);h.trigger("switch",i)})}},d.EventTarget);d.extend(b,{__initSwitchable:b._initSwitchable,_initSwitchable:function(){this.__initSwitchable.apply(this,arguments);var g=this.options.autoSwitch;if(!g||this.length<=1){return}this._initAutoSwitch(g===true?{}:g)},_initAutoSwitch:function(j){var h=this,g=j.interval||5000,i=j.hoverStop,k=j.next||"default";flag=true;i&&d(i).hover(function(){flag=false},function(){flag=true});k=typeof k==="function"?k:b.AutoSwitch[k];handler=function(){var l=k(h.index,h.length);flag&&h.switchTo(l);setTimeout(handler,g)};setTimeout(handler,g)}});b.AutoSwitch={"default":function(g,h){g++;return g%h},random:function(h,i){var g=-1;while(h===(g=Math.floor(Math.random()*i))){}return g}};b.Effect={"default":{show:function(h,g){d(h).show();g()},hide:function(h,g){d(h).hide();g()}}};var f=function(){this._initSwitchable.apply(this,arguments)};d.extend(f.prototype,b);var e=function(){this._init.apply(this,arguments)};d.extend(e.prototype,b,{_init:function(g,i,h){h=h||{};this._initSwitchable(i,h);this._handlePaging(g,h);this.switchTo(h.index)},_handlePaging:function(h,i){var g=this,k=i.delegate,l=i.event||"click",j=function(o){o.preventDefault();var n=d(this).attr("data-paging");if(n==="prev"&&g.index===0||n==="next"&&g.index===g.length-1){return}g.switchTo(n)},m=d(h,k);if(k){d(k).delegate(h,l,j)}else{m.bind(l,j)}this._handlePagingEffect(m)},_handlePagingEffect:function(j){var g=this,i=d(j).filter("[data-paging=prev]"),h=d(j).filter("[data-paging=next]");this.bind("switch",function(n,l){var k=l.nowIndex,m=d(j).filter("[data-paging="+k+"]");j.removeClass("disabled selected");k===0&&i.addClass("disabled");k===g.length-1&&h.addClass("disabled");m.addClass("selected")})}});var a=function(){this._init.apply(this,arguments)};d.extend(a.prototype,b,{_init:function(h,i,g){g=g||{};this._initSwitchable(i,g);this._handleTabs(h,g);this.switchTo(g.index)},_handleTabs:function(i,h){var g=this,k=h.delegate,l=h.event||"click",j=function(m){var n=d(this);n.is("a")&&m.preventDefault();if(n.is(":radio,:checkbox")&&!this.checked){return}g.switchTo(i.index(n))};i=d(i,k);if(k){d(k).delegate(i,l,j)}else{i.bind(l,j)}this._handleEffect(i)},_handleEffect:function(g){this.bind("switch",function(i,h){g.removeClass("selected");g.eq(h.nowIndex).addClass("selected")})}});d.extend(c.widget,{Switchable:b,Switcher:b,PagingSwitcher:e,Tabs:a});d.add("wp-switchable")})(jQuery,Platform.winport);