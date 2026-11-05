/* Módulo 7: panorama das outras IAs. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  W.salvarCampos(document);

  /* A mesma pergunta nas duas IAs. Não escrevemos o valor do limite aqui: ele muda e deve ser conferido na fonte oficial. */
  W.pedido($('#pedido-mei'), {
    rotulo: 'A pergunta, para as duas IAs',
    template: 'Qual é o limite de faturamento anual do MEI hoje? Mostre a fonte.',
    rodape: 'Cole a mesma pergunta nas duas IAs e compare. Depois, abra a fonte e confira no site oficial.'
  });

  /* Jogo: qual IA para quê? */
  var RESPOSTAS = [
    { id: 'a', situacao: 'A · Resumir três PDFs do meu curso sem sair deles.', ia: 'Gemini Notebook', porque: 'Responde só com base nos documentos que você envia.' },
    { id: 'b', situacao: 'B · Saber uma regra que mudou esta semana, com fonte.', ia: 'Perplexity', porque: 'Mostra as fontes à vista. Abra e confira.' },
    { id: 'c', situacao: 'C · Organizar e-mails e agenda do meu Gmail.', ia: 'Gemini', porque: 'Combina bem com o Gmail e a agenda do Google. Veja se o recurso está liberado na sua conta.' },
    { id: 'd', situacao: 'D · Revisar um texto de 40 páginas.', ia: 'Claude', porque: 'Costuma lidar bem com textos longos. O plano gratuito tem limite de uso.' }
  ];
  function mostrarRespostas() {
    var certos = 0, respondidas = 0;
    $('#lista-respostas').innerHTML = RESPOSTAS.map(function (r) {
      var escolha = W.store.get('m7.jogo.' + r.id, '') || '';
      var marca = '';
      if (escolha) {
        respondidas++;
        if (escolha === r.ia) { certos++; marca = '<span><strong>Você escolheu ' + W.escapar(escolha) + ': combina com a tendência.</strong></span>'; }
        else marca = '<span>Você escolheu ' + W.escapar(escolha) + '. Também pode servir: o importante é saber por quê.</span>';
      } else marca = '<span class="wc-legenda">Você não escolheu uma IA para esta situação.</span>';
      return '<li><b>' + W.escapar(r.situacao) + '</b><span><strong>' + W.escapar(r.ia) + '.</strong> ' + W.escapar(r.porque) + '</span>' + marca + '</li>';
    }).join('');
    $('#placar').textContent = respondidas
      ? 'Suas escolhas combinaram com a tendência em ' + certos + ' de ' + respondidas + ' situações. Sem nota: o que vale é a conversa na mesa.'
      : 'Escolha uma IA em cada situação e veja de novo, ou leia as respostas acima.';
    $('#respostas').hidden = false;
  }
  $('#btn-respostas').addEventListener('click', function () {
    W.store.set('m7.jogo.revelado', true);
    mostrarRespostas();
    $('#respostas').scrollIntoView({ block: 'start' });
  });
  ['a', 'b', 'c', 'd'].forEach(function (k) {
    $('#j-' + k).addEventListener('change', function () { if (!$('#respostas').hidden) mostrarRespostas(); });
  });
  if (W.store.get('m7.jogo.revelado', false)) mostrarRespostas();

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
