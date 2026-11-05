/* Página inicial: lista os módulos e mostra o progresso de cada um. Depende de conecta.js e progresso.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var CFG = window.WIN_CONECTA_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };

  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var v = CFG[el.getAttribute('data-cfg')];
    if (v) el.textContent = v;
  });

  var DESCRICAO = {
    1: 'Acesso, cartão de entrada, combinados e apresentação na mesa.',
    2: 'Buscador ou conversa, e por que ela pode errar com segurança.',
    3: 'O método para pedir bem e o seu cartão pessoal.',
    4: 'Reescreva um texto seu e registre o seu prompt validado.',
    5: 'A Régua dos 5, os golpes que usam IA e as 3 regras.',
    6: 'Pesquisa só com informação pública e uma abertura de 2 minutos.',
    7: 'As cinco IAs e o jogo Qual IA para quê?',
    8: 'Um post completo e um calendário de 7 dias.',
    9: 'Os 8 modelos, a sua próxima semana e a avaliação.'
  };
  var ROTULO = { novo: 'Ainda não iniciado', andamento: 'Em andamento', feito: 'Feito' };

  var mods = W.progresso.modulos();
  $('#lista-modulos').innerHTML = mods.map(function (m) {
    var pct = Math.round(m.feitos / m.total * 100);
    var tarefa = /^Tarefa/.test(m.titulo);
    return '<li><a class="wc-cartao" href="' + m.pasta + '/index.html" aria-label="Módulo ' + m.numero + ': ' + W.escapar(m.titulo) + '. ' + ROTULO[m.estado] + '.">' +
      '<span class="wc-cartao__num">Módulo ' + m.numero + ' · ' + m.hora + '</span>' +
      '<span class="wc-cartao__titulo">' + W.escapar(m.titulo) + '</span>' +
      '<span class="wc-cartao__txt">' + W.escapar(DESCRICAO[m.numero]) + '</span>' +
      '<span class="wc-plano' + (m.estado === 'feito' ? '' : '') + '" style="' + (m.estado === 'feito' ? 'background:var(--painel-suave)' : '') + '">' +
        ROTULO[m.estado] + (m.estado === 'andamento' ? ' · ' + m.feitos + ' de ' + m.total : '') + '</span>' +
      '<span class="wc-barra-prog" aria-hidden="true"><i style="width:' + pct + '%"></i></span>' +
      '</a></li>';
  }).join('');

  /* Botão "continuar de onde parei": o primeiro módulo que ainda não está feito */
  var proximo = mods.filter(function (m) { return m.estado !== 'feito'; })[0];
  var iniciou = mods.some(function (m) { return m.estado !== 'novo'; });
  var btn = $('#btn-continuar');
  if (!proximo) {
    btn.textContent = 'Abrir o Meu caderno';
    btn.href = 'meu-caderno/index.html';
  } else if (iniciou) {
    btn.textContent = 'Continuar no Módulo ' + proximo.numero;
    btn.href = proximo.pasta + '/index.html';
  }

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
