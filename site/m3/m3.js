/* Módulo 3: os 4 C e o cartão de contexto. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  W.salvarCampos(document);

  /* O pedido completo do slide 4 */
  W.pedido($('#pedido-exemplo'), {
    rotulo: 'O pedido completo, para você testar',
    template: 'Sou professora aposentada e vou fazer 60 anos. Escreva um convite para um almoço em família. Tom carinhoso, até 5 linhas, com data e local no fim. Depois, diga o que você supôs que eu não contei.',
    rodape: 'Se quiser, copie e cole no ChatGPT para ver a resposta.'
  });

  /* Mão na massa 1: o pedido de cada um, montado a partir dos 4 C */
  W.pedido($('#pedido-meu'), {
    chave: 'm3.p1',
    rotulo: 'O seu pedido, juntando os 4 C',
    template: '{{contexto}}. {{comando}}. {{criterios}}. {{conferencia}}.',
    campos: {
      contexto: { tipo: 'longo', rotulo: '1. Contexto', dica: 'Quem sou eu e qual é a situação.', marcador: '[Contexto: quem sou eu e qual é a situação]', exemplo: 'Sou professora aposentada e vou fazer 60 anos' },
      comando: { tipo: 'longo', rotulo: '2. Comando', dica: 'O que quero que ela faça.', marcador: '[Comando: o que você quer que ela faça]', exemplo: 'Escreva um convite para um almoço em família' },
      criterios: { tipo: 'longo', rotulo: '3. Critérios', dica: 'Como deve ser: tamanho, tom, o que evitar.', marcador: '[Critérios: tamanho, tom, o que evitar]', exemplo: 'Tom carinhoso, até 5 linhas, com data e local no fim' },
      conferencia: { tipo: 'longo', rotulo: '4. Conferência', dica: 'Peço que ela revise ou diga o que supôs. Eu confiro.', marcador: '[Conferência: peça que ela diga o que supôs]', exemplo: 'Depois, diga o que você supôs que eu não contei' }
    },
    rodape: 'Os quatro C viram um único pedido. Você não precisa usar os quatro sempre, mas, quanto mais importante o pedido, mais C.'
  });

  /* Mão na massa 2: o pedido que faz a IA perguntar */
  W.pedido($('#pedido-cartao'), {
    rotulo: 'Copie este pedido e cole no ChatGPT',
    template: 'Quero montar um cartão de contexto sobre mim, para usar em pedidos futuros. Faça uma pergunta de cada vez sobre: quem eu sou, o que faço, para quem escrevo, como gosto de falar e o que quero evitar. No fim, resuma tudo em um cartão de até 8 linhas.',
    rodape: 'Responda uma pergunta de cada vez, em frases curtas. Prefere não contar algo? Pule a pergunta.'
  });

  /* O cartão da pessoa (5 campos), compartilhado com os outros módulos */
  var teste;
  W.cartaoEditor($('#editor-cartao'), { aoMudar: function () { if (teste) teste.atualizar(); } });

  /* Teste do cartão */
  var testeBox = $('#pedido-teste');
  function montarTeste() {
    return W.pedido(testeBox, {
      rotulo: 'Pedido de teste, em uma conversa nova',
      template: '{{cartao}} Com base nesse cartão, escreva uma mensagem de apresentação minha para uma pessoa que acabei de conhecer.',
      campos: { cartao: { tipo: 'cartao', marcador: '[cole o seu cartão aqui]' } }
    });
  }
  teste = { atualizar: montarTeste };
  montarTeste();

  /* Cartão pronto */
  var itens = document.querySelectorAll('[data-pronto]');
  var msg = $('#msg-pronto');
  function pronto() {
    var todos = true;
    itens.forEach(function (i) { if (!i.checked) todos = false; });
    msg.hidden = !todos;
  }
  itens.forEach(function (i) { i.addEventListener('change', pronto); });
  pronto();

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
