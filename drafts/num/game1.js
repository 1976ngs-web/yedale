 /* =================== משחק 1: אתגר המספרים (20 שאלות, 3 רמות) =================== */
 var gcss=document.createElement('style');gcss.textContent=
  '#plG{position:absolute;inset:0;z-index:7;display:none;overflow:hidden;background:#120a33}'
 +'#plG .gbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%}'
 +'#plG .gsh{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(20,8,60,0) 30%,rgba(10,4,40,.45) 100%)}'
 +'#plGcv{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4}'
 +'#plGtop{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:6px;width:min(62vw,560px)}'
 +'#plGrail{display:flex;gap:clamp(2px,.6vmin,6px);width:100%;justify-content:center;direction:rtl}'
 +'#plGrail i{flex:1;max-width:22px;height:clamp(8px,1.4vmin,13px);border-radius:99px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);transition:background .4s,box-shadow .4s}'
 +'#plGrail i.ok{background:linear-gradient(#fff4b8,#ffbf2e);border-color:#fff3c4;box-shadow:0 0 10px rgba(255,200,60,.9)}#plGrail i.cur{background:rgba(255,255,255,.55);box-shadow:0 0 8px rgba(255,255,255,.8)}'
 +'#plGn{font:800 clamp(15px,2.4vmin,21px)/1 Heebo,Arial,sans-serif;color:#fff;text-shadow:0 2px 6px rgba(20,0,60,.8);direction:rtl}'
 +'#plGq{position:absolute;left:50%;transform:translateX(-50%);z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:clamp(22px,4vmin,40px);background:linear-gradient(160deg,rgba(255,255,255,.2),rgba(255,255,255,.07));border:2px solid rgba(255,255,255,.45);box-shadow:0 10px 40px rgba(10,0,50,.45),inset 0 1px 0 rgba(255,255,255,.6),inset 0 0 40px rgba(180,150,255,.15);-webkit-backdrop-filter:blur(10px) saturate(1.2);backdrop-filter:blur(10px) saturate(1.2)}'
 +'#plGq .eq{direction:ltr;unicode-bidi:isolate;font:900 var(--qf,64px)/1 Heebo,Arial,sans-serif;color:#fff;letter-spacing:.02em;text-shadow:0 0 18px rgba(255,210,120,.65),0 4px 0 rgba(60,20,110,.75),0 6px 14px rgba(20,0,60,.6);white-space:nowrap;display:flex;align-items:center;gap:.22em}'
 +'#plGq .qm{display:inline-grid;place-items:center;min-width:1.3em;height:1.2em;padding:0 .12em;border-radius:.28em;border:.06em dashed rgba(255,240,190,.95);color:#ffe27a;animation:plQm 1.6s ease-in-out infinite}'
 +'@keyframes plQm{50%{box-shadow:0 0 22px rgba(255,220,120,.85);transform:scale(1.05)}}'
 +'#plGq .dots{direction:ltr;display:flex;align-items:flex-start;justify-content:center;gap:.9em;margin-top:.35em;font-size:var(--df,22px)}'
 +'#plGq .dots span{display:flex;flex-wrap:wrap;justify-content:center;gap:.25em;max-width:5.6em}'
 +'#plGq .st{width:1em;height:1em;display:inline-block;background:radial-gradient(circle at 35% 30%,#fffbe0,#ffd23a 45%,#f39a12);clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);filter:drop-shadow(0 0 4px rgba(255,200,60,.9))}'
 +'#plGq .cnt{display:flex;flex-wrap:wrap;justify-content:center;gap:.35em;max-width:9.5em;font-size:var(--cf,44px);direction:ltr}'
 +'#plGq .cnt .st{animation:plSt .5s cubic-bezier(.3,1.6,.5,1) backwards}@keyframes plSt{from{transform:scale(0) rotate(-40deg)}}'
 +'#plGa{position:absolute;left:50%;transform:translateX(-50%);z-index:2;display:grid;gap:var(--gg,16px)}'
 +'.plT{position:relative;border:0;padding:0;cursor:pointer;border-radius:var(--tr,26px);font:900 var(--tf,54px)/1 Heebo,Arial,sans-serif;color:#2a1640;direction:ltr;'
 +'background:linear-gradient(180deg,var(--c1),var(--c2) 58%,var(--c3));box-shadow:0 0 0 var(--ol,5px) #2b1850,0 var(--sh,9px) 0 var(--ol,5px) #2b1850,0 calc(var(--sh,9px) + 10px) 22px rgba(10,0,40,.45),inset 0 -8px 0 rgba(0,0,0,.12);transition:transform .12s,filter .3s,opacity .3s;animation:plTin .45s cubic-bezier(.3,1.5,.5,1) backwards}'
 +'.plT::before{content:"";position:absolute;left:6%;right:6%;top:7%;height:34%;border-radius:calc(var(--tr,26px)*.8) calc(var(--tr,26px)*.8) 40% 40%/calc(var(--tr,26px)*.8) calc(var(--tr,26px)*.8) 60% 60%;background:linear-gradient(rgba(255,255,255,.75),rgba(255,255,255,.08));pointer-events:none}'
 +'.plT b{position:relative;text-shadow:0 2px 0 rgba(255,255,255,.55)}'
 +'.plT:active{transform:translateY(4px)}'
 +'@keyframes plTin{from{transform:scale(.3) translateY(30px);opacity:0}}'
 +'.plT.no{animation:plNo .45s;filter:grayscale(.85) brightness(.8);opacity:.55;pointer-events:none}@keyframes plNo{20%{translate:-10px 0}40%{translate:10px 0}60%{translate:-6px 0}80%{translate:4px 0}}'
 +'.plT.ok{animation:plOk .7s cubic-bezier(.3,1.6,.5,1);z-index:2;box-shadow:0 0 0 var(--ol,5px) #fff7d0,0 var(--sh,9px) 0 var(--ol,5px) #2b1850,0 0 40px 14px rgba(255,230,120,.9)}@keyframes plOk{40%{transform:scale(1.14)}}'
 +'.plT.hint{animation:plHint 1.1s ease-in-out infinite}@keyframes plHint{50%{filter:brightness(1.25);box-shadow:0 0 0 var(--ol,5px) #fff7d0,0 var(--sh,9px) 0 var(--ol,5px) #2b1850,0 0 34px 12px rgba(255,240,150,.85)}}'
 +'.plT.out{transition:transform .35s,opacity .35s;transform:scale(.6);opacity:0}'
 +'#plGm,#plGf{position:absolute;z-index:3;pointer-events:none}#plGm img,#plGf img{position:absolute;bottom:0;left:50%;height:100%;transform:translateX(-50%);display:none;filter:drop-shadow(0 8px 14px rgba(10,0,40,.45))}#plGm img.on,#plGf img.on{display:block}'
 +'#plGm.bob{animation:plBob .5s cubic-bezier(.3,1.6,.5,1)}@keyframes plBob{40%{transform:translateY(-10%) scale(1.04)}}'
 +'#plGf{transition:transform .55s cubic-bezier(.3,1.4,.5,1),opacity .4s;opacity:0;transform:translateX(60%) scale(.6) rotate(12deg)}#plGf.on{opacity:1;transform:none}'
 +'#plGf.on img.on{animation:plFly 2.4s ease-in-out infinite}@keyframes plFly{50%{transform:translateX(-50%) translateY(-6%) rotate(-3deg)}}'
 +'#plGend{position:absolute;inset:0;z-index:5;display:none;place-items:center;background:radial-gradient(circle,rgba(30,10,80,.35),rgba(10,0,40,.7))}#plGend.on{display:grid}'
 +'#plGend .in{display:flex;flex-direction:column;align-items:center;gap:22px;animation:isgot .6s cubic-bezier(.3,1.6,.5,1)}'
 +'#plGend .got{display:flex;align-items:center;gap:10px;font:900 clamp(46px,10vmin,96px)/1 Heebo,Arial,sans-serif;color:#fff;direction:ltr;text-shadow:0 0 24px rgba(255,200,80,.9),0 4px 0 rgba(90,40,0,.7)}#plGend .got span{color:#ffd23a}'
 +'#plGend .row{display:flex;gap:22px}#plGend button{width:clamp(70px,13vmin,96px);height:clamp(70px,13vmin,96px);border-radius:50%;border:3px solid #fff3c4;background:radial-gradient(circle at 40% 35%,#fff1b8,#f5b23e 65%,#c8721a);box-shadow:0 6px 18px rgba(0,0,0,.4);display:grid;place-items:center;cursor:pointer;padding:0}#plGend svg{width:52%;height:52%}';
 document.head.appendChild(gcss);
 var GV=document.createElement('div');GV.id='plG';GV.innerHTML='<img class="gbg" src="pics/num/gbW.webp" alt=""><div class="gsh"></div><div id="plGtop"><div id="plGrail"></div><div id="plGn"></div></div><div id="plGq"></div><div id="plGa"></div>'
  +'<div id="plGm"></div><div id="plGf"></div><canvas id="plGcv"></canvas>'
  +'<button class="isBtn isBack" id="plGback" aria-label="חזרה לחצר"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>'
  +'<div id="plGend"><div class="in"><div class="got"><span>★</span><b id="plGgot">+20</b></div><div class="row"><button id="plGagain" aria-label="לשחק שוב"><svg viewBox="0 0 24 24" fill="none" stroke="#5a2f08" stroke-width="2.6" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></svg></button><button id="plGhome" aria-label="חזרה לחצר"><svg viewBox="0 0 24 24" fill="none" stroke="#5a2f08" stroke-width="2.4" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/></svg></button></div></div></div>';
 root.appendChild(GV);
 var MP=['wave','think','thumb','hope','wow','jump','dance','smirk','yawn'],FP=['up','up2','wink','laugh','go','kiss','shy','wow','calm','think'];
 $('plGm').innerHTML=MP.map(function(k){return '<img data-k="'+k+'" src="pics/num/mn_'+k+'.webp" alt="">'}).join('');
 $('plGf').innerHTML=FP.map(function(k){return '<img data-k="'+k+'" src="pics/num/fy_'+k+'.webp" alt="">'}).join('');
 function pose(id,k){Array.prototype.forEach.call($(id).children,function(i){i.classList.toggle('on',i.dataset.k===k)})}
 var GC=$('plGcv'),gx=GC.getContext('2d'),PT=[],graf=0,glast=0;
 function gsize(){var d=Math.min(2,devicePixelRatio||1);GC.width=innerWidth*d;GC.height=innerHeight*d;gx.setTransform(d,0,0,d,0,0)}
 function spark(x,y,n,k,cols){cols=cols||['255,230,120','255,255,255','255,170,220','140,240,232','255,200,60'];for(var i=0;i<n;i++){var a=Math.random()*7,v=k*(.3+Math.random());PT.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-k*.25,l:0,m:.6+Math.random()*.8,s:1.5+Math.random()*3.5,st:Math.random()<.45,r:Math.random()*6,c:cols[i%cols.length]})}if(!graf){glast=0;graf=requestAnimationFrame(gloop)}}
 function gloop(now){var dt=Math.min(.05,(now-(glast||now))/1000);glast=now;gx.clearRect(0,0,innerWidth,innerHeight);gx.save();gx.globalCompositeOperation='lighter';
  for(var j=PT.length-1;j>=0;j--){var p=PT[j];p.l+=dt;if(p.l>=p.m){PT.splice(j,1);continue}var dr=Math.pow(.12,dt);p.vx*=dr;p.vy=p.vy*dr+60*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=dt*4;gx.fillStyle='rgba('+p.c+','+(1-p.l/p.m).toFixed(3)+')';
   if(p.st){gx.save();gx.translate(p.x,p.y);gx.rotate(p.r);gx.beginPath();for(var z=0;z<10;z++){var a2=z*Math.PI/5,r2=z%2?p.s*.45:p.s*1.6;gx.lineTo(Math.cos(a2)*r2,Math.sin(a2)*r2)}gx.closePath();gx.fill();gx.restore()}else{gx.beginPath();gx.arc(p.x,p.y,p.s*.7,0,7);gx.fill()}}
  gx.restore();if(PT.length)graf=requestAnimationFrame(gloop);else{graf=0;gx.clearRect(0,0,innerWidth,innerHeight)}}
 /* ---- תוכן לפי רמה ---- */
 function lv(){var l='a';try{l=(window.LW&&LW.profile&&LW.profile().level)||'a'}catch(e){}return ['prep','a','b'].indexOf(l)>=0?l:'a'}
 function R(a,b){return a+Math.floor(Math.random()*(b-a+1))}
 function shuf(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
 /* כל שאלה: {k:מזהה, t:סוג, a,b,op, ans} */
 function mk(L){var t,a,b,q;
  if(L==='prep'){t=['cnt','cnt','add','add','next','sub'][R(0,5)];
   if(t==='cnt'){a=R(1,10);q={t:t,a:a,ans:a,k:'c'+a}}
   else if(t==='add'){a=R(1,6);b=R(1,Math.min(5,10-a));q={t:t,a:a,b:b,op:'+',ans:a+b,k:a+'+'+b}}
   else if(t==='sub'){a=R(2,6);b=R(1,a-1);q={t:t,a:a,b:b,op:'−',ans:a-b,k:a+'-'+b}}
   else{a=R(1,7);q={t:t,a:a,ans:a+3,k:'n'+a}}}
  else if(L==='a'){t=['add','add','sub','sub','tens','miss'][R(0,5)];
   if(t==='add'){a=R(2,15);b=R(2,20-a);q={t:'add',a:a,b:b,op:'+',ans:a+b,k:a+'+'+b}}
   else if(t==='sub'){a=R(6,20);b=R(1,a-1);q={t:'add',a:a,b:b,op:'−',ans:a-b,k:a+'-'+b}}
   else if(t==='tens'){if(Math.random()<.55){a=R(1,8)*10;b=R(1,(100-a)/10)*10;q={t:'add',a:a,b:b,op:'+',ans:a+b,k:a+'+'+b}}else{a=R(3,10)*10;b=R(1,a/10-1)*10;q={t:'add',a:a,b:b,op:'−',ans:a-b,k:a+'-'+b}}}
   else{a=R(2,12);var s=R(a+2,20);q={t:'miss',a:a,b:s,ans:s-a,k:a+'?'+s}}}
  else{t=['add2','add2','sub2','sub2','mul','mul','half','hund'][R(0,7)];
   if(t==='add2'){a=R(12,78);b=R(11,99-a);q={t:'add',a:a,b:b,op:'+',ans:a+b,k:a+'+'+b}}
   else if(t==='sub2'){a=R(31,99);b=R(11,a-8);q={t:'add',a:a,b:b,op:'−',ans:a-b,k:a+'-'+b}}
   else if(t==='mul'){a=[2,4,5,10][R(0,3)];b=R(1,10);if(Math.random()<.5){var x=a;a=b;b=x}q={t:'add',a:a,b:b,op:'×',ans:a*b,k:a+'x'+b}}
   else if(t==='half'){a=R(1,10)*2;q={t:'add',a:a,b:2,op:':',ans:a/2,k:a+':2'}}
   else{a=R(1,9)*100;b=R(1,9)*10;var c=R(1,9);q={t:'hund',a:a,b:b,c:c,ans:a+b+c,k:'h'+a+b+c}}}
  return q}
 /* מסיחים קרובים — טעויות שילדים עושים באמת */
 function opts(q,n){var A=q.ans,s={},o=[A];s[A]=1;var c=[A+1,A-1,A+2,A-2,A+10,A-10,A+3,A-3,A+5];
  if(A>=10){var d=String(A);if(d.length===2&&d[0]!==d[1]&&d[1]!=='0')c.unshift(+(d[1]+d[0]))}
  if(q.op==='+')c.unshift(Math.abs(q.a-q.b));if(q.op==='−')c.unshift(q.a+q.b);if(q.op==='×')c.unshift(q.a+q.b,q.a*(q.b+1),q.a*(q.b-1));
  if(q.t==='hund')c.unshift(q.a+q.c*10+q.b/10,q.a/100+q.b+q.c*100);
  c=c.filter(function(v){return v>=0&&v===Math.round(v)});c.slice(0,4).concat(shuf(c.slice(4))).forEach(function(v){if(o.length<n&&!s[v]){s[v]=1;o.push(v)}});
  var g=0;while(o.length<n&&g++<200){var v=A+R(-12,12);if(v>=0&&!s[v]){s[v]=1;o.push(v)}}return shuf(o)}
 function gstore(L){var k='lw-progress-'+L+'-num1',d;try{d=JSON.parse(localStorage.getItem(k)||'{}')}catch(e){d={}}d.seen=d.seen||[];d.err=d.err||{};d.rounds=d.rounds||0;return {k:k,d:d}}
 function gsave(S){try{localStorage.setItem(S.k,JSON.stringify(S.d))}catch(e){}}
 /* 20 שאלות בלי חזרות: לא חוזרים על מה שהיה בסיבובים האחרונים; שאלה שטעו בה חוזרת פעם אחת בסיבוב הבא */
 function deck(L,S){var out=[],used={},i,q;
  Object.keys(S.d.err).slice(0,4).forEach(function(k){var e=S.d.err[k];if(e&&e.q){out.push(e.q);used[k]=1}});
  var seen={};S.d.seen.forEach(function(k){seen[k]=1});
  for(i=0;i<4000&&out.length<20;i++){q=mk(L);if(used[q.k]||(seen[q.k]&&i<3000))continue;
   var tt=out.length?out[out.length-1].t:'';if(tt===q.t&&L==='prep'&&q.t==='cnt'&&i<2000)continue;used[q.k]=1;out.push(q)}
  return shuf(out.slice(0,4)).concat(out.slice(4))}
 var G={on:false};
 function eqHtml(q){var M='<span class="qm">?</span>';
  if(q.t==='miss')return '<div class="eq"><span>'+q.a+'</span><span>+</span>'+M+'<span>=</span><span>'+q.b+'</span></div>';
  if(q.t==='hund')return '<div class="eq"><span>'+q.a+'</span><span>+</span><span>'+q.b+'</span><span>+</span><span>'+q.c+'</span><span>=</span>'+M+'</div>';
  if(q.t==='next'){return '<div class="eq"><span>'+q.a+'</span><span>,</span><span>'+(q.a+1)+'</span><span>,</span><span>'+(q.a+2)+'</span><span>,</span>'+M+'</div>'}
  if(q.t==='cnt'){var h='';for(var i=0;i<q.a;i++)h+='<i class="st" style="animation-delay:'+(i*.07).toFixed(2)+'s"></i>';return '<div class="cnt">'+h+'</div>'}
  var e='<div class="eq"><span>'+q.a+'</span><span>'+q.op+'</span><span>'+q.b+'</span><span>=</span>'+M+'</div>';
  if(q.t==='add'&&G.L==='prep'){var dd=function(n){var s='';for(var j=0;j<n;j++)s+='<i class="st"></i>';return '<span>'+s+'</span>'};e+='<div class="dots">'+dd(q.a)+'<span style="visibility:hidden">+</span>'+(q.op==='+'?dd(q.b):'')+'</div>'}
  return e}
 var PAL=[['#bff0ff','#7fd3f7','#4fb2e6'],['#d6ffb8','#9fe27a','#6cc44a'],['#fff7b0','#ffe45c','#f2c21d'],['#ffe0b0','#ffb85a','#f08a1d'],['#f6d0ff','#d796f5','#b264e0'],['#ffd3e6','#ff9ec6','#f06ea3']];
 function glayout(){if(!G.on)return;gsize();var W=innerWidth,H=innerHeight,land=W>H*1.15,n=G.n||6,cols=n===4?2:(land?3:2),rows=Math.ceil(n/cols),top=Math.max(64,H*.1)+12;
  var qh=Math.min(H*(land?.3:.27),260),qw=Math.min(W*(land?.6:.88),720),q=$('plGq');q.style.top=top+'px';q.style.width=qw+'px';q.style.height=qh+'px';
  var bot=H-Math.max(14,H*.03),aTop=top+qh+Math.max(14,H*.03),aw=Math.min(W*(land?.66:.9),760),gg=Math.max(10,Math.min(22,W*.02)),ah=Math.min(bot-aTop,(land?.42:.5)*H),th=Math.min((ah-gg*(rows-1))/rows,130),tw=Math.min((aw-gg*(cols-1))/cols,th*(n===4?2.2:2.4));
  var a=$('plGa');a.style.top=aTop+'px';a.style.gridTemplateColumns='repeat('+cols+','+tw+'px)';a.style.gridAutoRows=th+'px';a.style.setProperty('--gg',gg+'px');a.style.setProperty('--tf',Math.round(th*.5)+'px');a.style.setProperty('--tr',Math.round(th*.28)+'px');a.style.setProperty('--ol',Math.max(3,Math.round(th*.05))+'px');a.style.setProperty('--sh',Math.max(5,Math.round(th*.08))+'px');
  var cur=G.q,len=cur?(cur.t==='hund'?9:cur.t==='next'?8:cur.t==='cnt'?6:6):6;q.style.setProperty('--qf',Math.round(Math.min(qh*(G.L==='prep'&&cur&&cur.t==='add'?.34:.48),qw/len*1.05))+'px');q.style.setProperty('--df',Math.round(qh*.12)+'px');q.style.setProperty('--cf',Math.round(Math.min(qh*(cur&&cur.a>5?.3:.42),qw/7))+'px');
  var mh=Math.min(H*(land?.34:.2),land?260:170),m=$('plGm'),f=$('plGf'),side=land?Math.max(10,(W-aw)/2-mh*.62):8;
  m.style.height=mh+'px';m.style.width=mh*.7+'px';m.style.left=Math.max(6,land?side-mh*.05:6)+'px';m.style.bottom=(land?Math.max(8,H*.03):Math.max(4,H*.01))+'px';
  f.style.height=mh*1.05+'px';f.style.width=mh*.85+'px';f.style.right=Math.max(6,land?side-mh*.1:6)+'px';f.style.bottom=(land?H*.2:Math.max(6,H*.01))+'px';
  if(!land){a.style.top=Math.min(aTop,bot-ah-mh*.75)+'px'}}
 function menash(k,ms){pose('plGm',k);var m=$('plGm');m.classList.remove('bob');void m.offsetWidth;m.classList.add('bob');clearTimeout(G.mT);if(ms)G.mT=setTimeout(function(){if(G.on)pose('plGm','think')},ms)}
 function fairy(k,ms){var f=$('plGf');pose('plGf',k);f.classList.add('on');tone([1047,1319,1568,2093],.4,'sine',.06,.06);var r=f.getBoundingClientRect();spark(r.left+r.width/2,r.top+r.height*.4,26,260);clearTimeout(G.fT);G.fT=setTimeout(function(){f.classList.remove('on')},ms||1800)}
 function railDraw(){$('plGrail').innerHTML=G.list.map(function(_,i){return '<i class="'+(i<G.i?'ok':i===G.i?'cur':'')+'"></i>'}).join('');$('plGn').textContent=Math.min(G.i+1,20)+' מתוך 20'}
 function ask(){if(!G.on)return;G.q=G.list[G.i];G.wrong=0;G.busy=false;railDraw();var q=G.q,o=opts(q,G.n);
  $('plGq').innerHTML=eqHtml(q);glayout();
  $('plGa').innerHTML=o.map(function(v,i){var c=PAL[(i+G.i)%PAL.length];return '<button class="plT" data-v="'+v+'" style="--c1:'+c[0]+';--c2:'+c[1]+';--c3:'+c[2]+';animation-delay:'+(i*.06).toFixed(2)+'s"><b>'+v+'</b></button>'}).join('');
  Array.prototype.forEach.call($('plGa').children,function(b){b.onclick=function(e){e.stopPropagation();pick(b)}});
  clearTimeout(G.hT);G.hT=setTimeout(function(){hint()},22000)}
 function hint(){if(!G.on||G.busy)return;var b=$('plGa').querySelector('.plT[data-v="'+G.q.ans+'"]');if(b)b.classList.add('hint');menash('think',0)}
 function pick(b){if(!G.on||G.busy)return;var v=+b.dataset.v,q=G.q;
  if(v===q.ans){G.busy=true;clearTimeout(G.hT);b.classList.remove('hint');b.classList.add('ok');var r=b.getBoundingClientRect();spark(r.left+r.width/2,r.top+r.height/2,38,320);
   tone([784,988,1175,1568],.35,'sine',.08,.05);if(!G.wrong){G.first++;G.streak++;delete G.S.d.err[q.k]}else G.streak=0;
   var cheer=G.streak>0&&G.streak%3===0;menash(cheer?'dance':'thumb',1400);if(cheer)fairy(['up','wink','laugh','up2','go'][(G.streak/3-1)%5],1900);
   Array.prototype.forEach.call($('plGa').children,function(x){if(x!==b)x.classList.add('out')});
   setTimeout(function(){if(!G.on)return;G.i++;if(G.i>=G.list.length)finish();else ask()},cheer?1300:950)}
  else{b.classList.add('no');tone([196,147],.3,'triangle',.12,.08);G.wrong++;G.streak=0;G.S.d.err[q.k]={q:q,n:((G.S.d.err[q.k]||{}).n||0)+1};
   menash(G.wrong>=2?'hope':'smirk',1500);if(G.wrong===1&&Math.random()<.5)fairy('shy',1500);if(G.wrong>=2)hint()}}
 function finish(){G.busy=true;var S=G.S;S.d.rounds++;S.d.seen=S.d.seen.concat(G.list.map(function(q){return q.k})).slice(-160);gsave(S);railDraw();$('plGn').textContent='20 מתוך 20';
  menash('jump',0);fairy('laugh',3200);tone([523,659,784,1047,1319,1568],.9,'sine',.09,.1);
  for(var i=0;i<6;i++)(function(i){setTimeout(function(){if(G.on)spark(innerWidth*(.2+Math.random()*.6),innerHeight*(.2+Math.random()*.4),60,420)},i*260)})(i);
  setTimeout(function(){if(!G.on)return;earn(20);$('plGgot').textContent='+20';$('plGend').classList.add('on');var r=$('plGgot').getBoundingClientRect();spark(r.left+r.width/2,r.top+r.height/2,80,380)},1500)}
 function gstart(){G.L=lv();G.n=G.L==='prep'?4:6;G.S=gstore(G.L);G.list=deck(G.L,G.S);G.i=0;G.first=0;G.streak=0;$('plGend').classList.remove('on');$('plGf').classList.remove('on');menash('wave',1800);ask()}
 function gopen(){G.on=true;GV.style.display='block';$('plBub').classList.remove('on');tone([523,784,1047,1568],.6,'sine',.08,.06);gstart()}
 function gclose(){G.on=false;clearTimeout(G.hT);clearTimeout(G.mT);clearTimeout(G.fT);GV.style.display='none';PT.length=0;$('plCoins').textContent=coins()}
 $('plGback').onclick=function(e){e.stopPropagation();gclose()};$('plGhome').onclick=function(e){e.stopPropagation();gclose()};$('plGagain').onclick=function(e){e.stopPropagation();gstart()};
 GV.addEventListener('pointerdown',function(e){e.stopPropagation()});
 addEventListener('resize',function(){if(G.on)glayout()});
 /* כפתור הרמה הזמני — מתחילים סיבוב חדש ברמה החדשה */
 document.addEventListener('click',function(e){if(G.on&&e.target.closest&&e.target.closest('#tmpLv'))setTimeout(function(){if(G.on&&lv()!==G.L)gstart()},50)},true);
