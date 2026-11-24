/* Avaliação do WIN Conecta. Depende de conecta.js e config.js.

   COMO LIGAR O ENVIO (time de TI):
   Esta página não guarda nem envia nada sozinha. Ao tocar em "Enviar avaliação", ela monta o objeto abaixo
   e o entrega por UM destes caminhos, nesta ordem (configure em assets/js/config.js):
     1. WIN_CONECTA_CONFIG.avaliacaoEnviar = function (dados) { return fetch(...); }   (função que devolve uma Promise)
     2. WIN_CONECTA_CONFIG.avaliacaoEnvioUrl = 'https://...'                           (a página faz POST em JSON)
   Se nenhum dos dois existir, a pessoa vê "não conseguimos enviar agora" e as respostas ficam salvas no aparelho.
   Promise resolvida = enviado. Promise rejeitada (ou resposta HTTP fora de 2xx) = erro mostrado à pessoa.

   Formato dos dados (version 1):
   {
     "versao": 1,
     "evento": "WIN Conecta, Edição Especial 50+",
     "data": "25/11/2026 (quarta)",
     "enviadoEm": "2026-11-25T22:03:11.000Z",
     "participante": "abc123" ou null,   // vem de ?p=abc123 no endereço, se o time usar (opcional)
     "nps": { "treinamento": 0..10, "winBusinessSchool": 0..10 },
     "treinamento": { "utilidade": 1..5|null, "ritmo": ..., "atividades": ..., "material": ..., "organizacao": ..., "apoio": ... },
     "instrutor":   { "dominio": 1..5|null, "clareza": ..., "duvidas": ..., "conducao": ... },
     "sugestoes": "texto" ou "",
     "aceitaNovosCursos": true|false
   }
   Modo de teste: abra a página com ?teste=1 para ver o objeto na tela. Nada é enviado nesse modo. */
(function () {
  'use strict';
  var W = window.WinConecta;
  var CFG = window.WIN_CONECTA_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var params = new URLSearchParams(window.location.search);
  var TESTE = params.get('teste') === '1';

  var NPS = [
    { id: 'nps-treinamento', campo: 'treinamento', texto: 'De 0 a 10, o quanto você recomendaria este treinamento, o WIN Conecta, a um amigo ou colega?' },
    { id: 'nps-win', campo: 'winBusinessSchool', texto: 'De 0 a 10, o quanto você recomendaria a WIN Business School a um amigo ou colega?' }
  ];
  var TREINAMENTO = [
    { id: 'utilidade', texto: 'Utilidade do conteúdo para o meu dia a dia' },
    { id: 'ritmo', texto: 'Ritmo e duração da noite' },
    { id: 'atividades', texto: 'Atividades práticas (mão na massa)' },
    { id: 'material', texto: 'Caderno digital e Connect Pack' },
    { id: 'organizacao', texto: 'Organização: local, mesas e café' },
    { id: 'apoio', texto: 'Apoio da equipe nas mesas' }
  ];
  var INSTRUTOR = [
    { id: 'dominio', texto: 'Domínio do assunto' },
    { id: 'clareza', texto: 'Clareza das explicações' },
    { id: 'duvidas', texto: 'Atenção às dúvidas' },
    { id: 'conducao', texto: 'Condução das atividades e do tempo' }
  ];

  function opcoes(nome, de, ate) {
    var h = '';
    for (var n = de; n <= ate; n++) {
      h += '<label><input type="radio" name="' + nome + '" value="' + n + '" data-salvar="aval.' + nome + '"><span aria-hidden="true">' + n + '</span><span class="wc-sr">Nota ' + n + '</span></label>';
    }
    return h;
  }
  function grupo(nome, texto, de, ate, pontaA, pontaB, obrigatorio) {
    return '<fieldset class="wc-escala" id="g-' + nome + '"' + (obrigatorio ? ' data-obrigatorio="1"' : '') + ' tabindex="-1" aria-describedby="e-' + nome + '">' +
      '<legend>' + W.escapar(texto) + '</legend>' +
      '<div class="wc-escala__notas' + (ate === 5 ? ' wc-escala__notas--5' : '') + '">' + opcoes(nome, de, ate) + '</div>' +
      '<p class="wc-escala__pontas"><span>' + de + ' = ' + W.escapar(pontaA) + '</span><span>' + ate + ' = ' + W.escapar(pontaB) + '</span></p>' +
      '<p class="wc-erro" id="e-' + nome + '" hidden>Escolha uma nota de ' + de + ' a ' + ate + '.</p>' +
      '</fieldset>';
  }
  $('#bloco-nps').innerHTML = NPS.map(function (q) { return grupo(q.id, q.texto, 0, 10, 'nada provável', 'muito provável', true); }).join('');
  var LEGENDA5 = ['Ruim', 'Excelente'];
  function bloco5(lista, prefixo) {
    return '<p class="wc-legenda" style="margin:0">1 = Ruim · 2 = Regular · 3 = Bom · 4 = Muito bom · 5 = Excelente</p>' +
      lista.map(function (q) { return grupo(prefixo + '-' + q.id, q.texto, 1, 5, LEGENDA5[0], LEGENDA5[1], false); }).join('');
  }
  $('#bloco-trein').innerHTML = bloco5(TREINAMENTO, 'trein');
  $('#bloco-instr').innerHTML = bloco5(INSTRUTOR, 'instr');

  W.salvarCampos(document);

  /* Contador de caracteres */
  var area = $('#sugestoes');
  function contar() { $('#sugestoes-cont').textContent = area.value.length + ' de 1000 caracteres'; }
  area.addEventListener('input', contar); contar();

  /* Leitura das respostas */
  function nota(nome) {
    var el = document.querySelector('input[name="' + nome + '"]:checked');
    return el ? parseInt(el.value, 10) : null;
  }
  function coletar() {
    var participante = (params.get('p') || '').replace(/[^\w.\-]/g, '').slice(0, 64) || null;
    var d = {
      versao: 1,
      evento: 'WIN Conecta, Edição Especial 50+',
      data: CFG.data || '',
      enviadoEm: new Date().toISOString(),
      participante: participante,
      nps: {},
      treinamento: {},
      instrutor: {},
      sugestoes: area.value.trim(),
      aceitaNovosCursos: $('#novos-cursos').checked
    };
    NPS.forEach(function (q) { d.nps[q.campo] = nota(q.id); });
    TREINAMENTO.forEach(function (q) { d.treinamento[q.id] = nota('trein-' + q.id); });
    INSTRUTOR.forEach(function (q) { d.instrutor[q.id] = nota('instr-' + q.id); });
    return d;
  }

  /* Validação: só as duas notas de NPS são obrigatórias */
  function validar() {
    var faltando = [];
    document.querySelectorAll('.wc-escala').forEach(function (g) {
      var nome = g.id.slice(2);
      var erro = $('#e-' + nome);
      var falta = g.getAttribute('data-obrigatorio') === '1' && nota(nome) === null;
      g.classList.toggle('wc-escala--erro', falta);
      erro.hidden = !falta;
      if (falta) faltando.push(g);
    });
    return faltando;
  }
  document.querySelectorAll('.wc-escala input').forEach(function (r) {
    r.addEventListener('change', function () {
      var g = r.closest('.wc-escala');
      g.classList.remove('wc-escala--erro');
      $('#e-' + g.id.slice(2)).hidden = true;
      if (!document.querySelector('.wc-escala--erro')) $('#aval-resumo-erro').hidden = true;
    });
  });

  function mostrarErro(texto, foco) {
    $('#aval-erro-texto').textContent = texto;
    var caixa = $('#aval-resumo-erro');
    caixa.hidden = false;
    (foco || caixa).focus();
  }

  /* Envio: ver o cabeçalho deste arquivo */
  function enviar(dados) {
    if (typeof CFG.avaliacaoEnviar === 'function') {
      return Promise.resolve().then(function () { return CFG.avaliacaoEnviar(dados); });
    }
    if (CFG.avaliacaoEnvioUrl) {
      return fetch(CFG.avaliacaoEnvioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); });
    }
    return Promise.reject(new Error('envio-nao-configurado'));
  }

  var CHAVES_RASCUNHO = ['aval.sugestoes', 'aval.novosCursos'];
  NPS.forEach(function (q) { CHAVES_RASCUNHO.push('aval.' + q.id); });
  TREINAMENTO.forEach(function (q) { CHAVES_RASCUNHO.push('aval.trein-' + q.id); });
  INSTRUTOR.forEach(function (q) { CHAVES_RASCUNHO.push('aval.instr-' + q.id); });
  function apagarRascunho() { CHAVES_RASCUNHO.forEach(function (c) { W.store.remove(c); }); }

  function mostrarObrigado(dadosTeste) {
    $('#form-avaliacao').hidden = true;
    $('#obrigado').hidden = false;
    if (CFG.proximosCursosUrl) { $('#proximos-link').href = CFG.proximosCursosUrl; $('#proximos').hidden = false; }
    if (dadosTeste) {
      $('#obrigado-teste').textContent = 'Modo de teste: nada foi enviado. Estes seriam os dados:';
      $('#obrigado-teste').hidden = false;
      $('#teste-saida').textContent = JSON.stringify(dadosTeste, null, 2);
      $('#teste-saida').hidden = false;
    }
    $('#t-obrigado').focus();
    window.scrollTo(0, 0);
  }

  $('#form-avaliacao').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var faltando = validar();
    if (faltando.length) {
      mostrarErro(faltando.length === 1 ? 'Falta uma nota de 0 a 10. Ela está marcada acima.' : 'Faltam as duas notas de 0 a 10. Elas estão marcadas acima.', faltando[0]);
      return;
    }
    $('#aval-resumo-erro').hidden = true;
    var dados = coletar();
    if (TESTE) { mostrarObrigado(dados); return; }
    var botao = $('#btn-enviar');
    botao.disabled = true; botao.textContent = 'Enviando…';
    enviar(dados).then(function () {
      W.store.set('aval.enviada', true);
      apagarRascunho();
      mostrarObrigado(null);
    }).catch(function () {
      botao.disabled = false; botao.textContent = 'Enviar avaliação';
      mostrarErro('Não conseguimos enviar agora. As suas respostas continuam neste aparelho. Toque em Enviar de novo ou chame alguém da equipe.');
    });
  });

  /* Já enviada neste aparelho */
  if (W.store.get('aval.enviada', false) && !TESTE) mostrarObrigado(null);
  $('#btn-de-novo').addEventListener('click', function () {
    W.store.remove('aval.enviada');
    window.location.reload();
  });
  $('#btn-apagar-aval').addEventListener('click', function () {
    apagarRascunho();
    window.location.reload();
  });
})();
