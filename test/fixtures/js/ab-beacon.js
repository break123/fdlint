/**
* Enhanced-Beacon
* EnBeacon: ����Flash�洢���ܵĴ��
* @author: hua.qiuh
* @date: 2010-06-11
*/
(function() {

    /**
    * ���캯��
    * @param tid String ����ID
    * @param conf Object ���ò���
    */
    FYU.EnBeacon = function(conf) {
        this.init(conf);
    }

    var _STORE = FD.SWFStore,
        _EB = FYU.EnBeacon;

    _EB.defConfig = {
        send_to: 'http://abtest.china.alibaba.com/rr.gif',
        with_timestamp: true,
        //ASID��sharedObject�еı�־
        asid_name: 'AS_CLIENT_ID',
        data: { flag:1 },
        send_after_storage_init: false
    };

    _EB.prototype = {

        /**
        * ��ʼ��
        * @param conf Object ���ò���
        */
        init: function(conf) {
            //this._asid
            //this._beaconId
            //this._fpv
            var defConf = _EB.defConfig, t = (new Date()).valueOf();
            if (conf && conf.data) {
                conf.data = FD.common.applyIf(conf.data, defConf.data);
            }
            this._data = {};
            this._t = t;
            this.config = FD.common.applyIf(conf || {}, _EB.defConfig);
            var data = this.config.data;
            for (var each in data) {
                if (data[each] != Object.prototype[each]) {
                    this._data[each] = data[each];
                }
            }

            var bid = this._getCookie('ali_beacon_id');
            if (bid) this._beaconId = bid;

            if (swfobject.hasFlashPlayerVersion('9')) {
                this._initStorage();
            }
            this.send();
        },

        /**
        * ��������
        */
        send: function() {
            var img = new Image();
            img.src = this.config['send_to'] + this._getQueryStr();
        },

        /**
        * ����Ҫ���͸��������Ķ�������
        * @param n String ����
        * @param v *    ����ֵ
        */
        setData: function(n, v) {
            this._data[n] = v;
        },


        //////////////
        // protected
        //////////////

        /**
        * ��ʼ��Flash�洢
        */
        _initStorage: function() {
            FD.widget.Flash.init(null, {
                url: 'http://img.china.alibaba.com/swfapp/swfstore/swf-mini-beacon.swf',
                width: 1,
                height: 1,
                flashvars: {
                    data: "<data cid='" 
                    + this._beaconId + "'"
                    + (this._data.tid ? " tid='"+this._data.tid + "'" : "")
                    + " flag='2' t='" + this._t + "'"
                    + " />"
                }
            })
            .write();
        },


        /**
        * ���ݿͻ��˵����������ַ���
        */
        _getQueryStr: function() {
            var data = this._data, s = '';
            if (this.config.with_timestamp) {
                //����ʱ�����ֹ����
                data.t = this._t;
            }
            if (this._storageSt) {
                data.sst = this._storageSt;
            }
            if (this._asid) {
                data.asid = this._asid;
            }
            if (this._beaconId) {
                data.cid = this._beaconId;
            }
            var fp = swfobject.getFlashPlayerVersion();
            if (fp['major'] > 0) {
                data.fpv = [fp['major'], fp['minor'], fp['release']].join('.');
            }
            for (var each in data) {
                if (data[each] != Object.prototype[each]) {
                    s += '&' + each + '=' + encodeURIComponent(data[each]);
                }
            }
            s = s.replace(/^&/, '?');
            return s;
        },

        _getCookie: function(name) {
            var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            return value ? unescape(value[1]) : '';
        }


    };


})();
