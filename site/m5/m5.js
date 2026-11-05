/* Módulo 5: conferir. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  W.salvarCampos(document);

  var TEXTO_APOIO = 'Prezado cliente, segue o orçamento que você pediu. O valor é de R$ 450, com validade de 15 dias. Se tiver qualquer dúvida, é só falar. Atenciosamente, Marta.';

  /* O pedido que lista o que conferir */
  var regua = W.pedido($('#pedido-regua'), {
    chave: 'm5.p',
    rotulo: 'Pedido para a IA ajudar na conferência',
    template: 'Liste o que eu preciso verificar neste texto: nomes, números, fatos, promessas e frases que não parecem o meu jeito. Não corrija nada. Texto: {{texto}}',
    campos: {
      texto: { tipo: 'longo', rotulo: 'O texto que você reescreveu no Módulo 4', dica: 'Cole aqui a versão final. Sem dados de outras pessoas: troque por [nome] ou XXX.', marcador: '[colar o texto]' }
    },
    rodape: 'A IA só lista o que conferir. Ela não corrige: quem confere é você.'
  });

  /* Plano B: quem não tem o texto do módulo anterior */
  $('#btn-apoio').addEventListener('click', function () {
    regua.definir('texto', TEXTO_APOIO);
    W.toast('Texto de apoio no seu pedido. Com ele, treine a conferência.');
  });

  /* Frases para copiar */
  document.querySelectorAll('[data-frase]').forEach(function (b) {
    b.addEventListener('click', function () {
      W.copiar(b.getAttribute('data-frase'), null, 'Copiado. Cole na conversa do ChatGPT.');
    });
  });

  /* Progresso da régua */
  var itens = document.querySelectorAll('[data-regua]');
  function progresso() {
    var n = 0;
    itens.forEach(function (i) { if (i.checked) n++; });
    $('#regua-barra').style.width = (n / itens.length * 100) + '%';
    $('#regua-texto').textContent = n === itens.length
      ? 'Régua passada! 5 de 5 conferências feitas. Agora você pode usar o texto.'
      : n + ' de ' + itens.length + ' conferências feitas.';
  }
  itens.forEach(function (i) { i.addEventListener('change', progresso); });
  progresso();

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
