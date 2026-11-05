const { chromium } = require('playwright');
const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const PAGES=['index.html','m1/index.html','m2/index.html','m3/index.html','m4/index.html','m5/index.html','m6/index.html','m7/index.html','m8/index.html','m9/index.html','connect-pack/index.html','connect-pack/index.html#modelo-2','meu-caderno/index.html'];
const BASE=process.env.BASE||'http://localhost:8776/';
(async()=>{
  const b=await chromium.launch(); const resumo={};
  for (const [nome,vp,mob] of [['desktop',{width:1280,height:900},false],['celular',{width:390,height:844},true]]) {
    for (const tema of ['light','dark']) {
      const ctx=await b.newContext({viewport:vp,isMobile:mob,colorScheme:tema});
      for (const pg of PAGES) {
        const p=await ctx.newPage(); await p.goto(BASE+pg); await p.waitForTimeout(400);
        // abre os <details> para auditar o conteúdo escondido
        await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
        await p.evaluate(AXE);
        const r=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}}));
        r.violations.forEach(v=>{ const k=v.id+' | '+v.impact+' | '+v.help; resumo[k]=resumo[k]||{n:0,onde:new Set(),amostra:null}; resumo[k].n+=v.nodes.length; resumo[k].onde.add(pg+' ['+nome+'/'+tema+']'); if(!resumo[k].amostra) resumo[k].amostra=v.nodes[0].html.slice(0,140)+' → '+(v.nodes[0].any[0]&&v.nodes[0].any[0].message||'').slice(0,160); });
        await p.close();
      }
      await ctx.close();
    }
  }
  const ks=Object.keys(resumo);
  console.log(ks.length? ks.length+' tipos de problema:':'Nenhuma violação encontrada.');
  ks.forEach(k=>{console.log('\n'+k+'\n  ocorrências:',resumo[k].n,'\n  em:',[...resumo[k].onde].slice(0,6).join(', '),(resumo[k].onde.size>6?'... +'+(resumo[k].onde.size-6):''),'\n  exemplo:',resumo[k].amostra);});
  await b.close();
})();
