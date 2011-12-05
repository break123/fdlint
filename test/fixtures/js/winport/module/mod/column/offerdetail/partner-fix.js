/**
	 * �ϰ������ж��Ƿ��л�Ա��ϵ�������˾ɵĽṹ
	 * ����ӿ鹷Ƥ��ҩ�������µĽṹ�ж��Ƿ�partner���������� ��Ӧ����Ϣ����һ���ڵ㣩
	 * �μ�offerprototype.js
	 */
(function(){
	FYE.onDOMReady(function() {
		if (!isDiscountMember()) {
            return;
        }
        
        var notice = FYS('.dis-notice', 'mod-detail', true),
            span = FYS('span.member-discount', notice, true),
            url = '';
            
        if (span && (url = FYD.getAttribute(span, 'data-request-url'))) {
            FD.common.request('jsonp', url, { onCallback: onCallback });
        }
        
        function isDiscountMember() {
            return !!FYS('dl.member-service a.discount',null,true);  // ���̲����ۿ۽ڵ�
        }
        
        function onCallback(o) {
            span && (span.innerHTML = o.discount || '');
            FYD.setStyle(notice, 'display', 'block');
        }
    });
})();