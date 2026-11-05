/* Meu caderno: reúne o que a pessoa escreveu nos módulos. Lê só do aparelho. Depende de conecta.js e connect-pack-data.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var CFG = window.WIN_CONECTA_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };

  var NIVEL = { '1': '1. Ainda não usei', '2': '2. Já experimentei', '3': '3. Uso algumas vezes por semana', '4': '4. Uso todos os dias' };
  var PLANO = { gratuito: 'Gratuito', pago: 'Pago', 'sem-conta': 'Ainda não tenho conta' };
  var SITUACAO = { convite: 'Um convite', agradecimento: 'Um agradecimento', aviso: 'Um aviso para um grupo' };
  var TIPO_TEXTO = { email: 'E-mail para clientes', whatsapp: 'Mensagem de WhatsApp', proposta: 'Proposta ou orçamento', convite: 'Convite ou aviso', redes: 'Texto para as redes' };
  var ACERTOU = { tudo: 'Ela acertou tudo.', quase: 'Ela acertou quase tudo.', errou: 'Ela errou ou inventou alguma coisa.' };
  var TIPO_REUNIAO = { cliente: 'Cliente novo', entrevista: 'Entrevista', parceiro: 'Fornecedor ou parceiro' };
  var MODO = { pessoa: 'Uma pessoa e a empresa dela', empresa: 'Só a empresa' };

  /* ---------- construtores de itens: { r: rótulo, v: texto } ---------- */
  function limpo(v) { return (typeof v === 'string' ? v : (v === undefined || v === null || v === false ? '' : String(v))).trim(); }
  function txt(r, chave, mapa) {
    var v = W.store.get(chave, '');
    v = limpo(v);
    return { r: r, v: mapa && mapa[v] ? mapa[v] : v };
  }
  function obj(chave, subs) {
    var o = W.store.get(chave, {}) || {};
    return subs.map(function (s) { return { r: s[1], v: limpo(o[s[0]]) }; });
  }
  function marcados(r, itens) {
    var v = itens.filter(function (i) { return W.store.get(i[0], false) === true; }).map(function (i) { return '• ' + i[1]; }).join('\n');
    return { r: r, v: v };
  }
  function plano(arr) { return arr.reduce(function (a, x) { return a.concat(x); }, []); }

  function secoes() {
    var cartao = W.getCartao();
    var S = [];

    S.push({ titulo: 'Módulo 1 · Meu cartão de entrada', itens: [
      txt('Meu nome', 'entrada.nome'), txt('Número da minha mesa', 'entrada.mesa'),
      txt('Quanto uso IA hoje', 'entrada.nivel', NIVEL), txt('Meu plano do ChatGPT', 'entrada.plano', PLANO),
      txt('O que quero resolver com a IA', 'entrada.quero'), txt('O que é mais difícil para mim hoje', 'entrada.dificil'),
      marcados('Check de acesso', [['m1.acesso.wifi', 'Wi-Fi'], ['m1.acesso.chatgpt', 'Conta no ChatGPT'], ['m1.acesso.app', 'Aplicativo no celular'], ['m1.acesso.ola', 'Teste do “Olá”']]) ] });

    S.push({ titulo: 'Módulo 2 · Meu cartão de descobertas', itens: [
      marcados('Como eu uso a IA hoje', [['m2.usos.pesquisar', 'Para pesquisar'], ['m2.usos.duvidas', 'Para tirar dúvidas'], ['m2.usos.escrever', 'Para escrever']]),
      txt('O mesmo pedido, dois jeitos: o que mudou?', 'm2.mudou'), txt('Perguntei sobre algo que conheço bem', 'm2.acertou', ACERTOU),
      txt('O que estava errado ou inventado', 'm2.errado'), txt('Minha dúvida para o Denis ou para a mesa', 'm2.duvida') ] });

    S.push({ titulo: 'Módulo 3 · Meus 4 C e meu cartão de contexto', itens: plano([
      [txt('Minha situação', 'm3.situacao', SITUACAO)],
      obj('m3.p1', [['contexto', '1. Contexto'], ['comando', '2. Comando'], ['criterios', '3. Critérios'], ['conferencia', '4. Conferência']]),
      W.CAMPOS_CARTAO.map(function (c) { return { r: 'Cartão · ' + c.rotulo, v: limpo(cartao[c.id]) }; }),
      [marcados('Meu cartão está pronto?', [['m3.pronto.salvei', 'Salvei nas notas do celular'], ['m3.pronto.testei', 'Testei em uma conversa nova'], ['m3.pronto.soou', 'Soou como eu']])] ]) });

    S.push({ titulo: 'Módulo 4 · Tarefa 1: Escrever com a minha voz', itens: plano([
      [txt('O texto que escolhi', 'm4.tipo', TIPO_TEXTO), txt('O que eu queria melhorar', 'm4.melhorar')],
      obj('m4.p', [['jeito', 'Texto de exemplo do meu jeito'], ['texto', 'O texto que quis melhorar'], ['tom', 'Tom'], ['numero', 'Quantas linhas']]),
      [txt('Primeiro ajuste que pedi', 'm4.ajuste1'), txt('Segundo ajuste que pedi', 'm4.ajuste2'), txt('O que melhorou, e onde a IA errou', 'm4.melhorou'),
       txt('Meu prompt validado', 'm4.validado'), txt('O ajuste que fez a diferença', 'm4.diferenca'), txt('Vou usar este pedido para', 'm4.usar'), txt('O que aprendi', 'm4.aprendi')] ]) });

    S.push({ titulo: 'Módulo 5 · Minha Régua dos 5', itens: [
      marcados('O que conferi', [['m5.regua.nomes', 'Nomes'], ['m5.regua.numeros', 'Números'], ['m5.regua.fatos', 'Fatos'], ['m5.regua.promessas', 'Promessas'], ['m5.regua.jeito', 'Meu jeito']]),
      txt('O que encontrei no meu texto', 'm5.encontrei'), txt('Como ficou depois de corrigir', 'm5.corrigido') ] });

    S.push({ titulo: 'Módulo 6 · Tarefa 2: Minha reunião', itens: plano([
      [txt('Minha situação', 'm6.tipo', TIPO_REUNIAO), txt('O que eu gostaria de saber antes de entrar na sala', 'm6.saber'), txt('Quis pesquisar', 'm6.modo', MODO)],
      obj('m6.p1', [['nome', 'Pessoa'], ['cargo', 'Cargo e empresa'], ['cidade', 'Cidade'], ['objetivo', 'Objetivo da reunião']]),
      obj('m6.p1e', [['empresa', 'Empresa pesquisada'], ['cidade', 'Cidade da empresa'], ['objetivo', 'Objetivo da reunião (só a empresa)']]),
      [marcados('Régua dos 5 e fontes', [['m6.regua.nomes', 'Nomes'], ['m6.regua.numeros', 'Números'], ['m6.regua.fatos', 'Fatos'], ['m6.regua.promessas', 'Promessas'], ['m6.regua.jeito', 'Meu jeito'], ['m6.fonte1', 'Abri a primeira fonte'], ['m6.fonte2', 'Abri a segunda fonte']]),
       txt('Informações com fonte que conferi', 'm6.infos'), txt('Perguntas que podem me fazer', 'm6.perguntas'), txt('O que posso propor', 'm6.propor'),
       txt('Minha abertura de 2 minutos', 'm6.abertura'),
       marcados('Ensaiei em voz alta', [['m6.ensaio.li', 'Li para a minha mesa'], ['m6.ensaio.troquei', 'Troquei uma frase para soar como eu']]),
       txt('O pedido que funcionou', 'm6.funcionou'), txt('A informação mais útil', 'm6.util'), txt('O ajuste que fiz', 'm6.ajuste')] ]) });

    S.push({ titulo: 'Módulo 7 · Qual IA para quê', itens: [
      marcados('O que observei', [['m7.obs.comparei', 'Comparei o formato das duas respostas'], ['m7.obs.fonte', 'Vi qual IA mostrou a fonte'], ['m7.obs.link', 'Abri um link e conferi na fonte oficial']]),
      txt('A · Resumir três PDFs do meu curso', 'm7.jogo.a'), txt('B · Saber uma regra que mudou esta semana, com fonte', 'm7.jogo.b'),
      txt('C · Organizar e-mails e agenda do meu Gmail', 'm7.jogo.c'), txt('D · Revisar um texto de 40 páginas', 'm7.jogo.d'),
      txt('Em qual situação vou testar outra IA', 'm7.testar') ] });

    var cal = [];
    for (var d = 1; d <= 7; d++) { cal.push(txt('Dia ' + d + ' · conteúdo', 'm8.cal.' + d + '.c'), txt('Dia ' + d + ' · chamada', 'm8.cal.' + d + '.h')); }
    S.push({ titulo: 'Módulo 8 · Tarefa 3: Meu post e meu calendário', itens: plano([
      [txt('O que quero divulgar (5 linhas)', 'm8.descricao')],
      obj('m8.p1', [['profissao', 'Sou'], ['faco', 'Faço'], ['quem', 'Para quem'], ['oque', 'Quero divulgar']]),
      [txt('As 3 ideias que escolhi', 'm8.ideias'), txt('Legenda do meu post', 'm8.legenda'), txt('Chamada', 'm8.chamada'), txt('Ideia da arte', 'm8.arte'),
       marcados('Antes de publicar', [['m8.pub.promessas', 'Promessas'], ['m8.pub.numeros', 'Números e dados'], ['m8.pub.fatos', 'Fatos'], ['m8.pub.imagem', 'Imagem'], ['m8.pub.jeito', 'Meu jeito']])],
      cal,
      [txt('Meu prompt validado', 'm8.validado'), txt('O ajuste que fez o post soar como eu', 'm8.ajuste')] ]) });

    var primeiro = W.store.get('m9.modelo', '');
    var nomeModelo = '';
    (window.CONNECT_PACK || []).forEach(function (m) { if (String(m.id) === String(primeiro)) nomeModelo = m.id + ' · ' + m.titulo; });
    S.push({ titulo: 'Módulo 9 · Minha próxima semana', itens: [
      txt('Situação 1', 'm9.s1'), txt('Situação 2', 'm9.s2'), txt('Situação 3', 'm9.s3'),
      { r: 'O modelo do Connect Pack que vou testar primeiro', v: nomeModelo },
      txt('O que mais me surpreendeu nesta noite', 'm9.surpreendeu') ] });

    /* Connect Pack: o que a pessoa preencheu em cada modelo */
    var pack = [];
    (window.CONNECT_PACK || []).forEach(function (m) {
      var v = W.store.get('pack.m' + m.id, {}) || {};
      Object.keys(m.campos).forEach(function (k) {
        var c = m.campos[k];
        if (c.tipo === 'cartao') return;
        pack.push({ r: 'Modelo ' + m.id + ' · ' + c.rotulo, v: limpo(v[k]) });
      });
    });
    S.push({ titulo: 'Connect Pack · O que preenchi nos modelos', itens: pack });

    return S;
  }

  /* ---------- tela ---------- */
  var mostrarVazios = false;
  function visiveis(sec) { return sec.itens.filter(function (i) { return mostrarVazios || i.v; }); }

  function pintar() {
    var S = secoes(), html = '', algum = false;
    S.forEach(function (sec) {
      var itens = visiveis(sec);
      if (!itens.length) return;
      algum = true;
      html += '<section class="cad-sec"><h2>' + W.escapar(sec.titulo) + '</h2><dl>' +
        itens.map(function (i) {
          return '<div class="cad-item' + (i.v ? '' : ' cad-item--vazio') + '"><dt>' + W.escapar(i.r) + '</dt><dd>' + (i.v ? W.escapar(i.v) : 'Ainda não preenchido') + '</dd></div>';
        }).join('') + '</dl></section>';
    });
    if (!algum) {
      html = '<div class="cad-vazio"><p class="wc-subtitulo" style="margin:0 0 8px">O seu caderno ainda está vazio.</p>' +
        '<p style="margin:0 0 16px">Quando você escrever nos módulos, tudo aparece aqui, na ordem da noite.</p>' +
        '<p style="margin:0"><a class="wc-btn" href="../index.html">Ir para os módulos</a></p></div>';
    }
    $('#caderno').innerHTML = html;

    var nome = limpo(W.store.get('entrada.nome', ''));
    $('#titulo-pagina').textContent = nome ? 'Caderno de ' + nome : 'Meu caderno';
    document.title = (nome ? 'Caderno de ' + nome : 'Meu caderno') + ' · WIN Conecta 50+';
    $('#subtitulo').textContent = 'WIN Conecta · Edição Especial 50+ · ' + (CFG.data || '25/11/2026');
  }

  function comoTexto() {
    var nome = limpo(W.store.get('entrada.nome', ''));
    var linhas = [(nome ? 'Caderno de ' + nome : 'Meu caderno'), 'WIN Conecta · Edição Especial 50+ · ' + (CFG.data || '25/11/2026'), ''];
    secoes().forEach(function (sec) {
      var itens = sec.itens.filter(function (i) { return i.v; });
      if (!itens.length) return;
      linhas.push(sec.titulo.toUpperCase());
      itens.forEach(function (i) { linhas.push(i.r + ': ' + (i.v.indexOf('\n') >= 0 ? '\n' + i.v : i.v)); });
      linhas.push('');
    });
    return linhas.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  $('#chk-vazios').addEventListener('change', function (e) { mostrarVazios = e.target.checked; pintar(); });
  $('#btn-imprimir').addEventListener('click', function () {
    try { window.print(); } catch (e) { W.toast('Não consegui abrir a impressão. Use o menu do navegador: Imprimir.'); }
  });
  $('#btn-copiar').addEventListener('click', function () {
    var t = comoTexto();
    if (t.split('\n').length < 4) { W.toast('O caderno ainda está vazio. Escreva nos módulos primeiro.'); return; }
    W.copiar(t, $('#caderno'), 'Caderno copiado. Cole no WhatsApp, no e-mail ou nas notas.');
  });
  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });

  pintar();
})();
