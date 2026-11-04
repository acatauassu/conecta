/* Connect Pack: monta a página a partir de connect-pack-data.js.
   Depende de ../assets/js/conecta.js (window.WinConecta). */
(function () {
  'use strict';
  var W = window.WinConecta;
  var MODELOS = window.CONNECT_PACK || [];
  var CARTAO_EXEMPLO = window.CONNECT_PACK_CARTAO_EXEMPLO || {};
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };

  var vistaIndice = $('#vista-indice');
  var vistaModelo = $('#vista-modelo');
  var detalhe = $('#detalhe');
  var estado = { modelo: null, valores: {}, exemplo: false };

  /* ---------- Pedido: junta o texto, os campos e o cartão ---------- */
  function cartaoAtual() {
    if (estado.exemplo && !W.cartaoTexto()) return W.cartaoTexto(CARTAO_EXEMPLO);
    return W.cartaoTexto();
  }

  function montarPedido(modelo) {
    var partes = [];
    var faltam = 0;
    var pedaços = modelo.pedido.split(/(\{\{\w+\}\})/);
    for (var i = 0; i < pedaços.length; i++) {
      var p = pedaços[i];
      var m = /^\{\{(\w+)\}\}$/.exec(p);
      if (!m) { if (p) partes.push({ slot: false, t: p }); continue; }
      var campo = modelo.campos[m[1]] || { marcador: '[' + m[1] + ']', tipo: 'curto' };
      var valor = campo.tipo === 'cartao' ? cartaoAtual() : (estado.valores[m[1]] || '').trim();
      if (!valor) { partes.push({ slot: true, t: campo.marcador }); faltam++; continue; }
      partes.push({ slot: false, t: valor });
      // evita ".." quando o valor já termina em ponto e o modelo põe outro ponto em seguida
      var prox = pedaços[i + 1];
      if (valor.slice(-1) === '.' && prox && prox.charAt(0) === '.') pedaços[i + 1] = prox.slice(1);
    }
    return { partes: partes, faltam: faltam, texto: partes.map(function (x) { return x.t; }).join('') };
  }

  function pintarPedido(modelo) {
    var r = montarPedido(modelo);
    $('#pedido-texto').innerHTML = r.partes.map(function (x) {
      return x.slot ? '<b class="wc-slot">' + W.escapar(x.t) + '</b>' : W.escapar(x.t);
    }).join('');
    var aviso = $('#pedido-aviso');
    if (r.faltam === 0) aviso.textContent = 'Todos os campos estão preenchidos. Confira o texto e copie.';
    else if (r.faltam === 1) aviso.textContent = 'Falta 1 campo, em azul. Você pode copiar assim mesmo e completar no ChatGPT.';
    else aviso.textContent = 'Faltam ' + r.faltam + ' campos, em azul. Você pode copiar assim mesmo e completar no ChatGPT.';
    pintarCartaoNoModelo();
    return r;
  }

  function pintarCartaoNoModelo() {
    var caixa = $('#cartao-no-modelo');
    if (!caixa) return;
    var texto = W.cartaoTexto();
    var temExemplo = estado.exemplo && !texto;
    if (texto || temExemplo) {
      caixa.innerHTML = '<p class="wc-legenda" style="margin:0">' + (temExemplo ? 'Cartão de exemplo (personagem fictícia)' : 'Seu cartão de contexto') + '</p>' +
        '<p style="margin:0">' + W.escapar(cartaoAtual()) + '</p>' +
        (temExemplo ? '' : '<button type="button" class="wc-link-botao" data-abrir-cartao>Editar meu cartão</button>');
    } else {
      caixa.innerHTML = '<p style="margin:0"><strong>Você ainda não montou o seu cartão de contexto.</strong> Ele ajuda a IA a conhecer você. Sem ele, o pedido sai com o espaço em azul para colar o cartão.</p>' +
        '<button type="button" class="wc-btn wc-btn--secundario wc-btn--leve" data-abrir-cartao>Montar meu cartão</button>';
    }
  }

  /* ---------- Vista: lista dos 8 modelos ---------- */
  function rotuloPlano(m) {
    return m.planoTipo === 'gratuito' ? 'Funciona no plano gratuito' : 'Melhor no plano pago';
  }
  function pintarIndice() {
    $('#grade').innerHTML = MODELOS.map(function (m) {
      return '<li><a class="wc-cartao" href="#modelo-' + m.id + '">' +
        '<span class="wc-cartao__num">Modelo ' + m.id + '</span>' +
        '<span class="wc-cartao__titulo">' + W.escapar(m.titulo) + '</span>' +
        '<span class="wc-cartao__txt">' + W.escapar(m.resultado) + '</span>' +
        '<span class="wc-plano' + (m.planoTipo === 'pago' ? ' wc-plano--pago' : '') + '">' + rotuloPlano(m) + '</span>' +
        '</a></li>';
    }).join('');
  }

  /* ---------- Vista: um modelo ---------- */
  function htmlCampo(modelo, id) {
    var c = modelo.campos[id];
    var fid = 'f-' + id;
    var dica = c.dica ? '<small id="' + fid + '-dica">' + W.escapar(c.dica) + '</small>' : '';
    var desc = c.dica ? ' aria-describedby="' + fid + '-dica"' : '';
    var controle;
    if (c.tipo === 'longo') {
      controle = '<textarea id="' + fid + '" data-campo="' + id + '"' + desc + '></textarea>';
    } else if (c.tipo === 'escolha') {
      controle = '<select id="' + fid + '" data-campo="' + id + '"' + desc + '><option value="">Escolha uma opção</option>' +
        c.opcoes.map(function (o) { return '<option>' + W.escapar(o) + '</option>'; }).join('') + '</select>';
    } else {
      controle = '<input id="' + fid + '" type="text" data-campo="' + id + '"' + desc + ' autocomplete="off">';
    }
    var larga = (c.tipo === 'longo') ? ' wc-campo--larga' : '';
    return '<div class="wc-campo' + larga + '"><label for="' + fid + '">' + W.escapar(c.rotulo) + '</label>' + dica + controle + '</div>';
  }

  function listaHtml(itens) {
    return '<ul>' + itens.map(function (i) { return '<li>' + W.escapar(i) + '</li>'; }).join('') + '</ul>';
  }

  function abrirModelo(id) {
    var modelo = MODELOS.filter(function (m) { return m.id === id; })[0];
    if (!modelo) { irParaIndice(); return; }
    estado.modelo = modelo;
    estado.exemplo = false;
    estado.valores = W.store.get('pack.m' + id, {}) || {};
    Object.keys(modelo.campos).forEach(function (k) {
      var c = modelo.campos[k];
      if (c.padrao && estado.valores[k] === undefined) estado.valores[k] = c.padrao;
    });

    var ids = Object.keys(modelo.campos).filter(function (k) { return modelo.campos[k].tipo !== 'cartao'; });
    var temCartao = Object.keys(modelo.campos).some(function (k) { return modelo.campos[k].tipo === 'cartao'; });
    var anterior = MODELOS.filter(function (m) { return m.id === id - 1; })[0];
    var proximo = MODELOS.filter(function (m) { return m.id === id + 1; })[0];
    var feitos = W.store.get('pack.c' + id, {}) || {};

    detalhe.innerHTML =
      '<p><a href="#modelos" class="wc-link-botao" style="font-weight:700">← Todos os modelos</a></p>' +
      '<div style="display:grid;gap:12px">' +
        '<span class="wc-cartao__num">Modelo ' + modelo.id + ' de ' + MODELOS.length + '</span>' +
        '<h2 class="wc-titulo" id="titulo-modelo" tabindex="-1">' + W.escapar(modelo.titulo) + '</h2>' +
        '<p class="wc-plano' + (modelo.planoTipo === 'pago' ? ' wc-plano--pago' : '') + '" style="margin:24px 0 0">' + W.escapar(modelo.plano) + '</p>' +
        (modelo.testadoEm ? '<p class="wc-legenda" style="margin:0">Último teste da equipe: ' + W.escapar(modelo.testadoEm) + '</p>' : '') +
      '</div>' +
      '<div class="wc-duas">' +
        '<div class="wc-bloco"><h3>Para que serve</h3><p>' + W.escapar(modelo.paraQue) + '</p></div>' +
        '<div class="wc-bloco"><h3>O resultado que você terá</h3><p>' + W.escapar(modelo.resultado) + '</p></div>' +
        '<div class="wc-bloco"><h3>Quando usar</h3>' + listaHtml(modelo.quando) + '</div>' +
        '<div class="wc-bloco"><h3>Se não funcionar</h3><p>' + W.escapar(modelo.seNaoFuncionar) + '</p></div>' +
      '</div>' +
      '<section class="wc-painel" aria-labelledby="monte">' +
        '<h3 class="wc-painel__titulo" id="monte">Monte o seu pedido</h3>' +
        '<p class="wc-leitura" style="margin:0">Preencha os campos. O pedido abaixo se atualiza sozinho. O que você escreve fica só neste aparelho.</p>' +
        (temCartao ? '<div class="wc-bloco" id="cartao-no-modelo" style="background:var(--painel-suave)"></div>' : '') +
        '<div class="wc-campos wc-campos--2">' + ids.map(function (id2) { return htmlCampo(modelo, id2); }).join('') + '</div>' +
        '<div class="wc-pedido__acoes">' +
          '<button type="button" class="wc-btn wc-btn--secundario wc-btn--leve" id="btn-exemplo">Ver um exemplo preenchido</button>' +
          '<button type="button" class="wc-link-botao" id="btn-limpar">Limpar os campos</button>' +
        '</div>' +
      '</section>' +
      '<section class="wc-pedido" aria-labelledby="rot-pedido">' +
        '<p class="wc-pedido__rotulo" id="rot-pedido">Pedido pronto · modelo ' + modelo.id + '</p>' +
        '<p class="wc-pedido__texto" id="pedido-texto"></p>' +
        '<p class="wc-aviso-vivo" id="pedido-aviso" aria-live="polite"></p>' +
        '<div class="wc-pedido__acoes">' +
          '<button type="button" class="wc-btn" id="btn-copiar">Copiar pedido</button>' +
          '<a class="wc-btn wc-btn--secundario" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir o ChatGPT</a>' +
        '</div>' +
        '<p class="wc-legenda" style="margin:0">O pedido é um bom ponto de partida e não garante o resultado. A IA pode responder de forma diferente a cada vez.</p>' +
      '</section>' +
      '<section class="wc-painel" aria-labelledby="conf">' +
        '<h3 class="wc-painel__titulo" id="conf">Confira antes de usar</h3>' +
        '<ul class="wc-lista">' + modelo.conferir.map(function (q, i) {
          return '<li><label class="wc-item"><input type="checkbox" data-conf="' + i + '"' + (feitos[i] ? ' checked' : '') + '><div><b>' + W.escapar(q) + '</b></div></label></li>';
        }).join('') + '</ul>' +
        '<p class="wc-legenda" style="margin:0">Quem confere e decide é você. Leia, confira, decida.</p>' +
      '</section>' +
      '<nav class="wc-navegacao" aria-label="Outros modelos">' +
        (anterior ? '<a class="wc-btn wc-btn--secundario wc-btn--leve" href="#modelo-' + anterior.id + '">← Modelo ' + anterior.id + '</a>' : '<span></span>') +
        (proximo ? '<a class="wc-btn wc-btn--secundario wc-btn--leve" href="#modelo-' + proximo.id + '">Modelo ' + proximo.id + ' →</a>' : '<span></span>') +
      '</nav>';

    // preenche os campos com o que já foi salvo
    ids.forEach(function (k) {
      var el = $('#f-' + k, detalhe);
      if (el && estado.valores[k] !== undefined) el.value = estado.valores[k];
    });
    pintarPedido(modelo);
    ligarModelo(modelo, ids);
    vistaIndice.hidden = true;
    vistaModelo.hidden = false;
    mostrarAbertura(false);
    var t = $('#titulo-modelo');
    if (t) { t.focus({ preventScroll: true }); }
    window.scrollTo(0, Math.max(0, vistaModelo.getBoundingClientRect().top + window.scrollY - 16));
  }

  function ligarModelo(modelo, ids) {
    detalhe.querySelectorAll('[data-campo]').forEach(function (el) {
      var evento = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evento, function () {
        estado.valores[el.getAttribute('data-campo')] = el.value;
        W.store.set('pack.m' + modelo.id, estado.valores);
        pintarPedido(modelo);
      });
    });
    detalhe.querySelectorAll('[data-conf]').forEach(function (el) {
      el.addEventListener('change', function () {
        var feitos = W.store.get('pack.c' + modelo.id, {}) || {};
        feitos[el.getAttribute('data-conf')] = el.checked;
        W.store.set('pack.c' + modelo.id, feitos);
      });
    });
    $('#btn-copiar').addEventListener('click', function () {
      var r = montarPedido(modelo);
      W.copiar(r.texto, $('#pedido-texto'));
    });
    $('#btn-exemplo').addEventListener('click', function () {
      estado.exemplo = true;
      ids.forEach(function (k) {
        var c = modelo.campos[k];
        if (c.exemplo !== undefined) { estado.valores[k] = c.exemplo; var el = $('#f-' + k, detalhe); if (el) el.value = c.exemplo; }
      });
      pintarPedido(modelo);
      W.toast('Exemplo com dados fictícios. Troque pelos seus.');
    });
    $('#btn-limpar').addEventListener('click', function () {
      estado.exemplo = false;
      estado.valores = {};
      Object.keys(modelo.campos).forEach(function (k) { if (modelo.campos[k].padrao) estado.valores[k] = modelo.campos[k].padrao; });
      W.store.set('pack.m' + modelo.id, estado.valores);
      ids.forEach(function (k) { var el = $('#f-' + k, detalhe); if (el) el.value = estado.valores[k] || ''; });
      pintarPedido(modelo);
      W.toast('Campos limpos.');
    });
  }

  /* A abertura grande (logo, título) só aparece na lista; dentro de um modelo, o topo mostra o logo pequeno */
  function mostrarAbertura(sim) {
    $('#abertura').hidden = !sim;
    $('#logo-topo').hidden = sim;
    $('#nome-topo').hidden = !sim;
  }

  function irParaIndice() {
    estado.modelo = null;
    vistaModelo.hidden = true;
    vistaIndice.hidden = false;
    mostrarAbertura(true);
    if (window.location.hash === '#modelos') {
      var alvo = $('#modelos');
      if (alvo) alvo.scrollIntoView({ block: 'start' });
    }
  }

  /* ---------- Meu cartão de contexto ---------- */
  var cartaoCampos = $('#cartao-campos');
  function montarCartao() {
    var salvo = W.getCartao();
    cartaoCampos.innerHTML = W.CAMPOS_CARTAO.map(function (c) {
      return '<div class="wc-campo"><label for="c-' + c.id + '">' + W.escapar(c.rotulo) + '</label>' +
        '<small id="c-' + c.id + '-d">' + W.escapar(c.dica) + '</small>' +
        '<input id="c-' + c.id + '" type="text" aria-describedby="c-' + c.id + '-d" autocomplete="off" value="' + W.escapar(salvo[c.id]) + '"></div>';
    }).join('');
    cartaoCampos.querySelectorAll('input').forEach(function (el) {
      el.addEventListener('input', function () {
        var obj = W.getCartao();
        obj[el.id.slice(2)] = el.value;
        W.setCartao(obj);
        pintarCartaoPreview();
        if (estado.modelo) pintarPedido(estado.modelo);
      });
    });
    pintarCartaoPreview();
  }
  function pintarCartaoPreview() {
    var t = W.cartaoTexto();
    $('#cartao-preview').textContent = t || 'Seu cartão aparece aqui conforme você escreve.';
  }
  function abrirCartao() {
    var det = $('#cartao');
    det.open = true;
    det.scrollIntoView({ block: 'start' });
    var primeiro = $('#c-quem');
    if (primeiro) primeiro.focus({ preventScroll: true });
  }

  /* ---------- Roteamento por hash ---------- */
  function rotear() {
    var m = /^#modelo-(\d+)$/.exec(window.location.hash);
    if (m) { abrirModelo(parseInt(m[1], 10)); return; }
    irParaIndice();
    if (window.location.hash === '#cartao') abrirCartao();
  }

  /* ---------- Início ---------- */
  if (!MODELOS.length) return;
  pintarIndice();
  montarCartao();
  if (!W.cartaoTexto() && !/^#modelo-/.test(window.location.hash)) $('#cartao').open = true;

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-abrir-cartao]') : null;
    if (b) { e.preventDefault(); abrirCartao(); }
  });
  $('#btn-cartao-exemplo').addEventListener('click', function () {
    W.setCartao(CARTAO_EXEMPLO);
    montarCartao();
    if (estado.modelo) pintarPedido(estado.modelo);
    W.toast('Cartão de exemplo preenchido. Troque pelos seus dados.');
  });
  $('#btn-cartao-copiar').addEventListener('click', function () {
    var t = W.cartaoTexto();
    if (!t) { W.toast('Escreva alguma coisa no cartão antes de copiar.'); return; }
    W.copiar(t, $('#cartao-preview'), 'Cartão copiado. Cole nas notas do celular.');
  });
  $('#btn-cartao-apagar').addEventListener('click', function () {
    W.store.remove('cartao');
    montarCartao();
    if (estado.modelo) pintarPedido(estado.modelo);
    W.toast('Cartão apagado.');
  });
  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    montarCartao();
    if (estado.modelo) abrirModelo(estado.modelo.id);
    W.toast('Tudo que você escreveu aqui foi apagado deste aparelho.');
  });

  window.addEventListener('hashchange', rotear);
  rotear();
})();
