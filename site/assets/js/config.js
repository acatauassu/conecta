/* Dados do evento. O time da WIN edita este arquivo; as páginas leem daqui.
   wifiRede e wifiSenha: preencha no dia (ou antes). Se ficarem vazios, a página diz que a equipe informa na sala.
   avaliacaoUrl: endereço do formulário de avaliação (o mesmo do QR code do slide). Já aponta para a página avaliacao/ deste site.
     Se preferir um formulário externo, troque pelo endereço dele. Vazio: o M9 diz que a equipe passa o link.
   avaliacaoEnvioUrl: endereço que recebe as respostas da página avaliacao/ (POST em JSON). Veja o cabeçalho de avaliacao/avaliacao.js.
   avaliacaoEnviar: (opcional) função que recebe as respostas e devolve uma Promise, no lugar de avaliacaoEnvioUrl.
     Exemplo: avaliacaoEnviar: function (dados) { return fetch('/api/avaliacoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) }); }
     Sem um dos dois, a página mostra "não conseguimos enviar agora". Configure antes do evento.
   proximosCursosUrl: página dos próximos cursos da WIN Business School. Vazio: o botão não aparece. */
window.WIN_CONECTA_CONFIG = {
  data: '25/11/2026 (quarta)',
  horario: '17h às 22h',
  local: 'Nex Hall, Belém/PA',
  wifiRede: '',
  wifiSenha: '',
  avaliacaoUrl: '../avaliacao/index.html',
  avaliacaoEnvioUrl: '',
  proximosCursosUrl: ''
};
