const { chromium } = require('playwright');
const PAGES=['index.html','m1/index.html','m2/index.html','m3/index.html','m4/index.html','m5/index.html','m6/index.html','m7/index.html','m8/index.html','m9/index.html','connect-pack/index.html','connect-pack/index.html#modelo-1','meu-caderno/index.html'];
const BASE=process.env.BASE||'http://localhost:8776/';
(async()=>{
  const b=await chromium.launch(); const rel={alvos:{},pequeno:{},reflow:[],teclado:[],titulos:[],pulo:[]};
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
  for (const pg of PAGES) {
    const p=await ctx.newPage(); await p.goto(BASE+pg); await p.waitForTimeout(300);
    await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    // 1. alvos de toque < 44px (links dentro de parágrafo não contam)
    const al=await p.evaluate(()=>{const out=[];document.querySelectorAll('a,button,input,select,textarea,summary,label.wc-item').forEach(e=>{const cs=getComputedStyle(e); if(cs.display==='none'||cs.visibility==='hidden')return; if(e.type==='hidden')return; const r=e.getBoundingClientRect(); if(r.width===0||r.height===0)return; const emLinha=e.tagName==='A'&&e.closest('p,li,span,small,div.wc-legenda')&&getComputedStyle(e).display==='inline'; if(emLinha)return; if(r.height<44||r.width<44){out.push((e.id||e.className||e.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' "'+(e.textContent||e.value||'').trim().slice(0,28)+'"');}});return out;});
    if(al.length) rel.alvos[pg]=al;
    // 2. texto menor que 16px
    const pq=await p.evaluate(()=>{const m={};const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.trim();if(!t)continue;const e=n.parentElement;const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')continue;const r=e.getBoundingClientRect();if(!r.width)continue;const fs=parseFloat(cs.fontSize);if(fs<16){const k=e.tagName+'.'+(e.className||'')+' '+fs+'px';m[k]=(m[k]||0)+1;}}return m;});
    if(Object.keys(pq).length) rel.pequeno[pg]=pq;
    // 3. títulos
    const ht=await p.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getBoundingClientRect().width>0).map(h=>h.tagName[1]));
    const h1=ht.filter(x=>x==='1').length; let pulo=false; for(let i=1;i<ht.length;i++) if(+ht[i]>+ht[i-1]+1) pulo=true;
    rel.titulos.push(pg+': h1='+h1+(pulo?' PULA NÍVEL ['+ht.join('')+']':''));
    // 4. teclado: skip link + foco visível
    await p.keyboard.press('Tab'); const prim=await p.evaluate(()=>{const e=document.activeElement;const r=e.getBoundingClientRect();return {txt:(e.textContent||'').trim().slice(0,30),cls:e.className,visivel:r.top>=0&&r.top<200};});
    rel.pulo.push(pg+': 1º Tab = "'+prim.txt+'" visível='+prim.visivel);
    let semFoco=[],n=0; for(let i=0;i<60;i++){ await p.keyboard.press('Tab'); const f=await p.evaluate(()=>{const e=document.activeElement; if(!e||e===document.body)return null; const cs=getComputedStyle(e); const ow=parseFloat(cs.outlineWidth)||0; const vis=cs.outlineStyle!=='none'&&ow>=2; return {vis,txt:(e.id||e.className||e.tagName)+' '+(e.textContent||'').trim().slice(0,20)};}); if(f){n++; if(!f.vis) semFoco.push(f.txt);} }
    if(semFoco.length) rel.teclado.push(pg+': sem contorno de foco em '+[...new Set(semFoco)].slice(0,5).join(' | '));
    await p.close();
  }
  // 5. reflow em 320px
  const c2=await b.newContext({viewport:{width:320,height:640},isMobile:true});
  for (const pg of PAGES) { const p=await c2.newPage(); await p.goto(BASE+pg); await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true)); const w=await p.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]); if(w[0]>w[1]) rel.reflow.push(pg+' '+w.join('>')); await p.close(); }
  // 6. espaçamento de texto (WCAG 1.4.12)
  const c3=await b.newContext({viewport:{width:390,height:844},isMobile:true}); rel.espacamento=[];
  for (const pg of PAGES) { const p=await c3.newPage(); await p.goto(BASE+pg); await p.addStyleTag({content:'*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}'}); await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true)); const r=await p.evaluate(()=>{const cortados=[];document.querySelectorAll('button,a.wc-btn,.wc-selo,.wc-plano,.wc-tempo,label').forEach(e=>{if(e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=='visible')cortados.push((e.className||e.tagName)+' '+(e.textContent||'').trim().slice(0,20));});return {w:[document.documentElement.scrollWidth,document.documentElement.clientWidth],cortados};}); if(r.w[0]>r.w[1]||r.cortados.length) rel.espacamento.push(pg+' '+JSON.stringify(r)); await p.close(); }
  console.log('=== ALVOS DE TOQUE < 44px (390px) ==='); console.log(Object.keys(rel.alvos).length?JSON.stringify(rel.alvos,null,1):'nenhum');
  console.log('\n=== TEXTO < 16px ==='); console.log(Object.keys(rel.pequeno).length?JSON.stringify(rel.pequeno,null,1):'nenhum');
  console.log('\n=== TÍTULOS ==='); console.log(rel.titulos.join('\n'));
  console.log('\n=== 1º TAB (skip link) ==='); console.log(rel.pulo.join('\n'));
  console.log('\n=== FOCO VISÍVEL ==='); console.log(rel.teclado.length?rel.teclado.join('\n'):'todos os elementos focados têm contorno');
  console.log('\n=== REFLOW 320px ==='); console.log(rel.reflow.length?rel.reflow.join('\n'):'sem rolagem lateral em nenhuma página');
  console.log('\n=== ESPAÇAMENTO DE TEXTO AUMENTADO ==='); console.log(rel.espacamento.length?rel.espacamento.join('\n'):'sem cortes nem rolagem lateral');
  await b.close();
})();
