/**
 *
 * @param oAudio audio对象 或者 id
 * @param oLrc Lrc对象 或者 id
 * @returns {{}}
 */
shangLrcLoad = (function() {

    var instantiated = null;    // 单例

    // 初始化单例
    function _instance(oAudio, oLrc) {

        // audio对象
        oAudio = typeof(oAudio) === 'string' ? document.getElementById(oAudio) : oAudio;
        // Lrc对象
        oLrc = (typeof(oLrc) === 'string') ? document.getElementById(oLrc) : oLrc;

        var _currentNu = 1;         // 当前播放歌词
        var _nextUpdateTime = -1;   // 下一次更新时间
        var _lrcArr = [];           // 歌词数组
        var _repaireTimeNu = 0;     // 歌词快慢的 时间修正
        var _lrcArrhtmlarr = [];    // 歌词 前台显示数组
        var _scrollTimer = null;    // 滚动 动画的 定时器
        var _divContent = document.createElement('div');   // 放入歌词的 div
        var _repaireHeight = oLrc.getBoundingClientRect().height / 2 - 50;  // 修正歌词显示高度

        /**
         * 添加一句歌词
         * @param time   歌词播放时间
         * @param lrcstr  歌词内容
         * @private
         */
        function _addLrc(time, lrcstr) {
            _lrcArr.push({
                'time': time,
                'lrcstr': lrcstr
            });
        }

        /**
         * 检查 是否需要滚动
         * @private
         */
        function _checkUpdate() {
            if (oAudio.currentTime >= _nextUpdateTime - _repaireTimeNu / 10) {
                _scrollLrc();
                _checkUpdate();
            }
        }


        /**
         * 滚动歌词
         * @private
         */
        function _scrollLrc() {
            // 当前 在第几句歌词上
            _currentNu++;
            // 判断越界问题
            if (typeof _lrcArr[_currentNu] !== "undefined") {

                // 当多次调用是清除上次 的setInterval
                clearInterval(_scrollTimer);
                // 下一次歌词更新时间
                _nextUpdateTime = _lrcArr[_currentNu].time;
                // 清除和添加高亮样式
                _lrcArrhtmlarr[_currentNu - 2].className = '';
                _lrcArrhtmlarr[_currentNu - 1].className = 'current';

                // 歌词要移动的目标位置
                var target = _lrcArrhtmlarr[_currentNu - 1].moveHeight - _lrcArrhtmlarr[0].moveHeight - _repaireHeight;
                target = target > 0 ? parseInt(target) : 0;
                var obj = _divContent;
                var currentTop = obj.scrollTop;
                // 滚动歌词
                _scrollTimer = setInterval(function() {
                    var dir = -8;
                    var curspeed = (target - currentTop) / -dir;
                    curspeed = curspeed > 0 ? Math.ceil(curspeed) : Math.floor(curspeed);
                    var targetTop = currentTop + curspeed;
                    obj.scrollTop = targetTop;

                    if (target === targetTop) {
                        clearInterval(_scrollTimer);
                    }
                    currentTop = targetTop;
                }, 30);
            }
        }


        // 添加监听
        oAudio.addEventListener("seeked", function() {
            _currentNu = 1;
            _nextUpdateTime = -1;
        });
        oAudio.addEventListener("timeupdate", function() {
            _checkUpdate();
        });


        _divContent.id = 'shang_lrc_div';
        oLrc.appendChild(_divContent);
        // 设置相对定位的父元素
        oLrc.style.position = 'relative';

        // 设置 样式和定位
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        cssStyle.innerHTML = '#shang_lrc_div{margin:0;padding:0;overflow-y:scroll;overflow-x:hidden;height:100%; width:100%; position: absolute}#shang_lrc_div::-webkit-scrollbar{width:5px;height:5px;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-button{display:none}#shang_lrc_div::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-corner{display:none}.current{color:blueviolet;font-weight:bold}';
        document.getElementsByTagName('head')[0].appendChild(cssStyle);


        /**
         * 初始化歌词函数
         */
        function init() {
            _addLrc(0, '');         // 添加2个空语句
            _addLrc(0, '');
            _addLrc(999999, '');   // 添加最后的空语句
            // 按照时间排序    [因为有些歌词重复歌词 [00:00:01][00:10:00]相同歌词 ]
            _lrcArr.sort(function(a, b) {
                return a.time - b.time;
            });

            // 内层 div; 用以添加 P标签
            var tempDiv = document.createElement('div');
            _divContent.appendChild(tempDiv);

            for (var i = 0; i < _lrcArr.length; i++) {
                var ptemp = document.createElement('p');
                // 将每次生成的P放入数组
                _lrcArrhtmlarr.push(ptemp);
                // 添加显示内容
                ptemp.innerHTML = _lrcArr[i].lrcstr;
                // 显示P标签
                tempDiv.appendChild(ptemp);
                // 计算P标签的高度
                ptemp.moveHeight = ptemp.offsetTop;
            }
        }

        // 歌词解析
        function parseLrc(lrcstr) {
            var lrclines = lrcstr.split('\n');
            for (var i = 0; i < lrclines.length; i++) {
                var timeandlrc = lrclines[i].split(']');
                for (var j = 0; j < timeandlrc.length - 1; j++) {
                    var timetemp = timeandlrc[j].match(/(\d+)\:(\d+)((\.|\:)(\d+))?/);

                    if (timetemp && !/^\s*$/.test(timeandlrc[timeandlrc.length - 1])) {
                        _addLrc((+timetemp[1] || 0) * 60 + (+timetemp[2] || 0) + (+timetemp[4] || 0) / 100,
                            timeandlrc[timeandlrc.length - 1]);
                    }
                }
            }
        }

        // 清除 高亮显示
        function clearClass() {
            for (var i = 0; i < _lrcArrhtmlarr.length; i++) {
                _lrcArrhtmlarr[i].className = '';
            }
        }

        // 修正歌词播放时间 (即可能歌词慢了0.1s)
        function setRepaireTimeNu(nu) {
            _repaireTimeNu = nu;
        }

        // 获取修正时间
        function getRepaireTimeNu() {
            return _repaireTimeNu;
        }

        // 载入新的lrc
        function loadNewLrc(data, repaireTime) {
            // 清楚和复位
            _divContent.innerHTML = '';
            _currentNu = 1;
            _nextUpdateTime = -1;
            _lrcArr = [];
            _lrcArrhtmlarr = [];

            parseLrc(data);
            init();
            setRepaireTimeNu(repaireTime || 0);
        }

        return {
            init: init,                         // 初始化
            parseLrc: parseLrc,                 // 解析lrc
            clearClass: clearClass,             // 清除 高亮
            setRepaireTimeNu: setRepaireTimeNu, //  修正歌词播放时间
            getRepaireTimeNu: getRepaireTimeNu,
            loadNewLrc: loadNewLrc              // 载入新的歌词 [包含了init和parseLrc和setRepaireTimeNu]
        }
    }

    return {
        // 返回获取单例
        getInstance: function(oAudio, oLrc) {
            if (!instantiated) {
                instantiated = _instance(oAudio, oLrc);
            }
            return instantiated;
        }
    };
}());
