/* Módulo 2: como a IA funciona. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  W.salvarCampos(document);

  /* Mão na massa 1: os dois pedidos */
  W.pedido($('#pedido-1'), {
    rotulo: 'Pedido 1',
    template: 'Sugira um presente.',
    rodape: 'Um pedido curto, sem nenhum detalhe. Copie, cole no ChatGPT e leia a resposta.'
  });

  W.pedido($('#pedido-2'), {
    chave: 'm2.p2',
    rotulo: 'Pedido 2',
    template: 'Sugira 3 presentes para {{pessoa}}, {{interesse}}. Posso gastar até {{valor}}. Explique em uma frase por que cada um combina.',
    camposRecolhidos: 'Quer trocar a pessoa, o interesse ou o valor? Pode.',
    campos: {
      pessoa: { tipo: 'curto', rotulo: 'Para quem é o presente', marcador: '[para quem]', padrao: 'a minha neta de 12 anos' },
      interesse: { tipo: 'curto', rotulo: 'O que a pessoa gosta', marcador: '[o que a pessoa gosta]', padrao: 'que gosta de desenhar' },
      valor: { tipo: 'curto', rotulo: 'Quanto posso gastar', marcador: '[valor]', padrao: 'R$ 150' }
    },
    rodape: 'Cole este pedido na mesma conversa, depois do pedido 1. Os dois pedem um presente: o segundo conta quem é a pessoa, o que ela gosta e quanto você pode gastar.'
  });

  /* Mão na massa 2: perguntar sobre algo que a pessoa domina */
  W.pedido($('#pedido-3'), {
    chave: 'm2.p3',
    rotulo: 'Pedido sobre algo que você conhece bem',
    template: 'Fale sobre {{assunto}}.',
    campos: {
      assunto: { tipo: 'curto', rotulo: 'Sobre o que você quer perguntar', dica: 'Escolha algo que você conhece muito bem.', marcador: '[algo que você conhece bem]' }
    },
    rodape: 'Leia a resposta com calma e procure o que está certo e o que está errado ou inventado.'
  });

  /* Resposta do cartão de descobertas */
  var msg = $('#msg-acertou');
  var textos = {
    tudo: 'Bom sinal para esse assunto. Mas o cuidado continua valendo para temas que você não domina: lá, você não teria como perceber um erro.',
    quase: 'Quase tudo certo é comum. O pedaço que escapa é justamente o que passa despercebido em um assunto que você não conhece. Por isso vale conferir.',
    errou: 'Isso é normal e é o que queremos mostrar: a IA escreve com firmeza mesmo quando erra. Anote o que estava errado e leve para a conversa da mesa.'
  };
  function pintarMsg() {
    var escolha = W.store.get('m2.acertou', '');
    if (textos[escolha]) { msg.textContent = textos[escolha]; msg.hidden = false; } else { msg.hidden = true; }
  }
  document.querySelectorAll('input[name="acertou"]').forEach(function (r) { r.addEventListener('change', pintarMsg); });
  pintarMsg();

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
