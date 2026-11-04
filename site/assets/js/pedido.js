/* Componente "pedido pronto para copiar", usado nos módulos.
   Depende de conecta.js (window.WinConecta).

   WinConecta.pedido(elemento, {
     chave:   'm2.p2',                // onde salvar os campos (opcional se não houver campos)
     rotulo:  'Pedido 2',             // título pequeno da caixa
     template:'Sugira {{n}} presentes...',  // texto com {{campos}}; o resto é copiado exatamente
     campos: {                        // opcional
       n: { tipo: 'curto' | 'longo' | 'escolha' | 'cartao', rotulo, dica, marcador, padrao, opcoes }
     },
     camposRecolhidos: 'Quer trocar ...?'  // opcional: põe os campos dentro de um "abrir"
     rodape:  'texto pequeno abaixo dos botões' // opcional
     chatgpt: true                    // botão "Abrir o ChatGPT" (padrão: true)
   })
   Cada campo vazio aparece no pedido como o seu "marcador", em azul. */
(function () {
  'use strict';
  var W = window.WinConecta;
  var contador = 0;

  function montar(def, valores) {
    var partes = [], faltam = 0;
    var pedacos = def.template.split(/(\{\{\w+\}\})/);
    for (var i = 0; i < pedacos.length; i++) {
      var p = pedacos[i];
      var m = /^\{\{(\w+)\}\}$/.exec(p);
      if (!m) { if (p) partes.push({ slot: false, t: p }); continue; }
      var c = (def.campos && def.campos[m[1]]) || { marcador: '[' + m[1] + ']' };
      var v = c.tipo === 'cartao' ? W.cartaoTexto() : String(valores[m[1]] === undefined ? '' : valores[m[1]]).trim();
      if (!v) { partes.push({ slot: true, t: c.marcador || '[' + m[1] + ']' }); faltam++; continue; }
      partes.push({ slot: false, t: v });
      var prox = pedacos[i + 1];
      if (v.slice(-1) === '.' && prox && prox.charAt(0) === '.') pedacos[i + 1] = prox.slice(1);
    }
    return { partes: partes, faltam: faltam, texto: partes.map(function (x) { return x.t; }).join('') };
  }

  function htmlCampo(id, c, uid) {
    var fid = uid + '-' + id;
    var dica = c.dica ? '<small id="' + fid + '-d">' + W.escapar(c.dica) + '</small>' : '';
    var desc = c.dica ? ' aria-describedby="' + fid + '-d"' : '';
    var ctl;
    if (c.tipo === 'longo') ctl = '<textarea id="' + fid + '" data-c="' + id + '"' + desc + '></textarea>';
    else if (c.tipo === 'escolha') ctl = '<select id="' + fid + '" data-c="' + id + '"' + desc + '><option value="">Escolha uma opção</option>' +
      c.opcoes.map(function (o) { return '<option>' + W.escapar(o) + '</option>'; }).join('') + '</select>';
    else ctl = '<input id="' + fid + '" type="text" data-c="' + id + '"' + desc + ' autocomplete="off">';
    return '<div class="wc-campo' + (c.tipo === 'longo' ? ' wc-campo--larga' : '') + '"><label for="' + fid + '">' + W.escapar(c.rotulo) + '</label>' + dica + ctl + '</div>';
  }

  function pedido(raiz, def) {
    var uid = 'ped' + (++contador);
    var ids = Object.keys(def.campos || {}).filter(function (k) { return def.campos[k].tipo !== 'cartao'; });
    var valores = {};
    ids.forEach(function (k) { if (def.campos[k].padrao !== undefined) valores[k] = def.campos[k].padrao; });
    if (def.chave && ids.length) {
      var salvo = W.store.get(def.chave, null);
      if (salvo) ids.forEach(function (k) { if (salvo[k] !== undefined) valores[k] = salvo[k]; });
    }

    var camposHtml = ids.length
      ? '<div class="wc-campos wc-campos--2">' + ids.map(function (k) { return htmlCampo(k, def.campos[k], uid); }).join('') + '</div>' +
        '<p style="margin:0"><button type="button" class="wc-link-botao" data-restaurar>Voltar ao pedido original</button></p>'
      : '';
    var blocoCampos = !ids.length ? '' : (def.camposRecolhidos
      ? '<details class="wc-painel" style="gap:0"><summary class="wc-painel__titulo" style="cursor:pointer;font-size:20px">' + W.escapar(def.camposRecolhidos) + '</summary><div style="display:grid;gap:16px;margin-top:16px">' + camposHtml + '</div></details>'
      : '<div class="wc-painel">' + camposHtml + '</div>');

    raiz.innerHTML = blocoCampos +
      '<section class="wc-pedido" aria-labelledby="' + uid + '-r">' +
        '<p class="wc-pedido__rotulo" id="' + uid + '-r">' + W.escapar(def.rotulo || 'Pedido') + '</p>' +
        '<p class="wc-pedido__texto" id="' + uid + '-t"></p>' +
        '<p class="wc-aviso-vivo" id="' + uid + '-a" aria-live="polite"></p>' +
        '<div class="wc-pedido__acoes">' +
          '<button type="button" class="wc-btn" data-copiar>Copiar pedido</button>' +
          (def.chatgpt === false ? '' : '<a class="wc-btn wc-btn--secundario" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir o ChatGPT</a>') +
        '</div>' +
        (def.rodape ? '<p class="wc-legenda" style="margin:0">' + W.escapar(def.rodape) + '</p>' : '') +
      '</section>';

    var alvoTexto = raiz.querySelector('#' + uid + '-t');
    var alvoAviso = raiz.querySelector('#' + uid + '-a');
    function pintar() {
      var r = montar(def, valores);
      alvoTexto.innerHTML = r.partes.map(function (x) {
        return x.slot ? '<b class="wc-slot">' + W.escapar(x.t) + '</b>' : W.escapar(x.t);
      }).join('');
      if (!ids.length && r.faltam === 0) alvoAviso.textContent = '';
      else if (r.faltam === 0) alvoAviso.textContent = 'Pronto para copiar.';
      else alvoAviso.textContent = (r.faltam === 1 ? 'Falta 1 campo, em azul.' : 'Faltam ' + r.faltam + ' campos, em azul.') + ' Você pode copiar assim mesmo e completar no ChatGPT.';
      return r;
    }
    ids.forEach(function (k) {
      var el = raiz.querySelector('#' + uid + '-' + k);
      if (el && valores[k] !== undefined) el.value = valores[k];
      el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', function () {
        valores[k] = el.value;
        if (def.chave) W.store.set(def.chave, valores);
        pintar();
      });
    });
    var rest = raiz.querySelector('[data-restaurar]');
    if (rest) rest.addEventListener('click', function () {
      valores = {};
      ids.forEach(function (k) {
        if (def.campos[k].padrao !== undefined) valores[k] = def.campos[k].padrao;
        raiz.querySelector('#' + uid + '-' + k).value = valores[k] || '';
      });
      if (def.chave) W.store.set(def.chave, valores);
      pintar();
      W.toast('Pedido original de volta.');
    });
    raiz.querySelector('[data-copiar]').addEventListener('click', function () {
      W.copiar(montar(def, valores).texto, alvoTexto);
    });
    pintar();
    return { texto: function () { return montar(def, valores).texto; } };
  }

  W.pedido = pedido;
})();
