/* Módulo 9: Connect Pack e fechamento. Depende de conecta.js, config.js e connect-pack-data.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var CFG = window.WIN_CONECTA_CONFIG || {};
  var MODELOS = window.CONNECT_PACK || [];
  var $ = function (s) { return document.querySelector(s); };

  /* Os 8 modelos: o título e o plano vêm dos dados do Connect Pack; a linha curta é a do slide */
  var LINHAS = {
    1: 'E-mails, mensagens e textos no seu jeito.',
    2: 'Informações com fonte, perguntas e abertura.',
    3: 'Um post completo e 7 dias de conteúdo.',
    4: 'O texto para apresentar o seu trabalho.',
    5: 'Roteiro e conteúdo para falar em público.',
    6: 'Uma tabela para calcular quanto cobrar.',
    7: 'Concorrentes e se a ideia se sustenta.',
    8: 'Organizar a semana, tarefas e lembretes.'
  };
  $('#grade-modelos').innerHTML = MODELOS.map(function (m) {
    return '<li><a class="wc-cartao" href="../connect-pack/#modelo-' + m.id + '">' +
      '<span class="wc-cartao__num">Modelo ' + m.id + (m.id <= 3 ? ' · praticado hoje' : ' · novo') + '</span>' +
      '<span class="wc-cartao__titulo">' + W.escapar(m.titulo) + '</span>' +
      '<span class="wc-cartao__txt">' + W.escapar(LINHAS[m.id] || m.resultado) + '</span>' +
      '<span class="wc-plano' + (m.planoTipo === 'pago' ? ' wc-plano--pago' : '') + '">' + (m.planoTipo === 'gratuito' ? 'Funciona no plano gratuito' : 'Melhor no plano pago') + '</span>' +
      '</a></li>';
  }).join('');

  /* As duas listas de "qual modelo" compartilham a mesma resposta salva */
  var opcoes = '<option value="">Escolha um modelo</option>' + MODELOS.map(function (m) {
    return '<option value="' + m.id + '">' + m.id + ' · ' + W.escapar(m.titulo) + '</option>';
  }).join('');
  $('#m-primeiro').innerHTML = opcoes;
  $('#s-modelo').innerHTML = opcoes;

  W.salvarCampos(document);
  [$('#m-primeiro'), $('#s-modelo')].forEach(function (a, i, todos) {
    a.addEventListener('change', function () { todos[1 - i].value = a.value; });
  });

  /* O resumo da noite, lido do que a pessoa fez neste aparelho */
  function preenchido(chave) { var v = W.store.get(chave, ''); return typeof v === 'string' && v.trim().length > 0; }
  function todos(chaves) { return chaves.every(function (k) { return W.store.get(k, false) === true; }); }
  var ITENS = [
    { nome: 'Meu cartão de contexto', feito: !!W.cartaoTexto(), onde: '../m3/#monte-cartao', modulo: 'Módulo 3' },
    { nome: 'Tarefa 1 · Escrever com a minha voz: prompt validado', feito: preenchido('m4.validado'), onde: '../m4/#registro', modulo: 'Módulo 4' },
    { nome: 'Régua dos 5 passada em um texto meu', feito: todos(['m5.regua.nomes', 'm5.regua.numeros', 'm5.regua.fatos', 'm5.regua.promessas', 'm5.regua.jeito']), onde: '../m5/#passe', modulo: 'Módulo 5' },
    { nome: 'Tarefa 2 · Preparar a reunião: abertura de 2 minutos', feito: preenchido('m6.abertura') || preenchido('m6.funcionou'), onde: '../m6/#fazer', modulo: 'Módulo 6' },
    { nome: 'Tarefa 3 · Divulgar o meu trabalho: post ou prompt validado', feito: preenchido('m8.legenda') || preenchido('m8.validado'), onde: '../m8/#fazer', modulo: 'Módulo 8' }
  ];
  var feitos = 0;
  $('#resumo').innerHTML = ITENS.map(function (i) {
    if (i.feito) feitos++;
    return '<li><div class="wc-item" style="cursor:default;' + (i.feito ? 'border-color:var(--acento);background:var(--painel-suave)' : '') + '"><div>' +
      '<b>' + (i.feito ? 'Feito · ' : 'Fica para depois · ') + W.escapar(i.nome) + '</b>' +
      (i.feito ? '' : '<span><a href="' + i.onde + '">Abrir o ' + i.modulo + '</a></span>') +
      '</div></div></li>';
  }).join('');

  /* Avaliação e próximos cursos: os endereços vêm de assets/js/config.js */
  if (CFG.avaliacaoUrl) {
    $('#aval-link').href = CFG.avaliacaoUrl;
    $('#aval-com-link').hidden = false;
    $('#aval-sem-link').hidden = true;
  }
  if (CFG.proximosCursosUrl) {
    $('#proximos-link').href = CFG.proximosCursosUrl;
    $('#proximos').hidden = false;
    $('#proximos-texto').hidden = true;
  }

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
