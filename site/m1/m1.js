/* Módulo 1: chegada e abertura. Depende de ../assets/js/conecta.js e config.js */
(function () {
  'use strict';
  var W = window.WinConecta;
  var CFG = window.WIN_CONECTA_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };

  /* Dados do evento e Wi-Fi vêm de assets/js/config.js */
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var v = CFG[el.getAttribute('data-cfg')];
    if (v) el.textContent = v;
  });
  if (CFG.wifiRede) $('#wifi-rede').textContent = CFG.wifiRede;
  if (CFG.wifiSenha) $('#wifi-senha').textContent = CFG.wifiSenha;

  /* Campos que se salvam sozinhos */
  W.salvarCampos(document);

  /* Progresso do check de acesso */
  var passos = document.querySelectorAll('[data-acesso]');
  function progresso() {
    var feitos = 0;
    passos.forEach(function (p) { if (p.checked) feitos++; });
    $('#prog-barra').style.width = (feitos / passos.length * 100) + '%';
    if (feitos === passos.length) {
      $('#prog-texto').textContent = 'Tudo pronto! 4 de 4 passos feitos.';
      $('#prog-ajuda').textContent = 'Quando todos da sua mesa estiverem prontos, vire o cartão verde da mesa.';
    } else {
      $('#prog-texto').textContent = feitos + ' de ' + passos.length + ' passos feitos.';
      $('#prog-ajuda').textContent = 'Travou em algum passo? Levante a mão ou o cartão amarelo da mesa: a equipe vai até você.';
    }
  }
  passos.forEach(function (p) { p.addEventListener('change', progresso); });
  progresso();

  /* Eco do cartão de entrada, para ajudar na apresentação da mesa */
  function eco() {
    var nome = W.store.get('entrada.nome', '') || '';
    var quero = W.store.get('entrada.quero', '') || '';
    var alvo = $('#eco');
    if (!nome.trim() && !quero.trim()) {
      alvo.innerHTML = '<span class="wc-legenda">Preencha o cartão de entrada acima e o que você escreveu aparece aqui, para ajudar na sua vez.</span>';
      return;
    }
    alvo.innerHTML = (nome.trim() ? '<strong>' + W.escapar(nome.trim()) + '</strong><br>' : '') +
      (quero.trim() ? 'Quero resolver: ' + W.escapar(quero.trim()) : '');
  }
  ['#e-nome', '#e-quero'].forEach(function (s) { $(s).addEventListener('input', eco); });
  eco();

  /* Meu minuto */
  var RESTANTE_INICIAL = 60;
  var restante = RESTANTE_INICIAL, fim = 0, tick = null, rodando = false;
  var relogio = $('#relogio'), botao = $('#relogio-iniciar');
  function mostrar(seg) {
    var s = Math.max(0, Math.ceil(seg));
    relogio.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function parar() { clearInterval(tick); tick = null; rodando = false; }
  function atualizar() {
    var seg = (fim - Date.now()) / 1000;
    if (seg <= 0) {
      parar(); restante = 0; mostrar(0);
      botao.textContent = 'Começar de novo';
      W.toast('Tempo! Passe a vez para a próxima pessoa.');
      return;
    }
    restante = seg; mostrar(seg);
  }
  botao.addEventListener('click', function () {
    if (rodando) { parar(); botao.textContent = 'Continuar'; return; }
    if (restante <= 0) restante = RESTANTE_INICIAL;
    fim = Date.now() + restante * 1000;
    rodando = true; botao.textContent = 'Pausar';
    tick = setInterval(atualizar, 250); atualizar();
  });
  $('#relogio-zerar').addEventListener('click', function () {
    parar(); restante = RESTANTE_INICIAL; mostrar(restante); botao.textContent = 'Começar';
  });

  /* Apagar tudo */
  $('#btn-apagar-tudo').addEventListener('click', function () {
    W.store.limparTudo();
    W.toast('Tudo que você escreveu foi apagado deste aparelho.');
    setTimeout(function () { window.location.reload(); }, 900);
  });
})();
