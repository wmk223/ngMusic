function shangLrcLoad(e,n){var t={};t.currentNu=1,t.nextUpdateTime=-1,t.lrc=[],t.audioObj="string"==typeof e?document.getElementById(e):e,t.lrcObj="string"==typeof n?document.getElementById(n):n,t.lrchtmlarr=[],t.divContent=document.createElement("div"),t.repaireTimeNu=0;var r=null;return t.addLrc=function(e,n){t.lrc.push({time:e,lrcstr:n})},t.parseLrc=function(e){for(var n=e.split("\n"),r=0;r<n.length;r++)for(var o=n[r].split("]"),i=0;i<o.length-1;i++){var a=o[i].match(/(\d+)\:(\d+)((\.|\:)(\d+))?/);a&&!/^\s*$/.test(o[o.length-1])&&t.addLrc(60*(+a[1]||0)+(+a[2]||0)+(+a[4]||0)/100,o[o.length-1])}},t.checkUpdate=function(){t.audioObj.currentTime>=t.nextUpdateTime-t.repaireTimeNu/10&&(t.scrollLrc(),t.checkUpdate())},t.clearClass=function(){for(var e=0;e<t.lrchtmlarr.length;e++)t.lrchtmlarr[e].className=""},t.scrollLrc=function(){if(t.currentNu++,"undefined"!=typeof t.lrc[t.currentNu]){clearInterval(r),t.nextUpdateTime=t.lrc[t.currentNu].time,t.lrchtmlarr[t.currentNu-2].className="",t.lrchtmlarr[t.currentNu-1].className="current";var e=t.lrchtmlarr[t.currentNu-1].moveHeight-300;e=e>0?parseInt(e):0;var n=t.divContent,o=n.scrollTop;r=setInterval(function(){var t=-8,i=(e-o)/-t;i=i>0?Math.ceil(i):Math.floor(i);var a=o+i;n.scrollTop=a,e===a&&clearInterval(r),o=a},30)}},t.init=function(){if(t.addLrc(0,""),t.addLrc(0,""),t.addLrc(999999,""),t.lrc.sort(function(e,n){return e.time-n.time}),t.audioObj.addEventListener("seeked",function(){t.currentNu=1,t.nextUpdateTime=-1}),t.audioObj.addEventListener("timeupdate",function(){t.checkUpdate()}),!window.is_shang_lrc_css){var e=document.createElement("style");e.type="text/css",e.innerHTML="#shang_lrc_div{margin:0;padding:0;overflow-y:scroll;overflow-x:hidden;height:100%}#shang_lrc_div::-webkit-scrollbar{width:5px;height:5px;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-button{display:none}#shang_lrc_div::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-corner{display:none}.current{color:blueviolet;font-weight:bold}",document.getElementsByTagName("head")[0].appendChild(e),window.is_shang_lrc_css=!0}t.divContent.id="shang_lrc_div",t.lrcObj.innerHTML="",t.lrcObj.appendChild(t.divContent);var n=document.createElement("div");t.divContent.appendChild(n);for(var r=0;r<t.lrc.length;r++){var o=document.createElement("p");t.lrchtmlarr.push(o),o.innerHTML=t.lrc[r].lrcstr,n.appendChild(o),o.moveHeight=o.offsetTop}},t}var musicApp=angular.module("MusicApp",["ui.router","MainModule"]);musicApp.config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/index"),e.state("index",{url:"/index",views:{"":{templateUrl:"tpls/main.html"},"choose@index":{templateUrl:"tpls/choose.html"},"list@index":{templateUrl:"tpls/list.html"},"music@index":{templateUrl:"tpls/musicctrl.html"}}})}]);var mainModule=angular.module("MainModule",[]),SERVERURL="http://cors.coding.io";mainModule.directive("loadchannel",["$rootScope","MusicService","MessageService",function(e,n,t){return{restrict:"AE",link:function(r,o){o.on("click",function(r){r.stopPropagation();var i=o.attr("data-id");e.name="随心听: "+o.attr("data-name"),e.$apply(),n.updateList(i),t.channelChange(),t.loadingBroadcast(!0,"加载中...")})}}}]),mainModule.directive("pauseaudio",["MusicService",function(e){return{restrict:"A",link:function(n,t){t.on("click",function(n){n.stopPropagation(),e.playorpauseSong()})}}}]),mainModule.directive("removespan",["MusicService","MessageService",function(e,n){return{restrict:"A",link:function(n,t){t.on("click",function(n){n.stopPropagation();var r=t.parent().attr("data-index"),o=e.getSetting("isUsrPlay");o?e.removeSong(r):e.addOneSong(r,!0)})}}}]),mainModule.directive("playaudio",["MusicService",function(e){return{restrict:"AE",link:function(n,t){t.on("click",function(n){n.stopPropagation();var r=t.attr("data-index");e.getSetting("searchMode")?(e.addOneSong(r),e.changePlayer(0)):e.playSong(r)})}}}]),mainModule.directive("detectiveenter",["MusicService",function(e){return{restrict:"AE",link:function(n,t){t.on("keydown",function(n){13===n.keyCode&&e.changePlayer(2,t[0].value)})}}}]),mainModule.directive("progressdiv",["MusicService",function(e){return{restrict:"AE",link:function(n,t){function r(n){if(o){var r=t[0].getBoundingClientRect(),s=a.getBoundingClientRect().width,c=n.x-r.left;c>s?c=s:c>r.width&&(c=r.width),i.style.width=c+"px",e.setAudiocurrentTime(c/r.width)}return n.stopPropagation(),n.preventDefault(),!1}var o=!1,i=document.getElementById("currentprogress"),a=document.getElementById("loadedprogress");t.on("mousedown",function(){o=!0,document.addEventListener("mousemove",r)}),document.addEventListener("mouseup",function(e){r(e),o=!1,document.removeEventListener("mousemove",r)})}}}]),mainModule.service("MusicService",["$http","$q","$rootScope","MessageService",function(e,n,t,r){function o(e,n){for(var t in e)n.hasOwnProperty(t)&&(e[t]=n[t])}function i(){var e={};for(var n in $)$.hasOwnProperty(n)&&"audioList"!=n&&"channelList"!=n&&(e[n]=$[n]);setTimeout(function(){localStorage.setItem("shang_music",JSON.stringify({setting:e,userSongIds:x}))})}function a(){T?(T.style.width=y()*C+"px",E.style.width=b.currentTime/b.duration*C+"px"):(T=document.getElementById("loadedprogress"),N=document.getElementById("progressbar"),E=document.getElementById("currentprogress"),C=N.getBoundingClientRect().width||0)}function s(){c(($.currentIndex+1)%$.audioList.length)}function c(e){L(),(e||0===e)&&($.currentIndex=parseInt(e)),-1===$.currentIndex||$.currentIndex>=$.audioList.length||(u(),i())}function u(){b.src=$.audioList[$.currentIndex].songLink,b.play(),$.isplaying=!0,t.alltime=d($.audioList[$.currentIndex].time),t.$broadcast("current.update"),t.currentIndex=$.currentIndex,r.toastBroadcast(!0,$.audioList[$.currentIndex].songName,2e3),P=shangLrcLoad(b,"lrcdiv"),e.get(SERVERURL+"?method=get&callback=obj&url=http://music.baidu.com"+$.audioList[$.currentIndex].lrcLink).success(function(e){P.parseLrc(e.data),P.repaireTimeNu=0,P.init()}).error(function(){P.parseLrc("[00:00]未找到(┬＿┬)"),P.repaireTimeNu=0,P.init()})}function d(e){e=e||b.currentTime;var n=Math.floor(e/60),t=Math.round(e%60)<10?"0"+Math.round(e%60):Math.round(e%60);return n+":"+t}function l(e){P&&b&&(P.repaireTimeNu=parseInt(P.repaireTimeNu)+parseInt(e),r.toastBroadcast(!0,P.repaireTimeNu/10+"",3e3))}function g(e,n){if(!e||!e.data||!e.data.songList)return void($.audioList=[]);var t=e.data.songList,r=t.filter(function(e){return e.songLink&&/file\.qianqian\.com/.test(e.songLink)&&!/serverget\?url/.test(e.songLink)?e.songLink="serverget?url="+encodeURIComponent(e.songLink):e.songLink&&(e.songLink=e.songLink.replace("http://yinyueshiting.baidu.com/data2/music/","http://musicdata.baidu.com/data2/music/")),e.rate});$.audioList=r,n&&(k=r)}function p(t){if(t&&(t=t.trim())){var r=n.defer();return e.get(SERVERURL+"?method=get&url="+encodeURIComponent("http://sug.music.baidu.com/info/suggestion?format=json&word="+t+"&version=2&from=0")).success(function(e){r.resolve(e)}).error(function(e){r.resolve("")}),r.promise}}function m(){var t=n.defer();return e.get("getchannellist").success(function(e){t.resolve(e.channel_list)}).error(function(e){t.reject(e)}),t.promise}function h(t){var r=n.defer();return e.get("getsonglink?id="+t).success(function(e){r.resolve(e)}).error(function(e){r.reject(e)}),r.promise}function f(e){var n=h(e);n.then(function(e){g(e),t.$broadcast("aduioList.update")},function(e){$.audioList=[],t.$broadcast("aduioList.update")})}function v(){var e=m();e.then(function(e){$.channelList=e;var n=Math.floor(Math.random()*e.length);f(n),r.channelChange(),r.loadingBroadcast(!0,e[n].channel_name),t.name=e[n].channel_name},function(e){})}function y(){if(!b)return 0;var e=b.buffered;if(e.length){var n=e.end(e.length-1);return n/b.duration}}function L(){T&&E&&(T.style.width="0px",E.style.width="0px")}function S(e){var n=parseInt(e);return 1===$.audioList.length||-1>=n?($.audioList=[],x=[],$.currentIndex=-1,t.$broadcast("clear"),void i()):(n===$.currentIndex&&s(),$.audioList.splice(n,1),x.splice(n,1),n<=$.currentIndex&&($.currentIndex-=1),t.currentIndex=$.currentIndex,t.$broadcast("searchback.update"),void i())}var M,I=null,b=new Audio,P=null,x=[5963228],k=[],$={currentHadPlayedNu:0,audioList:[],currentIndex:-1,playMode:0,isUsrPlay:!0,isplaying:!1,channelList:[],searchMode:!1},B=localStorage.getItem("shang_music");if(B)try{var U=JSON.parse(B);M=U.setting||{},x=U.userSongIds||[]}catch(w){M={},x=[]}finally{o($,M)}b.onerror=function(){/\/null$/.test(b.src)||($.currentHadPlayedNu<=2?setTimeout(function(){b.src=$.audioList[$.currentIndex].songLink,b.play(),$.currentHadPlayedNu++},500):(clearTimeout(I),I=setTimeout(function(){$.currentHadPlayedNu=0,r.toastBroadcast(!0,"加载失败,播放下一首(┬＿┬)",1e3),s()},1e3)))},b.ontimeupdate=function(){t.time=d(),t.$apply(),a()},b.onended=function(){if(1===$.playMode)c($.currentIndex);else if(0===$.playMode)s();else{var e=$.audioList.length;c(Math.floor(Math.random()*e))}};var T=document.getElementById("loadedprogress"),N=document.getElementById("progressbar"),E=document.getElementById("currentprogress"),C=0;return t.$on("clear",function(){P=shangLrcLoad(b,"lrcdiv"),P.parseLrc(""),P.repaireTimeNu=0,P.init(),b.src=null,b.load()}),{channelList:m,songlink:h,getSongInfo:function(t){var r=n.defer();return e.get("getsonginfo?id="+t).success(function(e){r.resolve(e)}).error(function(e){r.reject(e)}),r.promise},updateList:f,getAudioList:function(){return $.audioList},playSong:c,playorpauseSong:function(e){e?(b.pause(),$.isplaying=!1):(b.play(),$.isplaying=!0)},playNextSong:s,playPrevSong:function(){this.playSong(($.currentIndex-1+$.audioList.length)%$.audioList.length)},getCurrentSong:function(){return $.audioList[$.currentIndex]},changePlayer:function(n,o){if(r.loadingBroadcast(!0,"加载中"),$.searchMode=!1,$.isUsrPlay=0===n,0===n){for(var i=!0,a=k.slice(0).sort(function(e,n){return e.songId-n.songId}),s=x.slice(0).sort(function(e,n){return e-n}),c=0;c<s.length;c++)a[c]&&s[c]===a[c].songId||(i=!1);if(i)return $.isUsrPlay=!0,$.audioList=k,t.$broadcast("mode.update"),void r.loadingBroadcast();r.loadingBroadcast(!0,"自定义播放列表"),e.get("getsongsbyids?data="+encodeURIComponent(JSON.stringify({ids:x}))).success(function(e){g(e,!0),$.isUsrPlay=!0,t.$broadcast("mode.update"),r.loadingBroadcast()}).error(function(e){r.loadingBroadcast()})}else if(1===n)r.loadingBroadcast(),v();else if(2===n){$.searchMode=!0,r.loadingBroadcast(!0,"搜索"+o+"中...");var u=p(o);if(!u)return r.toastBroadcast(!0,"请输入内容",3e3),void r.loadingBroadcast();u.then(function(n){$.isUsrPlay=!1;var o=n.data.song;o=o.map(function(e){return e.songid}),e.get("getsongsbyids?data="+encodeURIComponent(JSON.stringify({ids:o}))).success(function(e){g(e),t.$broadcast("search.update"),r.loadingBroadcast()}).error(function(e){r.loadingBroadcast()})})}else 3===n&&(r.loadingBroadcast(),$.audioList=k,$.isUsrPlay=!0,t.$broadcast("searchback.update"))},searchSong:p,addOneSong:function(e,n){for(var t=$.audioList[e],o=-1,a=0;a<k.length;a++)if(k[a].songId===t.songId){o=a;break}-1===o?(x.push(t.songId),k.push(t),$.currentIndex=k.length-1,r.toastBroadcast(!0,"添加成功~",3e3)):(n&&($.currentIndex=o),r.toastBroadcast(!0,"已经存在~",3e3)),n||($.audioList=k),i()},removeSong:S,getSetting:function(e){return $.hasOwnProperty(e)?$[e]:""},setSetting:function(e,n){$.hasOwnProperty(e)&&($[e]=n)},setAudiocurrentTime:function(e){try{b.currentTime=e*b.duration}catch(n){b.setAudiocurrentTime&&b.setAudiocurrentTime(e-10>0?e-10:0)}},clearProgress:L,changeLrcTime:l}}]),mainModule.service("MessageService",["$rootScope",function(e){var n=null,t=!1,r="",o=!1,i="";return{loadingBroadcast:function(e,n){this.setLoading(e||!1),this.setLoadingMsg(n||""),this.broadcast()},setLoading:function(e){t=e},getLoading:function(){return t},setLoadingMsg:function(e){r=e},getLoadingMsg:function(){return r},toastBroadcast:function(e,t,r){if(this.settoast(e||!1),this.settoastMsg(t||""),this.broadcast(),parseInt(r)){var o=this;clearTimeout(n),n=setTimeout(function(){o.toastBroadcast(!1)},parseInt(r))}},settoast:function(e){o=e},gettoast:function(){return o},settoastMsg:function(e){i=e},gettoastMsg:function(){return i},broadcast:function(){e.$broadcast("message.update")},channelChange:function(){e.$broadcast("channel.toggle")}}}]),mainModule.controller("channelCtrl",["$rootScope","$scope","MusicService","MessageService",function(e,n,t,r){function o(){n.channels=t.getSetting("channelList"),n.showhide=i?"eleDownIn":"eleDownOut",i=!i}n.isLoading=!0,n.isUsrPlay=t.getSetting("isUsrPlay"),n.toggleChannel=o,n.$on("channel.toggle",o);var i=!1;n.togglePlayer=function(){var e=t.getSetting("isUsrPlay");n.isUsrPlay=!e,i=!1,n.showhide="eleDownOut",e?(r.loadingBroadcast(!0,"切换到随心听..."),t.changePlayer(1)):(r.loadingBroadcast(!0,"切换到用户列表..."),t.changePlayer(0))}}]),mainModule.controller("listCtrl",["$rootScope","$scope","MusicService","MessageService",function(e,n,t,r){function o(e){n.songs=t.getAudioList(),r.loadingBroadcast(),t.playSong(e),n.songs.length&&r.toastBroadcast(!0,n.songs[e].songName,2e3)}n.songs=[],n.search={},e.$on("clear",function(){n.songs=[],n.$apply()}),e.$on("aduioList.update",function(){n.isUsrPlay=!1,n.isadd=!0,o(0)}),e.$on("mode.update",function(){var r=t.getSetting("isUsrPlay");e.name=r?"播放列表":"随心听",n.isUsrPlay=r,n.issearch=!1,n.isadd=!r;var i=t.getSetting("currentIndex");(i>t.getAudioList().length||-1>=i)&&(i=0),o(i)}),e.$on("searchback.update",function(){var r=t.getSetting("isUsrPlay");e.name=r?"播放列表":"随心听",n.isUsrPlay=r,n.issearch=!1,n.isadd=!1,n.songs=t.getAudioList()}),e.$on("search.update",function(){n.isUsrPlay=!1,n.issearch=!0,e.name="搜索 "+n.search.name+" 的结果",n.songs=t.getAudioList()}),n.backUsr=function(){t.changePlayer(3)},n.searchSong=function(){t.changePlayer(2,n.search.name)},n.isUsrPlay=t.getSetting("isUsrPlay");var i=navigator.userAgent;return/AppleWebKit\/(\S+)/.test(i)?void t.changePlayer(n.isUsrPlay?0:1):void(e.name="本网页只支持chrome内核浏览器\n\r原因:在不使用flash下\r\n只有chrome支持播放mp3")}]),mainModule.controller("musciCtrl",["$rootScope","$scope","MusicService",function(e,n,t){n.song={songPicRadio:"http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png"},n.playMode=t.getSetting("playMode"),n.isPlaying=t.getSetting("isplaying"),n.changePlaying=function(){t.playorpauseSong(n.isPlaying),n.isPlaying=t.getSetting("isplaying")},e.$on("current.update",function(){e.time=null;var r=t.getCurrentSong();n.isPlaying=t.getSetting("isplaying"),n.song=r,r.songPicRadio="http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png";var o=t.getSongInfo(r.songId);o.then(function(e){var t=e.data.songList;if(t&&t.length){var r=t[0],o=r.songPicRadio;r.songPicRadio=o?/http:\/\/qukufile2\.qianqian\.com/.test(o)?o.match(/http:\/\/qukufile2\.qianqian\.com.*?jpg/)[0]:"serverget?url="+encodeURIComponent(r.songPicRadio):"http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png",n.song.songPicRadio=r.songPicRadio}},function(e){n.song.songPicRadio="http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png"})}),e.$on("clear",function(){e.time=null,e.alltime=null,n.song={songPicRadio:"http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png"},n.playMode=t.getSetting("playMode"),n.isPlaying=!1,e.$apply(),n.$apply(),t.clearProgress(),t.setSetting("isplaying",!1)}),n.prev=function(){t.playPrevSong()},n.next=function(){t.playNextSong()},n.changeLoop=function(){t.setSetting("playMode",(parseInt(n.playMode)+1)%3),n.playMode=t.getSetting("playMode")},n.changeLrc=function(e){t.changeLrcTime(e)}}]),mainModule.controller("messageCtrl",["$rootScope","$scope","MessageService",function(e,n,t){n.$on("message.update",function(){n.isLoading=t.getLoading(),n.loadingMsg=t.getLoadingMsg(),n.isToast=t.gettoast(),n.toastMsg=t.gettoastMsg()})}]);