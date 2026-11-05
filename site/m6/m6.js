/* Módulo 6: Tarefa 2, preparar a reunião. Depende de conecta.js e pedido.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var $ = function (s) { return document.querySelector(s); };

  W.salvarCampos(document);

  /* Passo 2: o pedido da pesquisa, com dois modos (pessoa ou só a empresa) */
  var FINAL = ' Pesquise só informações profissionais públicas e cite a fonte de cada uma.';
  var MODOS = {
    pessoa: {
      chave: 'm6.p1',
      rotulo: 'Pedido 1 · a pesquisa',
      template: 'Vou ter uma reunião com {{nome}}, {{cargo}}, de {{cidade}}. O objetivo é {{objetivo}}.' + FINAL + ' Se houver mais de uma pessoa com esse nome, pergunte antes. Entregue: resumo em 5 linhas; 8 perguntas que ela pode me fazer; dúvidas prováveis com sugestão de resposta; o que posso propor. Separe fato com fonte de suposição.',
      campos: {
        nome: { tipo: 'curto', rotulo: 'Nome da pessoa', dica: 'Só informações profissionais e públicas.', marcador: '[nome]', exemplo: 'Carlos Mendes' },
        cargo: { tipo: 'curto', rotulo: 'Cargo e empresa', marcador: '[cargo e empresa]', exemplo: 'diretor comercial da Rede Boa Mesa' },
        cidade: { tipo: 'curto', rotulo: 'Cidade', marcador: '[cidade]', exemplo: 'Belém' },
        objetivo: { tipo: 'curto', rotulo: 'Objetivo da reunião', dica: 'Por exemplo: apresentar uma proposta, uma entrevista, uma parceria.', marcador: '[objetivo]', exemplo: 'apresentar uma proposta de serviço' }
      }
    },
    empresa: {
      chave: 'm6.p1e',
      rotulo: 'Pedido 1 · a pesquisa, só da empresa',
      template: 'Vou ter uma reunião com a empresa {{empresa}}, de {{cidade}}. O objetivo é {{objetivo}}.' + FINAL + ' Entregue: resumo em 5 linhas; 8 perguntas que eles podem me fazer; dúvidas prováveis com sugestão de resposta; o que posso propor. Separe fato com fonte de suposição.',
      campos: {
        empresa: { tipo: 'curto', rotulo: 'Nome da empresa', dica: 'Pesquisar só a empresa já ajuda muito.', marcador: '[nome da empresa]', exemplo: 'Rede Boa Mesa' },
        cidade: { tipo: 'curto', rotulo: 'Cidade', marcador: '[cidade]', exemplo: 'Belém' },
        objetivo: { tipo: 'curto', rotulo: 'Objetivo da reunião', dica: 'Por exemplo: apresentar uma proposta, uma entrevista, uma parceria.', marcador: '[objetivo]', exemplo: 'apresentar uma proposta de serviço' }
      }
    }
  };
  var modoAtual = W.store.get('m6.modo', 'pessoa') === 'empresa' ? 'empresa' : 'pessoa';
  function pintarPesquisa() {
    var def = MODOS[modoAtual];
    def.rodape = 'Cole em uma conversa nova do ChatGPT. Para treinar antes, use uma empresa pública e conhecida da sua cidade.';
    W.pedido($('#pedido-pesquisa'), def);
  }
  pintarPesquisa();
  document.querySelectorAll('input[name="modo"]').forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) { modoAtual = r.value; pintarPesquisa(); } });
  });

  /* Passo 4: a abertura de 2 minutos */
  W.pedido($('#pedido-abertura'), {
    rotulo: 'Pedido 2 · a abertura',
    template: 'Com as informações que conferi, escreva um roteiro de abertura de 2 minutos, no meu jeito, para eu falar no começo da reunião. Inclua 3 perguntas para a outra pessoa. Meu cartão: {{cartao}}.',
    campos: { cartao: { tipo: 'cartao', marcador: '[cartão]' } },
    rodape: 'Use o pedido na mesma conversa da pesquisa, depois de conferir as informações.'
  });
  function avisoCartao() { $('#aviso-cartao').hidden = !!W.cartaoTexto(); }
  avisoCartao();
  window.addEventListener('focus', avisoCartao);

  /* Progresso: Régua dos 5 + duas fontes abertas */
  var itens = document.querySelectorAll('[data-regua], [data-fonte]');
  function progresso() {
    var n = 0;
    itens.forEach(function (i) { if (i.checked) n++; });
    $('#regua-barra').style.width = (n / itens.length * 100) + '%';
    $('#regua-texto').textContent = n === itens.length
      ? 'Tudo conferido! 7 de 7. Você pode usar estas informações.'
      : n + ' de ' + itens.length + ' conferências feitas.';
  }
  itens.forEach(function (i) { i.addEventListener('change', progresso); });
  progresso();

  /* Ensaio: cronômetro de 2 minutos, com as 4 partes da abertura */
  var PARTES = [
    { nome: '1. Cumprimento', seg: 20 },
    { nome: '2. Mostre que se preparou', seg: 40 },
    { nome: '3. Diga o objetivo', seg: 30 },
    { nome: '4. Pergunta aberta', seg: 30 }
  ];
  var TOTAL = 120;
  var restante = TOTAL, fim = 0, tick = null, rodando = false, ultimaParte = -1;
  var relogio = $('#ensaio-relogio'), fase = $('#ensaio-fase'), barra = $('#ensaio-barra'), botao = $('#ensaio-iniciar');
  function fmt(seg) { var s = Math.max(0, Math.ceil(seg)); return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2); }
  function parteDe(decorrido) {
    var acum = 0;
    for (var i = 0; i < PARTES.length; i++) { acum += PARTES[i].seg; if (decorrido < acum) return i; }
    return PARTES.length - 1;
  }
  function mostrar(seg) {
    relogio.textContent = fmt(seg);
    var dec = TOTAL - seg;
    barra.style.width = Math.min(100, dec / TOTAL * 100) + '%';
    if (rodando) {
      var i = parteDe(dec);
      if (i !== ultimaParte) { fase.textContent = 'Agora: ' + PARTES[i].nome; ultimaParte = i; }
    }
  }
  function parar() { clearInterval(tick); tick = null; rodando = false; }
  function atualizar() {
    var seg = (fim - Date.now()) / 1000;
    if (seg <= 0) {
      parar(); restante = 0; mostrar(0);
      fase.textContent = 'Terminou! Como foi?';
      botao.textContent = 'Começar de novo';
      W.toast('Dois minutos. Boa abertura!');
      return;
    }
    restante = seg; mostrar(seg);
  }
  botao.addEventListener('click', function () {
    if (rodando) { parar(); botao.textContent = 'Continuar'; fase.textContent = 'Em pausa'; return; }
    if (restante <= 0) restante = TOTAL;
    fim = Date.now() + restante * 1000; rodando = true; ultimaParte = -1; botao.textContent = 'Pausar';
    tick = setInterval(atualizar, 250); atualizar();
  });
  $('#ensaio-zerar').addEventListener('click', function () {
    parar(); restante = TOTAL; ultimaParte = -1; mostrar(TOTAL); botao.textContent = 'Começar'; fase.textContent = 'Pronto para começar';
  });

  /* Registro: o pedido que funcionou */
  var MODELO = 'Vou ter uma reunião com [nome], [cargo e empresa], de [cidade]. O objetivo é [objetivo]. Pesquise só informações profissionais públicas e cite a fonte de cada uma. Se houver mais de uma pessoa com esse nome, pergunte antes. Entregue: resumo em 5 linhas; 8 perguntas que ela pode me fazer; dúvidas prováveis com sugestão de resposta; o que posso propor. Separe fato com fonte de suposição.';
  var campo = $('#r-funcionou');
  $('#btn-modelo').addEventListener('click', function () {
    if (campo.value.trim()) { W.toast('O seu pedido já tem texto. Apague o que está escrito se quiser começar pelo modelo.'); return; }
    campo.value = MODELO; W.store.set('m6.funcionou', campo.value);
    W.toast('Modelo no lugar. Adapte com o que funcionou para você.');
  });
  $('#btn-copiar-funcionou').addEventListener('click', function () {
    if (!campo.value.trim()) { W.toast('Escreva o seu pedido antes de copiar.'); return; }
    W.copiar(campo.value, campo, 'Pedido copiado. Guarde nas notas do celular.');
  });

  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
