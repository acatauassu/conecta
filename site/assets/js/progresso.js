/* Progresso da pessoa em cada módulo, lido do que ela escreveu neste aparelho.
   Nada é enviado a nenhum servidor. Depende de conecta.js.
   WinConecta.progresso.modulos() devolve, para cada módulo: id, numero, hora, titulo, pasta, feitos, total, estado. */
(function () {
  'use strict';
  var W = window.WinConecta;

  function cheio(v) {
    if (v === null || v === undefined || v === false) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'object') return Object.keys(v).some(function (k) { return cheio(v[k]); });
    return !!v;
  }
  function k(chave) { return cheio(W.store.get(chave, null)); }
  function qualquer(chaves) { return chaves.some(k); }
  function todos(chaves) { return chaves.every(k); }
  function cartao() { return !!W.cartaoTexto(); }
  function calendario() { var r = []; for (var i = 1; i <= 7; i++) r.push('m8.cal.' + i + '.c', 'm8.cal.' + i + '.h'); return r; }

  /* Cada módulo tem uma lista de "sinais": coisas que a pessoa faz nele. Feito = todos os sinais. */
  var MODULOS = [
    { numero: 1, hora: '17h00', titulo: 'Chegada e abertura', pasta: 'm1', sinais: [
      function () { return todos(['m1.acesso.wifi', 'm1.acesso.chatgpt', 'm1.acesso.app', 'm1.acesso.ola']); },
      function () { return k('entrada.nome'); }, function () { return k('entrada.nivel'); }, function () { return k('entrada.plano'); } ] },
    { numero: 2, hora: '17h30', titulo: 'Como a IA funciona', pasta: 'm2', sinais: [
      function () { return qualquer(['m2.usos.pesquisar', 'm2.usos.duvidas', 'm2.usos.escrever']); },
      function () { return k('m2.mudou'); }, function () { return k('m2.acertou'); }, function () { return k('m2.errado') || k('m2.duvida'); } ] },
    { numero: 3, hora: '17h50', titulo: 'Os 4 C e o cartão de contexto', pasta: 'm3', sinais: [
      function () { return k('m3.situacao'); }, function () { return k('m3.p1'); }, cartao,
      function () { return todos(['m3.pronto.salvei', 'm3.pronto.testei', 'm3.pronto.soou']); } ] },
    { numero: 4, hora: '18h30', titulo: 'Tarefa 1 · Escrever com a minha voz', pasta: 'm4', sinais: [
      function () { return k('m4.tipo'); }, function () { return k('m4.p'); }, function () { return qualquer(['m4.ajuste1', 'm4.ajuste2']); },
      function () { return k('m4.melhorou'); }, function () { return k('m4.validado'); } ] },
    { numero: 5, hora: '19h10', titulo: 'Conferir: Régua dos 5', pasta: 'm5', sinais: [
      function () { return k('m5.p'); },
      function () { return todos(['m5.regua.nomes', 'm5.regua.numeros', 'm5.regua.fatos', 'm5.regua.promessas', 'm5.regua.jeito']); },
      function () { return qualquer(['m5.encontrei', 'm5.corrigido']); } ] },
    { numero: 6, hora: '19h45', titulo: 'Tarefa 2 · Preparar a reunião', pasta: 'm6', sinais: [
      function () { return k('m6.tipo'); }, function () { return k('m6.p1') || k('m6.p1e'); },
      function () { return todos(['m6.regua.nomes', 'm6.regua.numeros', 'm6.regua.fatos', 'm6.regua.promessas', 'm6.regua.jeito', 'm6.fonte1', 'm6.fonte2']); },
      function () { return k('m6.abertura'); }, function () { return qualquer(['m6.ensaio.li', 'm6.ensaio.troquei']); }, function () { return k('m6.funcionou'); } ] },
    { numero: 7, hora: '20h30', titulo: 'Panorama das outras IAs', pasta: 'm7', sinais: [
      function () { return qualquer(['m7.obs.comparei', 'm7.obs.fonte', 'm7.obs.link']); },
      function () { return qualquer(['m7.jogo.a', 'm7.jogo.b', 'm7.jogo.c', 'm7.jogo.d']); }, function () { return k('m7.testar'); } ] },
    { numero: 8, hora: '20h50', titulo: 'Tarefa 3 · Divulgar o meu trabalho', pasta: 'm8', sinais: [
      function () { return k('m8.descricao'); }, function () { return k('m8.ideias'); }, function () { return k('m8.legenda'); },
      function () { return todos(['m8.pub.promessas', 'm8.pub.numeros', 'm8.pub.fatos', 'm8.pub.imagem', 'm8.pub.jeito']); },
      function () { return qualquer(calendario()); },
      function () { return k('m8.validado'); } ] },
    { numero: 9, hora: '21h30', titulo: 'Connect Pack e fechamento', pasta: 'm9', sinais: [
      function () { return k('m9.modelo'); }, function () { return qualquer(['m9.s1', 'm9.s2', 'm9.s3']); } ] }
  ];

  function modulos() {
    return MODULOS.map(function (m) {
      var feitos = 0;
      m.sinais.forEach(function (s) { if (s()) feitos++; });
      var total = m.sinais.length;
      return {
        id: 'm' + m.numero, numero: m.numero, hora: m.hora, titulo: m.titulo, pasta: m.pasta,
        feitos: feitos, total: total,
        estado: feitos === 0 ? 'novo' : (feitos >= total ? 'feito' : 'andamento')
      };
    });
  }

  window.WinConecta.progresso = { modulos: modulos, cheio: cheio };
})();
