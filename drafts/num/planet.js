<script>
/* ---- כוכב המספרים: החצר של מנש ---- */
(function(){
 function $(i){return document.getElementById(i)}
 var NAT={W:[1586,992],T:[992,1586]};
 var IMG={W:'pics/num/bgW.webp',T:'pics/num/bgT.webp'};
 /* 10 תחנות לאורך השביל (מ-1 למטה, עד 10 ליד השער) */
 var ST={W:[[370,722],[430,660],[510,617],[625,567],[700,525],[1205,595],[1240,563],[1278,515],[1350,465],[1375,410]],
         T:[[195,1113],[172,1032],[160,952],[215,878],[290,828],[365,775],[420,722],[790,728],[835,682],[870,615]]};
 /* מנש: נקודת הרגליים וגובה (בפיקסלים של התמונה) */
 var MN={W:{x:1085,y:722,h:200},T:{x:790,y:1068,h:205}},MNR=291/560;
 var EYE=[.1158,.2154,.7981,.1951],MOU=[.3740,.3496,.3678,.0935];
 var GATE={W:[1328,268,1462,398],T:[818,505,948,628]};
 var SHIP={W:[690,505,1012,712],T:[345,820,695,1052]};
 var GATE_NEED=400;
 var css=document.createElement('style');css.textContent=
  '#planet{position:fixed;inset:0;z-index:860;display:none;background:#140a30;overflow:hidden;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}'
 +'#plStage{position:absolute;transform-origin:50% 50%}#plStage.zin{animation:iszin 1.1s cubic-bezier(.2,.7,.3,1)}'
 +'#plBg{position:absolute;inset:0;width:100%;height:100%;display:block}'
 +'#plMn{position:absolute;transform-origin:50% 100%;cursor:pointer;animation:plBreath 3.4s ease-in-out infinite}'
 +'#plMn img{position:absolute;display:block;pointer-events:none}#plMn .b{inset:0;width:100%;height:100%;filter:drop-shadow(0 6px 10px rgba(30,10,60,.45))}'
 +'#plMn .o{opacity:0}#plMn .o.on{opacity:1}'
 +'#plMn::before{content:"";position:absolute;left:12%;right:12%;bottom:-3%;height:7%;border-radius:50%;background:radial-gradient(closest-side,rgba(20,5,40,.55),rgba(20,5,40,0))}'
 +'#plMn.hop{animation:plHop .6s cubic-bezier(.3,1.5,.5,1)}'
 +'@keyframes plBreath{50%{transform:scale(1.012,.988)}}'
 +'@keyframes plHop{30%{transform:translateY(-14%) scale(.96,1.05)}60%{transform:translateY(0) scale(1.05,.95)}100%{transform:none}}'
 +'#plSt{position:absolute;inset:0}'
 +'.plS{position:absolute;width:clamp(62px,12vmin,108px);height:clamp(62px,12vmin,108px);transform:translate(-50%,-50%);border-radius:50%;border:0;background:none;cursor:pointer;padding:0}'
 +'.plS::before{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(255,245,200,.3),rgba(255,210,110,.12) 45%,transparent 70%);border:2px solid rgba(255,230,150,.7);box-shadow:0 0 14px 2px rgba(255,200,90,.5),inset 0 0 10px rgba(255,220,130,.25);animation:isbr 3.2s ease-in-out infinite}'
 +'.plS i{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(255,225,140,.45);box-shadow:0 0 8px rgba(255,190,80,.35);animation:isring 3.6s ease-out infinite;pointer-events:none}'
 +'.plS b{position:absolute;inset:0;display:grid;place-items:center;font:900 clamp(26px,5.4vmin,48px)/1 Heebo,Arial,sans-serif;color:#fff6cf;text-shadow:0 0 6px rgba(255,200,80,1),0 0 16px rgba(255,170,40,.9),0 2px 3px rgba(90,40,0,.9);pointer-events:none}'
 +'.plS.nudge{animation:isnudge .5s}.plS:focus-visible{outline:3px solid #fff;outline-offset:2px}'
 +'.plHit{position:absolute;border:0;background:none;padding:0;cursor:pointer;border-radius:40%}.plHit:focus-visible{outline:3px solid #fff}'
 +'#plGateFx{position:absolute;pointer-events:none;border-radius:45% 45% 8% 8%;opacity:0}#plGateFx.on{animation:plGate .7s ease-out}'
 +'@keyframes plGate{0%{opacity:0;box-shadow:0 0 0 0 rgba(255,210,120,0)}25%{opacity:1;box-shadow:0 0 30px 10px rgba(255,210,120,.75),inset 0 0 24px rgba(255,220,150,.6);transform:translateX(-3px)}45%{transform:translateX(3px)}65%{transform:translateX(-2px)}100%{opacity:0;transform:none}}'
 +'#plBub{position:fixed;z-index:6;max-width:min(70vw,320px);padding:10px 16px;border-radius:18px;background:rgba(255,252,240,.96);color:#3b1d6e;font:700 clamp(16px,2.6vmin,22px)/1.35 Heebo,Arial,sans-serif;box-shadow:0 6px 20px rgba(20,0,60,.35);direction:rtl;text-align:center;opacity:0;transform:translate(-50%,-100%) scale(.8);transition:opacity .25s,transform .25s;pointer-events:none}'
 +'#plBub.on{opacity:1;transform:translate(-50%,-100%) scale(1)}'
 +'#plFade{position:absolute;inset:0;background:#0a0420;opacity:0;pointer-events:none;z-index:8}';
 document.head.appendChild(css);
 var root=document.createElement('div');root.id='planet';root.innerHTML=
  '<div id="plStage"><img id="plBg" alt=""><div id="plGateFx"></div><button class="plHit" id="plShip" aria-label="החללית – חזרה למפה"></button><button class="plHit" id="plGate" aria-label="השער הנעול"></button>'
  +'<div id="plMn" role="button" aria-label="מנש"><img class="b" src="pics/num/mn_base.webp" alt=""><img class="o" id="plMo" src="pics/num/mn_mouth.webp" alt=""><img class="o" id="plEy" src="pics/num/mn_eyes.webp" alt=""></div><div id="plSt"></div></div>'
  +'<button class="isBtn isBack" id="plBack" aria-label="חזרה"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>'
  +'<div class="isStar"><span>★</span><b id="plCoins">0</b></div><div id="plBub"></div><div id="plFade"></div>';
 document.body.appendChild(root);
 var stage=$('plStage'),bg=$('plBg'),stL=$('plSt'),mn=$('plMn'),ey=$('plEy'),mo=$('plMo'),cur='W',sw=0,sh=0,ox=0,oy=0,on=false;
 [EYE,MOU].forEach(function(b,i){var e=i?mo:ey;e.style.cssText='left:'+b[0]*100+'%;top:'+b[1]*100+'%;width:'+b[2]*100+'%;height:'+b[3]*100+'%'});
 mo.classList.add('on');
 function coins(){try{return (JSON.parse(localStorage.getItem('learn-world')||'{}').coins)||0}catch(e){return 0}}
 /* צלילים */
 var AX=null;function ax(){if(!AX){try{AX=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AX&&AX.state==='suspended')AX.resume();return AX}
 function fxv(){try{var p=JSON.parse(localStorage.getItem('lw-profile')||'{}');if(p.vol&&p.vol.fx!=null)return +p.vol.fx}catch(e){}return .8}
 function tone(N,len,type,vol,step){var a=ax(),v=fxv();if(!a||!v)return;var t=a.currentTime;N.forEach(function(f,i){var o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.value=f;var s=t+i*(step||0);g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime((vol||.08)*v,s+.02);g.gain.exponentialRampToValueAtTime(.001,s+len);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+len+.05)})}
 /* פריסה: התמונה ממלאת את כל המסך, והתחנות, מנש והשער תמיד בפנים */
 function keep(){var n=NAT[cur],a=ST[cur].map(function(p){return [p[0]/n[0],p[1]/n[1]]}),m=MN[cur],g=GATE[cur];
  a.push([(m.x-m.h*MNR*.6)/n[0],(m.y-m.h)/n[1]],[(m.x+m.h*MNR*.6)/n[0],m.y/n[1]],[g[0]/n[0],g[1]/n[1]],[g[2]/n[0],g[3]/n[1]]);return a}
 function layout(){if(!on)return;var W=innerWidth,H=innerHeight;cur=W>=H?'W':'T';var n=NAT[cur],s=Math.max(W/n[0],H/n[1]),pd=Math.max(30,Math.min(60,Math.min(W,H)*.07)),x0=1,x1=0,y0=1,y1=0;
  keep().forEach(function(q){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1])});
  sw=n[0]*s;sh=n[1]*s;
  function fit(V,S,a0,a1){if(S<=V)return (V-S)/2;var o;if((a1-a0)*S+2*pd>V)o=V/2-(a0+a1)/2*S;else{o=(V-S)/2;o=Math.max(o,V-pd-a1*S);o=Math.min(o,pd-a0*S)}return Math.min(0,Math.max(V-S,o))}
  ox=fit(W,sw,x0,x1);oy=fit(H,sh,y0,y1);
  stage.style.width=sw+'px';stage.style.height=sh+'px';stage.style.left=ox+'px';stage.style.top=oy+'px';
  if(bg.getAttribute('src')!==IMG[cur])bg.src=IMG[cur];
  var m=MN[cur],mw=m.h*MNR;mn.style.left=((m.x-mw/2)/n[0]*100)+'%';mn.style.top=((m.y-m.h)/n[1]*100)+'%';mn.style.width=(mw/n[0]*100)+'%';mn.style.height=(m.h/n[1]*100)+'%';
  box($('plGate'),GATE[cur],n);box($('plGateFx'),GATE[cur],n);box($('plShip'),SHIP[cur],n);
  build()}
 function box(e,b,n){e.style.left=(b[0]/n[0]*100)+'%';e.style.top=(b[1]/n[1]*100)+'%';e.style.width=((b[2]-b[0])/n[0]*100)+'%';e.style.height=((b[3]-b[1])/n[1]*100)+'%'}
 /* נקודה על המסך: בתוך השוליים ולא מתחת לכפתורי הפינות */
 function sR(){return Math.max(62,Math.min(108,Math.min(innerWidth,innerHeight)*.12))/2}
 function CS(x,y,r){var W=innerWidth,H=innerHeight,m=r+8;x=Math.max(m,Math.min(W-m,x));y=Math.max(m,Math.min(H-m,y));if(x<72+r&&y<80+r)y=80+r;if(x>W-120-r&&y<70+r)y=70+r;return [x,y]}
 function build(){var n=NAT[cur],r=sR(),P=ST[cur].map(function(p){return CS(ox+p[0]/n[0]*sw,oy+p[1]/n[1]*sh,r)}),d=r*2*1.06;
  for(var it=0;it<60;it++){var mv=false;for(var i=0;i<P.length;i++)for(var j=i+1;j<P.length;j++){var dx=P[j][0]-P[i][0],dy=P[j][1]-P[i][1],L=Math.sqrt(dx*dx+dy*dy);if(L<d){if(L<.5){dx=1;dy=0;L=1}var k=(d-L)/2/L;P[i][0]-=dx*k;P[i][1]-=dy*k;P[j][0]+=dx*k;P[j][1]+=dy*k;mv=true}}P=P.map(function(a){return CS(a[0],a[1],r)});if(!mv)break}
  stL.innerHTML=P.map(function(p,i){return '<button class="plS" data-n="'+(i+1)+'" style="left:'+((p[0]-ox)/sw*100)+'%;top:'+((p[1]-oy)/sh*100)+'%" aria-label="תחנה '+(i+1)+'"><i></i><b>'+(i+1)+'</b></button>'}).join('');
  Array.prototype.forEach.call(stL.querySelectorAll('.plS'),function(b){b.onclick=function(e){e.stopPropagation();station(+b.dataset.n,b)}})}
 /* מנש */
 var blT=0,tkT=0,bubT=0;
 function blink(){clearTimeout(blT);blT=setTimeout(function(){if(!on)return;ey.classList.add('on');setTimeout(function(){ey.classList.remove('on')},150);if(Math.random()<.18)setTimeout(function(){ey.classList.add('on');setTimeout(function(){ey.classList.remove('on')},140)},330);blink()},2600+Math.random()*2800)}
 function talk(ms){clearInterval(tkT);var st=performance.now();tkT=setInterval(function(){if(performance.now()-st>ms){clearInterval(tkT);mo.classList.add('on');return}mo.classList.toggle('on',Math.random()<.45)},120)}
 function hop(){mn.classList.remove('hop');void mn.offsetWidth;mn.classList.add('hop')}
 function bubble(t,ms){var b=$('plBub'),r=mn.getBoundingClientRect();b.textContent=t;var x=Math.max(130,Math.min(innerWidth-130,r.left+r.width/2)),y=Math.max(90,r.top-6);b.style.left=x+'px';b.style.top=y+'px';b.classList.add('on');clearTimeout(bubT);bubT=setTimeout(function(){b.classList.remove('on')},ms||2600)}
 mn.onclick=function(e){e.stopPropagation();hop();mo.classList.remove('on');setTimeout(function(){mo.classList.add('on')},900);tone([659,880,1175],.35,'sine',.07,.07)};
 /* תחנה — המשחקים עוד בבנייה */
 function station(k,b){b.classList.remove('nudge');void b.offsetWidth;b.classList.add('nudge');tone([523,659],.3,'sine',.07,.08);hop();bubble('המשחק במספר '+k+' עוד בבנייה!',2400);talk(1200)}
 /* השער נעול עד 400 כוכבים */
 $('plGate').onclick=function(e){e.stopPropagation();var f=$('plGateFx');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');tone([147,110],.25,'triangle',.18,.07);hop();bubble('השער נפתח ב-'+GATE_NEED+' ★',2400);talk(1000)};
 /* החללית — חזרה למפה */
 $('plShip').onclick=function(e){e.stopPropagation();close(true)};
 $('plBack').onclick=function(){close(true)};
 function open(){ax();on=true;root.style.display='block';document.body.classList.add('isleOn');$('plCoins').textContent=coins();layout();blink();mo.classList.add('on');
  var f=$('plFade');f.style.transition='none';f.style.opacity=1;requestAnimationFrame(function(){requestAnimationFrame(function(){f.style.transition='opacity 1.1s';f.style.opacity=0})});
  stage.classList.remove('zin');void stage.offsetWidth;stage.classList.add('zin');setTimeout(function(){if(on)hop()},1100)}
 function close(fade){if(!on)return;var f=$('plFade');function end(){on=false;clearTimeout(blT);clearInterval(tkT);root.style.display='none';document.body.classList.remove('isleOn');$('plBub').classList.remove('on')}
  if(!fade){end();return}tone([784,659,523],.4,'sine',.07,.08);f.style.transition='opacity .45s';f.style.opacity=1;setTimeout(function(){end();f.style.transition='none';f.style.opacity=0},470)}
 addEventListener('resize',function(){if(on)layout()});
 addEventListener('lwstars',function(){if(on)setTimeout(function(){$('plCoins').textContent=coins()},2500)});
 window.PLANET={open:open,close:close,_t:{layout:layout}};
})();
</script>
