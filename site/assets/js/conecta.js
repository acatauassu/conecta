/* WIN Conecta 50+ — funções compartilhadas por todas as páginas.
   Tudo fica só no navegador da pessoa (localStorage). Nada é enviado a nenhum servidor.
   Uso: window.WinConecta */
(function () {
  'use strict';

  var PREFIXO = 'winconecta50:v1:';
  var memoria = {}; // plano B quando o navegador bloqueia o armazenamento

  var store = {
    get: function (chave, padrao) {
      try {
        var bruto = window.localStorage.getItem(PREFIXO + chave);
        if (bruto !== null) return JSON.parse(bruto);
      } catch (e) { /* segue para a memória */ }
      return Object.prototype.hasOwnProperty.call(memoria, chave) ? memoria[chave] : padrao;
    },
    set: function (chave, valor) {
      memoria[chave] = valor;
      try { window.localStorage.setItem(PREFIXO + chave, JSON.stringify(valor)); } catch (e) { /* só em memória */ }
    },
    remove: function (chave) {
      delete memoria[chave];
      try { window.localStorage.removeItem(PREFIXO + chave); } catch (e) { /* nada a fazer */ }
    },
    limparTudo: function () {
      memoria = {};
      try {
        Object.keys(window.localStorage).forEach(function (k) {
          if (k.indexOf(PREFIXO) === 0) window.localStorage.removeItem(k);
        });
      } catch (e) { /* nada a fazer */ }
    }
  };

  /* Meu cartão de contexto: cinco campos, usados em vários módulos */
  var CAMPOS_CARTAO = [
    { id: 'quem', rotulo: 'Quem sou', dica: 'Nome, idade e cidade, se quiser.' },
    { id: 'faco', rotulo: 'O que faço', dica: 'Sua profissão, seu negócio ou o que você faz hoje.' },
    { id: 'escrevo', rotulo: 'Para quem escrevo', dica: 'Clientes, colegas, família, alunos.' },
    { id: 'falo', rotulo: 'Como gosto de falar', dica: 'Simples, acolhedor, direto, formal.' },
    { id: 'evito', rotulo: 'O que quero evitar', dica: 'Gírias, textos muito longos, termos difíceis.' }
  ];

  function getCartao() {
    var salvo = store.get('cartao', {});
    var obj = {};
    CAMPOS_CARTAO.forEach(function (c) { obj[c.id] = (salvo && salvo[c.id]) || ''; });
    return obj;
  }
  function setCartao(obj) { store.set('cartao', obj); }
  function cartaoTexto(obj) {
    var c = obj || getCartao();
    var partes = [];
    CAMPOS_CARTAO.forEach(function (campo) {
      var v = (c[campo.id] || '').trim();
      if (v) partes.push(campo.rotulo + ': ' + v.replace(/[.\s]+$/, '') + '.');
    });
    return partes.join(' ');
  }

  /* Aviso falado por leitores de tela e mostrado na tela */
  var toastEl = null, toastTimer = null;
  function toast(mensagem) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'wc-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.hidden = true;
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = mensagem;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4200);
  }

  /* Copiar: usa a área de transferência e, se o navegador recusar, seleciona o texto */
  function selecionar(el) {
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }
  function copiar(texto, elementoParaSelecionar, mensagemOk) {
    var falhou = function () {
      if (elementoParaSelecionar) selecionar(elementoParaSelecionar);
      toast('Não consegui copiar sozinho. O texto está selecionado: toque e segure, ou aperte Ctrl+C.');
      return false;
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(texto).then(function () {
        toast(mensagemOk || 'Pedido copiado. Agora cole no ChatGPT.');
        return true;
      }, falhou);
    }
    return Promise.resolve(falhou());
  }

  function escapar(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Campos que se salvam sozinhos: <input data-salvar="chave">.
     Funciona com texto, caixa de seleção e grupo de opções (radio: todas com a mesma chave). */
  function salvarCampos(raiz) {
    (raiz || document).querySelectorAll('[data-salvar]').forEach(function (el) {
      var chave = el.getAttribute('data-salvar');
      var salvo = store.get(chave, null);
      if (salvo !== null) {
        if (el.type === 'checkbox') el.checked = !!salvo;
        else if (el.type === 'radio') el.checked = (el.value === salvo);
        else el.value = salvo;
      }
      var evento = (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(evento, function () {
        if (el.type === 'checkbox') store.set(chave, el.checked);
        else if (el.type === 'radio') { if (el.checked) store.set(chave, el.value); }
        else store.set(chave, el.value);
      });
    });
  }

  window.WinConecta = {
    store: store,
    CAMPOS_CARTAO: CAMPOS_CARTAO,
    getCartao: getCartao,
    setCartao: setCartao,
    cartaoTexto: cartaoTexto,
    toast: toast,
    copiar: copiar,
    escapar: escapar,
    salvarCampos: salvarCampos
  };
})();
