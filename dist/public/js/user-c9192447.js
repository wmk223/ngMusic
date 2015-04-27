var musicApp=angular.module("MusicApp",["ui.router","MainModule"]);musicApp.config(["$stateProvider","$urlRouterProvider",function(e,n){n.otherwise("/index"),e.state("index",{url:"/index",views:{"":{templateUrl:"tpls/main.html"},"choose@index":{templateUrl:"tpls/choose.html"},"list@index":{templateUrl:"tpls/list.html"},"music@index":{templateUrl:"tpls/musicctrl.html"}}})}]);var mainModule=angular.module("MainModule",[]),SERVERURL="http://cors.coding.io";mainModule.directive("loadchannel",["$rootScope","MusicService","MessageService",function(e,n,t){return{restrict:"AE",link:function(o,i){i.on("click",function(o){o.stopPropagation();var a=i.attr("data-id");e.name="随心听: "+i.attr("data-name"),e.$apply(),n.updateList(a),t.channelChange(),t.loadingBroadcast(!0,"加载中...")})}}}]),mainModule.directive("pauseaudio",["MusicService",function(e){return{restrict:"A",link:function(n,t){t.on("click",function(n){n.stopPropagation(),e.playorpauseSong()})}}}]),mainModule.directive("removespan",["MusicService","MessageService",function(e,n){return{restrict:"A",link:function(n,t){t.on("click",function(n){n.stopPropagation();var o=t.parent().attr("data-index"),i=e.getSetting("isUsrPlay");i?e.removeSong(o):e.addOneSong(o,!0)})}}}]),mainModule.directive("playaudio",["MusicService",function(e){return{restrict:"AE",link:function(n,t){t.on("click",function(n){n.stopPropagation();var o=t.attr("data-index");e.getSetting("searchMode")?(e.addOneSong(o),e.changePlayer(0)):e.playSong(o)})}}}]),mainModule.directive("detectiveenter",["MusicService",function(e){return{restrict:"AE",link:function(n,t){t.on("keydown",function(n){13===n.keyCode&&e.changePlayer(2,t[0].value)})}}}]),mainModule.directive("progressdiv",["MusicService",function(e){return{restrict:"AE",link:function(n,t){function o(n){if(i){var o=t[0].getBoundingClientRect(),s=r.getBoundingClientRect().width,c=n.x-o.left;c>s?c=s:c>o.width&&(c=o.width),a.style.width=c+"px",e.setAudiocurrentTime(c/o.width)}return n.stopPropagation(),n.preventDefault(),!1}var i=!1,a=document.getElementById("currentprogress"),r=document.getElementById("loadedprogress");t.on("mousedown",function(){i=!0,document.addEventListener("mousemove",o)}),document.addEventListener("mouseup",function(e){o(e),i=!1,document.removeEventListener("mousemove",o)})}}}]),mainModule.service("MusicService",["$http","$q","$rootScope","MessageService",function(e,n,t,o){function i(e,n){for(var t in e)n.hasOwnProperty(t)&&(e[t]=n[t])}function a(){var e={};for(var n in $)$.hasOwnProperty(n)&&"audioList"!=n&&"channelList"!=n&&(e[n]=$[n]);setTimeout(function(){localStorage.setItem("shang_music",JSON.stringify({setting:e,userSongIds:x}))})}function r(){U?(U.style.width=y()*C+"px",T.style.width=P.currentTime/P.duration*C+"px"):(U=document.getElementById("loadedprogress"),E=document.getElementById("progressbar"),T=document.getElementById("currentprogress"),C=E.getBoundingClientRect().width||0)}function s(){c(($.currentIndex+1)%$.audioList.length)}function c(e){L(),(e||0===e)&&($.currentIndex=parseInt(e)),-1===$.currentIndex||$.currentIndex>=$.audioList.length||(u(),a())}function u(){P.src=$.audioList[$.currentIndex].songLink,P.play(),$.isplaying=!0,t.alltime=d($.audioList[$.currentIndex].time),t.$broadcast("current.update"),t.currentIndex=$.currentIndex,o.toastBroadcast(!0,$.audioList[$.currentIndex].songName,2e3),b=shangLrcLoad.getInstance(P,"lrcdiv"),e.get(SERVERURL+"?method=get&callback=obj&url=http://music.baidu.com"+$.audioList[$.currentIndex].lrcLink).success(function(e){b.loadNewLrc(e.data,0)}).error(function(){b.loadNewLrc("[00:00]未找到(┬＿┬)",0)})}function d(e){e=e||P.currentTime;var n=Math.floor(e/60),t=Math.round(e%60)<10?"0"+Math.round(e%60):Math.round(e%60);return n+":"+t}function l(e){b&&P&&(b.setRepaireTimeNu(parseInt(b.getRepaireTimeNu())+parseInt(e)),o.toastBroadcast(!0,b.getRepaireTimeNu()/10+"",3e3))}function g(e,n){if(!e||!e.data||!e.data.songList)return void($.audioList=[]);var t=e.data.songList,o=t.filter(function(e){return e.songLink&&/file\.qianqian\.com/.test(e.songLink)&&!/serverget\?url/.test(e.songLink)?e.songLink="http://cors4ngmusic.coding.io/?fun=fun&url="+encodeURIComponent(e.songLink):e.songLink&&(e.songLink=e.songLink.replace("http://yinyueshiting.baidu.com/data2/music/","http://musicdata.baidu.com/data2/music/")),e.rate});$.audioList=o,n&&(k=o)}function p(t){if(t&&(t=t.trim())){var o=n.defer();return e.get(SERVERURL+"?method=get&url="+encodeURIComponent("http://sug.music.baidu.com/info/suggestion?format=json&word="+t+"&version=2&from=0")).success(function(e){o.resolve(e)}).error(function(e){o.resolve("")}),o.promise}}function f(){var t=n.defer();return e.get("getchannellist").success(function(e){t.resolve(e.channel_list)}).error(function(e){t.reject(e)}),t.promise}function m(t){var o=n.defer();return e.get("getsonglink?id="+t).success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}function h(e){var n=m(e);n.then(function(e){g(e),t.$broadcast("aduioList.update")},function(e){$.audioList=[],t.$broadcast("aduioList.update")})}function v(){var e=f();e.then(function(e){$.channelList=e;var n=Math.floor(Math.random()*e.length);h(n),o.channelChange(),o.loadingBroadcast(!0,e[n].channel_name),t.name=e[n].channel_name},function(e){})}function y(){if(!P)return 0;var e=P.buffered;if(e.length){var n=e.end(e.length-1);return n/P.duration}}function L(){U&&T&&(U.style.width="0px",T.style.width="0px")}function S(e){var n=parseInt(e);return 1===$.audioList.length||-1>=n?($.audioList=[],x=[],$.currentIndex=-1,t.$broadcast("clear"),void a()):(n===$.currentIndex&&s(),$.audioList.splice(n,1),x.splice(n,1),n<=$.currentIndex&&($.currentIndex-=1),t.currentIndex=$.currentIndex,t.$broadcast("searchback.update"),void a())}var M,I=null,P=new Audio,b=null,x=[5963228],k=[],$={currentHadPlayedNu:0,audioList:[],currentIndex:-1,playMode:0,isUsrPlay:!0,isplaying:!1,channelList:[],searchMode:!1},B=localStorage.getItem("shang_music");if(B)try{var w=JSON.parse(B);M=w.setting||{},x=w.userSongIds||[]}catch(R){M={},x=[]}finally{i($,M)}P.onerror=function(){/\/null$/.test(P.src)||($.currentHadPlayedNu<=2?setTimeout(function(){P.src=$.audioList[$.currentIndex].songLink,P.play(),$.currentHadPlayedNu++},500):(clearTimeout(I),I=setTimeout(function(){$.currentHadPlayedNu=0,o.toastBroadcast(!0,"加载失败,播放下一首(┬＿┬)",1e3),s()},1e3)))},P.ontimeupdate=function(){t.time=d(),t.$apply(),r()},P.onended=function(){if(1===$.playMode)c($.currentIndex);else if(0===$.playMode)s();else{var e=$.audioList.length;c(Math.floor(Math.random()*e))}};var U=document.getElementById("loadedprogress"),E=document.getElementById("progressbar"),T=document.getElementById("currentprogress"),C=0;return t.$on("clear",function(){b=shangLrcLoad(P,"lrcdiv"),b.parseLrc(""),b.setRepaireTimeNu(0),b.init(),P.src=null,P.load()}),{channelList:f,songlink:m,getSongInfo:function(t){var o=n.defer();return e.get("getsonginfo?id="+t).success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise},updateList:h,getAudioList:function(){return $.audioList},playSong:c,playorpauseSong:function(e){e?(P.pause(),$.isplaying=!1):(P.play(),$.isplaying=!0)},playNextSong:s,playPrevSong:function(){this.playSong(($.currentIndex-1+$.audioList.length)%$.audioList.length)},getCurrentSong:function(){return $.audioList[$.currentIndex]},changePlayer:function(n,i){if(o.loadingBroadcast(!0,"加载中"),$.searchMode=!1,$.isUsrPlay=0===n,0===n){for(var a=!0,r=k.slice(0).sort(function(e,n){return e.songId-n.songId}),s=x.slice(0).sort(function(e,n){return e-n}),c=0;c<s.length;c++)r[c]&&s[c]===r[c].songId||(a=!1);if(a)return $.isUsrPlay=!0,$.audioList=k,t.$broadcast("mode.update"),void o.loadingBroadcast();o.loadingBroadcast(!0,"自定义播放列表"),e.get("getsongsbyids?data="+encodeURIComponent(JSON.stringify({ids:x}))).success(function(e){g(e,!0),$.isUsrPlay=!0,t.$broadcast("mode.update"),o.loadingBroadcast()}).error(function(e){o.loadingBroadcast()})}else if(1===n)o.loadingBroadcast(),v();else if(2===n){$.searchMode=!0,o.loadingBroadcast(!0,"搜索"+i+"中...");var u=p(i);if(!u)return o.toastBroadcast(!0,"请输入内容",3e3),void o.loadingBroadcast();u.then(function(n){$.isUsrPlay=!1;var i=n.data.song;i=i.map(function(e){return e.songid}),e.get("getsongsbyids?data="+encodeURIComponent(JSON.stringify({ids:i}))).success(function(e){g(e),t.$broadcast("search.update"),o.loadingBroadcast()}).error(function(e){o.loadingBroadcast()})})}else 3===n&&(o.loadingBroadcast(),$.audioList=k,$.isUsrPlay=!0,t.$broadcast("searchback.update"))},searchSong:p,addOneSong:function(e,n){for(var t=$.audioList[e],i=-1,r=0;r<k.length;r++)if(k[r].songId===t.songId){i=r;break}-1===i?(x.push(t.songId),k.push(t),$.currentIndex=k.length-1,o.toastBroadcast(!0,"添加成功~",3e3)):(n&&($.currentIndex=i),o.toastBroadcast(!0,"已经存在~",3e3)),n||($.audioList=k),a()},removeSong:S,getSetting:function(e){return $.hasOwnProperty(e)?$[e]:""},setSetting:function(e,n){$.hasOwnProperty(e)&&($[e]=n)},setAudiocurrentTime:function(e){try{P.currentTime=e*P.duration}catch(n){P.setAudiocurrentTime&&P.setAudiocurrentTime(e-10>0?e-10:0)}},clearProgress:L,changeLrcTime:l}}]),mainModule.service("MessageService",["$rootScope",function(e){var n=null,t=!1,o="",i=!1,a="";return{loadingBroadcast:function(e,n){this.setLoading(e||!1),this.setLoadingMsg(n||""),this.broadcast()},setLoading:function(e){t=e},getLoading:function(){return t},setLoadingMsg:function(e){o=e},getLoadingMsg:function(){return o},toastBroadcast:function(e,t,o){if(this.settoast(e||!1),this.settoastMsg(t||""),this.broadcast(),parseInt(o)){var i=this;clearTimeout(n),n=setTimeout(function(){i.toastBroadcast(!1)},parseInt(o))}},settoast:function(e){i=e},gettoast:function(){return i},settoastMsg:function(e){a=e},gettoastMsg:function(){return a},broadcast:function(){e.$broadcast("message.update")},channelChange:function(){e.$broadcast("channel.toggle")}}}]),mainModule.controller("channelCtrl",["$rootScope","$scope","MusicService","MessageService",function(e,n,t,o){function i(){n.channels=t.getSetting("channelList"),n.showhide=a?"eleDownIn":"eleDownOut",a=!a}n.isLoading=!0,n.isUsrPlay=t.getSetting("isUsrPlay"),n.toggleChannel=i,n.$on("channel.toggle",i);var a=!1;n.togglePlayer=function(){var e=t.getSetting("isUsrPlay");n.isUsrPlay=!e,a=!1,n.showhide="eleDownOut",e?(o.loadingBroadcast(!0,"切换到随心听..."),t.changePlayer(1)):(o.loadingBroadcast(!0,"切换到用户列表..."),t.changePlayer(0))}}]),mainModule.controller("listCtrl",["$rootScope","$scope","MusicService","MessageService",function(e,n,t,o){function i(e){n.songs=t.getAudioList(),o.loadingBroadcast(),t.playSong(e),n.songs.length&&o.toastBroadcast(!0,n.songs[e].songName,2e3)}n.songs=[],n.search={},e.$on("clear",function(){n.songs=[],n.$apply()}),e.$on("aduioList.update",function(){n.isUsrPlay=!1,n.isadd=!0,i(0)}),e.$on("mode.update",function(){var o=t.getSetting("isUsrPlay");e.name=o?"播放列表":"随心听",n.isUsrPlay=o,n.issearch=!1,n.isadd=!o;var a=t.getSetting("currentIndex");(a>t.getAudioList().length||-1>=a)&&(a=0),i(a)}),e.$on("searchback.update",function(){var o=t.getSetting("isUsrPlay");e.name=o?"播放列表":"随心听",n.isUsrPlay=o,n.issearch=!1,n.isadd=!1,n.songs=t.getAudioList()}),e.$on("search.update",function(){n.isUsrPlay=!1,n.issearch=!0,e.name="搜索 "+n.search.name+" 的结果",n.songs=t.getAudioList()}),n.backUsr=function(){t.changePlayer(3)},n.searchSong=function(){t.changePlayer(2,n.search.name)},n.isUsrPlay=t.getSetting("isUsrPlay");var a=navigator.userAgent;return/AppleWebKit\/(\S+)/.test(a)?void t.changePlayer(n.isUsrPlay?0:1):void(e.name="本网页只支持chrome内核浏览器\n\r原因:在不使用flash下\r\n只有chrome支持播放mp3")}]),mainModule.controller("musciCtrl",["$rootScope","$scope","MusicService",function(e,n,t){n.song={songPicRadio:"http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png"},n.playMode=t.getSetting("playMode"),n.isPlaying=t.getSetting("isplaying"),n.changePlaying=function(){t.playorpauseSong(n.isPlaying),n.isPlaying=t.getSetting("isplaying")},e.$on("current.update",function(){e.time=null;var o=t.getCurrentSong();n.isPlaying=t.getSetting("isplaying"),n.song=o,o.songPicRadio="http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png";var i=t.getSongInfo(o.songId);i.then(function(e){var t=e.data.songList;if(t&&t.length){var o=t[0],i=o.songPicRadio;o.songPicRadio=i?/http:\/\/qukufile2\.qianqian\.com/.test(i)?i.match(/http:\/\/qukufile2\.qianqian\.com.*?jpg/)[0]:"serverget?url="+encodeURIComponent(o.songPicRadio):"http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png",n.song.songPicRadio=o.songPicRadio}},function(e){n.song.songPicRadio="http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png"})}),e.$on("clear",function(){e.time=null,e.alltime=null,n.song={songPicRadio:"http://7xiblm.com1.z0.glb.clouddn.com/o_19irpgates13ec7n3a1gck1hho9.png"},n.playMode=t.getSetting("playMode"),n.isPlaying=!1,e.$apply(),n.$apply(),t.clearProgress(),t.setSetting("isplaying",!1)}),n.prev=function(){t.playPrevSong()},n.next=function(){t.playNextSong()},n.changeLoop=function(){t.setSetting("playMode",(parseInt(n.playMode)+1)%3),n.playMode=t.getSetting("playMode")},n.changeLrc=function(e){t.changeLrcTime(e)}}]),mainModule.controller("messageCtrl",["$rootScope","$scope","MessageService",function(e,n,t){n.$on("message.update",function(){n.isLoading=t.getLoading(),n.loadingMsg=t.getLoadingMsg(),n.isToast=t.gettoast(),n.toastMsg=t.gettoastMsg()})}]),shangLrcLoad=function(){function e(e,n){function t(e,n){p.push({time:e,lrcstr:n})}function o(){e.currentTime>=g-f/10&&(i(),o())}function i(){if(l++,"undefined"!=typeof p[l]){clearInterval(h),g=p[l].time,m[l-2].className="",m[l-1].className="current";var e=m[l-1].moveHeight-m[0].moveHeight-y;e=e>0?parseInt(e):0;var n=v,t=n.scrollTop;h=setInterval(function(){var o=-8,i=(e-t)/-o;i=i>0?Math.ceil(i):Math.floor(i);var a=t+i;n.scrollTop=a,e===a&&clearInterval(h),t=a},30)}}function a(){t(0,""),t(0,""),t(999999,""),p.sort(function(e,n){return e.time-n.time});var e=document.createElement("div");v.appendChild(e);for(var n=0;n<p.length;n++){var o=document.createElement("p");m.push(o),o.innerHTML=p[n].lrcstr,e.appendChild(o),o.moveHeight=o.offsetTop}}function r(e){for(var n=e.split("\n"),o=0;o<n.length;o++)for(var i=n[o].split("]"),a=0;a<i.length-1;a++){var r=i[a].match(/(\d+)\:(\d+)((\.|\:)(\d+))?/);r&&!/^\s*$/.test(i[i.length-1])&&t(60*(+r[1]||0)+(+r[2]||0)+(+r[4]||0)/100,i[i.length-1])}}function s(){for(var e=0;e<m.length;e++)m[e].className=""}function c(e){f=e}function u(){return f}function d(e,n){v.innerHTML="",l=1,g=-1,p=[],m=[],r(e),a(),c(n||0)}e="string"==typeof e?document.getElementById(e):e,n="string"==typeof n?document.getElementById(n):n;var l=1,g=-1,p=[],f=0,m=[],h=null,v=document.createElement("div"),y=n.getBoundingClientRect().height/2-50;e.addEventListener("seeked",function(){l=1,g=-1}),e.addEventListener("timeupdate",function(){o()}),v.id="shang_lrc_div",n.appendChild(v);var L=document.createElement("style");return L.type="text/css",L.innerHTML="#shang_lrc_div{margin:0;padding:0;overflow-y:scroll;overflow-x:hidden;height:100%}#shang_lrc_div::-webkit-scrollbar{width:5px;height:5px;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-button{display:none}#shang_lrc_div::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-corner{display:none}.current{color:blueviolet;font-weight:bold}",document.getElementsByTagName("head")[0].appendChild(L),{init:a,parseLrc:r,clearClass:s,setRepaireTimeNu:c,getRepaireTimeNu:u,loadNewLrc:d}}var n=null;return{getInstance:function(t,o){return n||(n=e(t,o)),n}}}();