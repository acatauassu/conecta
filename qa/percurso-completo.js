const { chromium } = require('playwright');

const BASE=process.env.BASE||'http://localhost:8776/';
(async()=>{
  const b=await chromium.launch(); const erros=[]; const falhas=[]; const ok=(c,m)=>{ if(!c){falhas.push(m);console.log('FALHOU:',m);} };
  const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,permissions:['clipboard-read','clipboard-write']}); const p=await ctx.newPage();
  p.on('pageerror',e=>erros.push('PAGEERROR '+p.url()+' '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!/fonts\.|ERR_|Failed to load/.test(m.text()))erros.push(p.url()+' '+m.text())});
  const T=s=>p.textContent(s+' .wc-pedido__texto');
  const prox=async(n)=>{ await p.locator(`a.wc-btn:has-text("Ir para o Módulo ${n}")`).first().click(); await p.waitForURL(`**/m${n}/index.html`); };

  await p.goto(BASE+'index.html'); await p.waitForSelector('#lista-modulos li');
  ok((await p.textContent('#btn-continuar')).includes('Módulo 1'),'home: botão começar');
  await p.click('#btn-continuar'); await p.waitForURL('**/m1/index.html');
  // M1
  for (const k of ['wifi','chatgpt','app','ola']) await p.check(`input[data-salvar="m1.acesso.${k}"]`);
  await p.fill('#e-nome','Marta'); await p.selectOption('#e-mesa','3'); await p.check('input[name="nivel"][value="2"]'); await p.check('input[name="plano"][value="gratuito"]'); await p.fill('#e-quero','Escrever melhor para os meus clientes.');
  ok((await p.textContent('#prog-texto')).includes('Tudo pronto'),'m1 progresso'); await prox(2);
  // M2
  await p.check('input[data-salvar="m2.usos.escrever"]'); await p.fill('#d-mudou','O segundo trouxe ideias que combinam com ela.');
  await p.check('input[name="acertou"][value="errou"]'); await p.fill('#d-errado','Errou o bairro.'); ok(/Sugira 3 presentes/.test(await T('#pedido-2')),'m2 pedido 2'); await prox(3);
  // M3
  await p.check('input[name="situacao"][value="convite"]'); await p.click('#pedido-meu [data-exemplo]'); ok((await T('#pedido-meu')).includes('professora aposentada'),'m3 exemplo');
  await p.click('[data-cartao-exemplo]'); for (const k of ['salvei','testei','soou']) await p.check(`input[data-salvar="m3.pronto.${k}"]`);
  ok(await p.isVisible('#msg-pronto'),'m3 cartão pronto'); ok((await T('#pedido-teste')).includes('Marta, 58 anos'),'m3 teste usa o cartão'); await prox(4);
  // M4
  await p.check('input[name="tipo"][value="proposta"]'); await p.click('#btn-apoio'); await p.click('#pedido-meu [data-exemplo]');
  ok((await T('#pedido-meu')).includes('Marta, 58 anos'),'m4 pedido recebeu o cartão do M3'); ok(await p.isHidden('#aviso-cartao'),'m4 sem aviso de cartão');
  await p.fill('#m-aj1','Mais caloroso.'); await p.fill('#m-melhorou','Ficou mais curto.'); await p.click('#btn-modelo'); await prox(5);
  // M5
  await p.click('#btn-apoio'); for (const k of ['nomes','numeros','fatos','promessas','jeito']) await p.check(`input[data-salvar="m5.regua.${k}"]`); await p.fill('#r-encontrei','Nada errado.'); await prox(6);
  // M6
  await p.check('input[name="tipo"][value="cliente"]'); await p.click('#pedido-pesquisa [data-exemplo]');
  for (const k of ['nomes','numeros','fatos','promessas','jeito']) await p.check(`input[data-salvar="m6.regua.${k}"]`); await p.check('input[data-salvar="m6.fonte1"]'); await p.check('input[data-salvar="m6.fonte2"]');
  ok((await T('#pedido-abertura')).includes('Marta, 58 anos'),'m6 abertura recebeu o cartão'); await p.fill('#r-abertura','Bom dia, obrigada pelo tempo.'); await p.check('input[data-salvar="m6.ensaio.li"]'); await p.click('#btn-modelo'); await prox(7);
  // M7
  await p.check('input[data-salvar="m7.obs.fonte"]'); await p.selectOption('#j-a','Gemini Notebook'); await p.click('#btn-respostas'); await p.fill('#m-testar','Planejar uma viagem.'); await prox(8);
  // M8
  await p.fill('#p-descricao','Atendo famílias. Quero divulgar consultas.'); await p.click('#pedido-ideias [data-exemplo]');
  ok((await T('#pedido-ideias')).includes('Marta, 58 anos'),'m8 pedido 1 recebeu o cartão'); await p.fill('#p-ideias','1, 3 e 5'); await p.fill('#p-legenda','Comer bem é possível.');
  for (const k of ['promessas','numeros','fatos','imagem','jeito']) await p.check(`input[data-salvar="m8.pub.${k}"]`); await p.fill('#cal-1-c','Dica de almoço'); await p.click('#btn-modelo'); await prox(9);
  // M9
  await p.selectOption('#m-primeiro','3'); await p.fill('#s-1','Escrever uma proposta');
  const resumo=(await p.locator('#resumo li').allTextContents()).map(t=>t.replace(/\s+/g,' ').trim().slice(0,12)); console.log('M9 resumo:',resumo.join(' | '));
  ok(resumo.every(t=>t.startsWith('Feito')),'m9 resumo todo "Feito"');
  // Home
  await p.goto(BASE+'index.html'); await p.waitForSelector('#lista-modulos li');
  const est=(await p.locator('#lista-modulos li').allTextContents()).map(t=>{const m=t.match(/Módulo (\d)/)[1];const e=t.match(/(Ainda não iniciado|Em andamento · \d+ de \d+|Feito)/)[1];return m+':'+e;});
  console.log('Home:',est.join(' | ')); ok(est.every(x=>/:Feito$/.test(x)),'home: todos os módulos "Feito"'); ok((await p.textContent('#btn-continuar')).includes('Meu caderno'),'home: botão final');
  // Caderno
  await p.click('#btn-continuar'); await p.waitForURL('**/meu-caderno/index.html');
  const secs=await p.locator('.cad-sec h2').allTextContents(); console.log('Caderno:',secs.length,'seções ->',secs.map(s=>s.split(' · ')[0]).join(', '));
  ok(secs.length>=9,'caderno com as seções de todos os módulos'); ok((await p.textContent('#titulo-pagina'))==='Caderno de Marta','caderno com o nome');
  await p.click('#btn-copiar'); const txt=await p.evaluate(()=>navigator.clipboard.readText());
  for (const trecho of ['Marta','Escrever melhor para os meus clientes','Errou o bairro','professora aposentada','Mais caloroso','Nada errado','Bom dia, obrigada pelo tempo','Planejar uma viagem','Comer bem é possível','Dia 1 · conteúdo: Dica de almoço','Escrever uma proposta']) ok(txt.includes(trecho),'caderno copiado contém: '+trecho);
    // apagar tudo
  await p.click('#btn-apagar-tudo'); await p.waitForTimeout(1300); ok((await p.textContent('#caderno')).includes('ainda está vazio'),'apagar tudo esvazia o caderno');
  console.log('\nResultado do percurso: ',falhas.length?falhas.length+' falha(s)':'tudo certo','| erros de console/página:',erros.length?erros:'nenhum');
  await b.close();
})();
