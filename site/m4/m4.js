/* Módulo 4: Tarefa 1, escrever com a minha voz. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  W.salvarCampos(document);

  var TEXTO_APOIO = 'Prezado cliente, segue o orçamento que você pediu. O valor é de R$ [valor], com validade de [dias] dias. Se tiver qualquer dúvida, é só falar. Atenciosamente, [nome].';
  var MODELO_VALIDADO = 'Meu cartão de contexto: [cole o cartão]. Este texto mostra o meu jeito de escrever: [cole um texto seu]. Agora reescreva este texto no meu jeito: [cole o texto que quer melhorar]. Critérios: [tom], até [número] linhas. No fim, diga o que você supôs que eu não contei.';

  /* Para comparar: o pedido fraco */
  W.pedido($('#pedido-fraco'), {
    rotulo: 'Pedido fraco',
    template: 'Escreva um e-mail para um cliente.'
  });

  /* O pedido da pessoa: cartão + texto de exemplo + texto a melhorar + critérios */
  var meu = W.pedido($('#pedido-meu'), {
    chave: 'm4.p',
    rotulo: 'O seu pedido, pronto para copiar',
    template: 'Meu cartão de contexto: {{cartao}}. Este texto mostra o meu jeito de escrever: {{jeito}}. Agora reescreva este texto no meu jeito: {{texto}}. Critérios: {{tom}}, até {{numero}} linhas. No fim, diga o que você supôs que eu não contei.',
    campos: {
      cartao: { tipo: 'cartao', marcador: '[cole o cartão]' },
      jeito: { tipo: 'longo', rotulo: 'Um texto seu de exemplo, de 5 a 10 linhas', dica: 'Um e-mail ou mensagem que você já escreveu e de que gostou. Ele mostra o seu jeito. Troque nomes e números de outras pessoas por [nome] ou XXX.', marcador: '[cole um texto seu]', exemplo: 'Oi, Dona Lúcia! Tudo bem por aí? Passando para lembrar da nossa consulta de quinta, às 15h. Se precisar remarcar, é só me avisar por aqui. Um abraço, Marta.' },
      texto: { tipo: 'longo', rotulo: 'O texto que quero melhorar', dica: 'O texto que você escolheu no começo. Se não tiver um, use o texto de apoio.', marcador: '[cole o texto que quer melhorar]', exemplo: 'Prezado cliente, segue o orçamento que você pediu. O valor é de R$ 450, com validade de 15 dias. Se tiver qualquer dúvida, é só falar. Atenciosamente, Marta.' },
      tom: { tipo: 'curto', rotulo: 'Tom', dica: 'Carinhoso, firme, formal, direto.', marcador: '[tom]', exemplo: 'Tom carinhoso' },
      numero: { tipo: 'curto', rotulo: 'Quantas linhas, no máximo', marcador: '[número]', exemplo: '6' }
    },
    rodape: 'Use o pedido em uma conversa nova do ChatGPT. O cartão vem do seu Módulo 3.'
  });

  /* Texto de apoio */
  $('#btn-apoio').addEventListener('click', function () {
    meu.definir('texto', TEXTO_APOIO);
    W.toast('Texto de apoio no seu pedido. Troque o que está entre colchetes.');
    $('#fazer').scrollIntoView({ block: 'start' });
  });

  /* Aviso se o cartão estiver vazio */
  function avisoCartao() { $('#aviso-cartao').hidden = !!W.cartaoTexto(); }
  avisoCartao();
  window.addEventListener('focus', avisoCartao);

  /* Frases de ajuste: toque para copiar */
  document.querySelectorAll('[data-frase]').forEach(function (b) {
    b.addEventListener('click', function () {
      W.copiar(b.getAttribute('data-frase'), null, 'Copiado. Cole na mesma conversa do ChatGPT.');
    });
  });

  /* Meu prompt validado */
  var validado = $('#m-validado');
  $('#btn-modelo').addEventListener('click', function () {
    if (validado.value.trim()) {
      W.toast('O seu prompt já tem texto. Apague o que está escrito se quiser começar pelo modelo.');
      return;
    }
    validado.value = MODELO_VALIDADO;
    W.store.set('m4.validado', validado.value);
    W.toast('Modelo no lugar. Adapte com o que funcionou para você.');
  });
  $('#btn-copiar-validado').addEventListener('click', function () {
    if (!validado.value.trim()) { W.toast('Escreva o seu prompt antes de copiar.'); return; }
    W.copiar(validado.value, validado, 'Prompt copiado. Guarde nas notas do celular.');
  });

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
