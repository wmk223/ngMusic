shangLrcLoad=function(){function e(e,t){function n(e,t){p.push({time:e,lrcstr:t})}function r(){e.currentTime>=h-v/10&&(i(),r())}function i(){if(u++,"undefined"!=typeof p[u]){clearInterval(m),h=p[u].time,g[u-2].className="",g[u-1].className="current";var e=g[u-1].moveHeight-g[0].moveHeight-b;e=e>0?parseInt(e):0;var t=f,n=t.scrollTop;m=setInterval(function(){var r=-8,i=(e-n)/-r;i=i>0?Math.ceil(i):Math.floor(i);var a=n+i;t.scrollTop=a,e===a&&clearInterval(m),n=a},30)}}function a(){n(0,""),n(0,""),n(999999,""),p.sort(function(e,t){return e.time-t.time});var e=document.createElement("div");f.appendChild(e);for(var t=0;t<p.length;t++){var r=document.createElement("p");g.push(r),r.innerHTML=p[t].lrcstr,e.appendChild(r),r.moveHeight=r.offsetTop}}function l(e){for(var t=e.split("\n"),r=0;r<t.length;r++)for(var i=t[r].split("]"),a=0;a<i.length-1;a++){var l=i[a].match(/(\d+)\:(\d+)((\.|\:)(\d+))?/);l&&!/^\s*$/.test(i[i.length-1])&&n(60*(+l[1]||0)+(+l[2]||0)+(+l[4]||0)/100,i[i.length-1])}}function o(){for(var e=0;e<g.length;e++)g[e].className=""}function c(e){v=e}function d(){return v}function s(e,t){f.innerHTML="",u=1,h=-1,p=[],g=[],l(e),a(),c(t||0)}e="string"==typeof e?document.getElementById(e):e,t="string"==typeof t?document.getElementById(t):t;var u=1,h=-1,p=[],v=0,g=[],m=null,f=document.createElement("div"),b=t.getBoundingClientRect().height/2-50;e.addEventListener("seeked",function(){u=1,h=-1}),e.addEventListener("timeupdate",function(){r()}),f.id="shang_lrc_div",t.appendChild(f),t.style.position="relative";var y=document.createElement("style");return y.type="text/css",y.innerHTML="#shang_lrc_div{margin:0;padding:0;overflow-y:scroll;overflow-x:hidden;height:100%; width:100%; position: absolute}#shang_lrc_div::-webkit-scrollbar{width:5px;height:5px;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-button{display:none}#shang_lrc_div::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px}#shang_lrc_div::-webkit-scrollbar-corner{display:none}.current{color:blueviolet;font-weight:bold}",document.getElementsByTagName("head")[0].appendChild(y),{init:a,parseLrc:l,clearClass:o,setRepaireTimeNu:c,getRepaireTimeNu:d,loadNewLrc:s}}var t=null;return{getInstance:function(n,r){return t||(t=e(n,r)),t}}}();