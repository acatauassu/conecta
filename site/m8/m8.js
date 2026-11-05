/* Módulo 8: Tarefa 3, divulgar o meu trabalho. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  /* Calendário de 7 dias: um cartão por dia, com conteúdo e chamada */
  $('#calendario').innerHTML = [1, 2, 3, 4, 5, 6, 7].map(function (d) {
    return '<div class="wc-bloco" role="listitem"><h3>Dia ' + d + '</h3>' +
      '<div class="wc-campo"><label for="cal-' + d + '-c">Conteúdo do dia ' + d + '</label><textarea id="cal-' + d + '-c" style="min-height:96px" data-salvar="m8.cal.' + d + '.c"></textarea></div>' +
      '<div class="wc-campo"><label for="cal-' + d + '-h">Chamada do dia ' + d + '</label><textarea id="cal-' + d + '-h" style="min-height:72px" data-salvar="m8.cal.' + d + '.h"></textarea></div></div>';
  }).join('');

  W.salvarCampos(document);

  /* Passo 2: as 10 ideias. O assunto digitado aqui também vale para o calendário. */
  var calendario;
  W.pedido($('#pedido-ideias'), {
    chave: 'm8.p1',
    rotulo: 'Pedido 1 · as ideias',
    template: 'Sou {{profissao}}. Faço {{faco}}, para {{quem}}. Quero divulgar {{oque}}. Meu cartão: {{cartao}}. Sugira 10 ideias de conteúdo para Instagram ou LinkedIn, uma linha cada, simples de produzir. No fim, diga o que você supôs sobre o meu público.',
    campos: {
      profissao: { tipo: 'curto', rotulo: 'Sou (a sua profissão)', marcador: '[profissão]', exemplo: 'nutricionista' },
      faco: { tipo: 'curto', rotulo: 'Faço (o que você faz)', marcador: '[o que faço]', exemplo: 'atendimento de nutrição para famílias e pequenas empresas' },
      quem: { tipo: 'curto', rotulo: 'Para quem', marcador: '[quem]', exemplo: 'famílias de Belém' },
      oque: { tipo: 'curto', rotulo: 'Quero divulgar (o quê)', dica: 'Este assunto também vai para o pedido do calendário.', marcador: '[o quê]', exemplo: 'consultas de reeducação alimentar' },
      cartao: { tipo: 'cartao', marcador: '[cartão]' }
    },
    aoMudar: function (campo, valor) { if (campo === 'oque' && calendario) calendario.definir('oque', valor); },
    rodape: 'Use em uma conversa nova do ChatGPT. Sem dados de outras pessoas.'
  });

  /* Passo 3: o post */
  W.pedido($('#pedido-post'), {
    chave: 'm8.p2',
    rotulo: 'Pedido 2 · o post',
    template: 'Escolhi a ideia número {{n}}. Escreva um post completo, no meu jeito: legenda de até {{linhas}} linhas, uma chamada final e a ideia da arte em 2 frases. Não invente preços, prazos nem resultados. Se faltar informação, pergunte.',
    campos: {
      n: { tipo: 'curto', rotulo: 'Número da ideia que você escolheu', marcador: '[n]', exemplo: '3' },
      linhas: { tipo: 'curto', rotulo: 'Legenda de até quantas linhas', marcador: '[8]', padrao: '8', exemplo: '8' }
    },
    rodape: 'Cole na mesma conversa das ideias, depois de escolher 3.'
  });

  /* Passo 5: o calendário */
  var oqueSalvo = (W.store.get('m8.p1', {}) || {}).oque;
  calendario = W.pedido($('#pedido-calendario'), {
    chave: 'm8.p3',
    rotulo: 'Pedido 3 · o calendário',
    template: 'Monte um calendário de 7 dias para divulgar {{oque}}, com um post por dia: dia, tipo de conteúdo, ideia em uma linha e chamada. Use as minhas 3 ideias e o mesmo jeito de escrever.',
    campos: {
      oque: { tipo: 'curto', rotulo: 'O que divulgar', dica: 'Vem do pedido 1. Você pode trocar aqui.', marcador: '[o quê]', exemplo: 'consultas de reeducação alimentar' }
    },
    rodape: 'Cole na mesma conversa. Um calendário simples e possível é melhor que um perfeito e abandonado.'
  });
  if (oqueSalvo && !(W.store.get('m8.p3', {}) || {}).oque) calendario.definir('oque', oqueSalvo);

  /* Desafio extra: roteiro de vídeo de 30 segundos */
  W.pedido($('#pedido-video'), {
    chave: 'm8.p4',
    rotulo: 'Desafio extra · roteiro de vídeo',
    template: 'Escreva um roteiro de vídeo de 30 segundos sobre a ideia {{n}}, com falas curtas e o que mostrar em cada cena.',
    campos: { n: { tipo: 'curto', rotulo: 'Número da ideia', marcador: '[n]', exemplo: '3' } }
  });

  /* Frases para copiar */
  document.querySelectorAll('[data-frase]').forEach(function (b) {
    b.addEventListener('click', function () {
      W.copiar(b.getAttribute('data-frase'), null, 'Copiado. Cole junto com o seu pedido da imagem.');
    });
  });

  /* Aviso se o cartão estiver vazio */
  function avisoCartao() { $('#aviso-cartao').hidden = !!W.cartaoTexto(); }
  avisoCartao();
  window.addEventListener('focus', avisoCartao);

  /* Régua antes de publicar */
  var itens = document.querySelectorAll('[data-pub]');
  function progresso() {
    var n = 0;
    itens.forEach(function (i) { if (i.checked) n++; });
    $('#pub-barra').style.width = (n / itens.length * 100) + '%';
    $('#pub-texto').textContent = n === itens.length
      ? 'Tudo conferido! 5 de 5. O post está pronto para publicar depois. Ninguém publica nada agora.'
      : n + ' de ' + itens.length + ' conferências feitas.';
  }
  itens.forEach(function (i) { i.addEventListener('change', progresso); });
  progresso();

  /* Meu prompt validado */
  var MODELO = 'Pedido do post:\nEscolhi a ideia número [n]. Escreva um post completo, no meu jeito: legenda de até [8] linhas, uma chamada final e a ideia da arte em 2 frases. Não invente preços, prazos nem resultados. Se faltar informação, pergunte.\n\nPedido do calendário:\nMonte um calendário de 7 dias para divulgar [o quê], com um post por dia: dia, tipo de conteúdo, ideia em uma linha e chamada. Use as minhas 3 ideias e o mesmo jeito de escrever.';
  var campo = $('#p-validado');
  $('#btn-modelo').addEventListener('click', function () {
    if (campo.value.trim()) { W.toast('O seu prompt já tem texto. Apague o que está escrito se quiser começar pelo modelo.'); return; }
    campo.value = MODELO; W.store.set('m8.validado', campo.value);
    W.toast('Modelo no lugar. Adapte com o que funcionou para você.');
  });
  $('#btn-copiar-validado').addEventListener('click', function () {
    if (!campo.value.trim()) { W.toast('Escreva o seu prompt antes de copiar.'); return; }
    W.copiar(campo.value, campo, 'Prompt copiado. Guarde nas notas do celular.');
  });

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
